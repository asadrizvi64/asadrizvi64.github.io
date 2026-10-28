/* ASAD·TRIS: a small Tetris for the hero cabinet.
   Idle: an AI plays a demo, picking placements with the 4-feature heuristic
   (aggregate height, completed lines, holes, bumpiness).
   Press start: you play. Keyboard and on-screen pad both work. */
(function () {
    'use strict';

    const well = document.getElementById('well');
    if (!well || !well.getContext) return;

    const nextCv = document.getElementById('nextPiece');
    const cabinet = document.getElementById('cabinet');
    const overlay = document.getElementById('cabOverlay');
    const startBtn = document.getElementById('startBtn');
    const pad = document.getElementById('pad');
    const $score = document.getElementById('score');
    const $lines = document.getElementById('lines');
    const $level = document.getElementById('level');
    const $hi = document.getElementById('hi');
    const $navHi = document.getElementById('navHi');

    const ctx = well.getContext('2d');
    const nctx = nextCv.getContext('2d');

    const COLS = 10;
    const ROWS = 20;
    const COLORS = {
        I: '#42e8ff', O: '#ffe45e', T: '#a855ff', S: '#44ff6a',
        Z: '#ff9ccf', J: '#6b85ff', L: '#ff9d42'
    };
    const SHAPES = {
        I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
        O: [[1, 1], [1, 1]],
        T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
        Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
        J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
        L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
    };
    const KEYS = Object.keys(SHAPES);
    const LINE_SCORES = [0, 100, 300, 500, 800];
    const KICKS = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1]];
    const LOCK_DELAY = 480;
    const FLASH_MS = 200;
    const AI_STEP_MS = 70;
    const AI_DROP_MS = 26;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- pure helpers ---------- */
    const rotateCW = (m) => m.map((row, y) => row.map((_, x) => m[m.length - 1 - x][y]));
    const rotateCCW = (m) => rotateCW(rotateCW(rotateCW(m)));
    const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const cloneBoard = (b) => b.map((r) => r.slice());

    function collides(board, shape, px, py) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (!shape[y][x]) continue;
                const bx = px + x;
                const by = py + y;
                if (bx < 0 || bx >= COLS || by >= ROWS) return true;
                if (by >= 0 && board[by][bx]) return true;
            }
        }
        return false;
    }

    // Writes the piece into the board. Returns true if any cell is above the top (game over).
    function merge(board, shape, px, py, key) {
        let overflow = false;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (!shape[y][x]) continue;
                const by = py + y;
                if (by < 0) { overflow = true; continue; }
                board[by][px + x] = key;
            }
        }
        return overflow;
    }

    const fullRows = (board) => board.reduce((acc, row, i) => (row.every(Boolean) ? acc.concat(i) : acc), []);

    function removeRows(board, rows) {
        const kept = board.filter((_, i) => rows.indexOf(i) === -1);
        while (kept.length < ROWS) kept.unshift(Array(COLS).fill(null));
        return kept;
    }

    function topPad(shape) {
        for (let y = 0; y < shape.length; y++) if (shape[y].some(Boolean)) return y;
        return 0;
    }

    function dropY(board, shape, px, py) {
        while (!collides(board, shape, px, py + 1)) py++;
        return py;
    }

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /* ---------- AI ---------- */
    function features(board) {
        const heights = new Array(COLS).fill(0);
        let holes = 0;
        for (let x = 0; x < COLS; x++) {
            let seen = false;
            for (let y = 0; y < ROWS; y++) {
                if (board[y][x]) {
                    if (!seen) { heights[x] = ROWS - y; seen = true; }
                } else if (seen) {
                    holes++;
                }
            }
        }
        let agg = 0;
        let bump = 0;
        for (let x = 0; x < COLS; x++) {
            agg += heights[x];
            if (x < COLS - 1) bump += Math.abs(heights[x] - heights[x + 1]);
        }
        return { agg, holes, bump };
    }

    function plan(board, key) {
        let best = null;
        let shape = SHAPES[key];
        for (let r = 0; r < 4; r++) {
            for (let x = -3; x < COLS; x++) {
                const y0 = -shape.length;
                if (collides(board, shape, x, y0)) continue;
                const y = dropY(board, shape, x, y0);
                const b = cloneBoard(board);
                const overflow = merge(b, shape, x, y, key);
                const rows = fullRows(b);
                const f = features(removeRows(b, rows));
                let score = -0.510066 * f.agg + 0.760666 * rows.length - 0.35663 * f.holes - 0.184483 * f.bump;
                score += (Math.random() - 0.5) * 0.12; // a little noise so the demo doesn't look scripted
                if (overflow) score -= 1000;
                if (!best || score > best.score) best = { score, rot: r, x };
            }
            shape = rotateCW(shape);
        }
        return best || { rot: 0, x: 3 };
    }

    /* ---------- state ---------- */
    const S = {
        board: emptyBoard(),
        bag: [],
        cur: null,
        next: null,
        score: 0,
        lines: 0,
        level: 1,
        mode: 'demo', // demo | play | over
        paused: false,
        flash: null, // { rows, t }
        dropAcc: 0,
        lockAcc: 0,
        aiAcc: 0,
        aiPlan: null,
        visible: true,
        overTimer: null,
        bs: 22
    };

    let hi = 0;
    try { hi = parseInt(localStorage.getItem('asadtris-hi') || '0', 10) || 0; } catch (e) { hi = 0; }

    function nextKey() {
        if (!S.bag.length) S.bag = shuffle(KEYS.slice());
        return S.bag.pop();
    }

    function spawn() {
        const key = S.next || nextKey();
        S.next = nextKey();
        const shape = SHAPES[key].map((r) => r.slice());
        const x = Math.floor((COLS - shape[0].length) / 2);
        const y = -topPad(shape);
        S.cur = { key, shape, x, y, rotDone: 0 };
        S.dropAcc = 0;
        S.lockAcc = 0;
        S.aiAcc = 0;
        drawNext();
        if (collides(S.board, shape, x, y)) {
            gameOver();
            return;
        }
        if (S.mode === 'demo') S.aiPlan = plan(S.board, key);
    }

    function resetGame() {
        S.board = emptyBoard();
        S.bag = [];
        S.next = null;
        S.score = 0;
        S.lines = 0;
        S.level = 1;
        S.flash = null;
        S.paused = false;
        spawn();
        hud();
    }

    function move(dx) {
        const c = S.cur;
        if (!collides(S.board, c.shape, c.x + dx, c.y)) {
            c.x += dx;
            S.lockAcc = 0;
            return true;
        }
        return false;
    }

    function rotate(dir) {
        const c = S.cur;
        const r = dir > 0 ? rotateCW(c.shape) : rotateCCW(c.shape);
        for (const [dx, dy] of KICKS) {
            if (!collides(S.board, r, c.x + dx, c.y + dy)) {
                c.shape = r;
                c.x += dx;
                c.y += dy;
                S.lockAcc = 0;
                return true;
            }
        }
        return false;
    }

    function stepDown() {
        const c = S.cur;
        if (!collides(S.board, c.shape, c.x, c.y + 1)) {
            c.y++;
            return true;
        }
        return false;
    }

    function hardDrop() {
        const c = S.cur;
        const y = dropY(S.board, c.shape, c.x, c.y);
        if (S.mode === 'play') S.score += 2 * (y - c.y);
        c.y = y;
        lock();
    }

    function lock() {
        const c = S.cur;
        const overflow = merge(S.board, c.shape, c.x, c.y, c.key);
        S.cur = null;
        if (overflow) { gameOver(); return; }
        const rows = fullRows(S.board);
        if (rows.length) {
            S.lines += rows.length;
            S.score += LINE_SCORES[rows.length] * S.level;
            S.level = 1 + Math.floor(S.lines / 10);
            S.flash = { rows, t: 0 };
        } else {
            spawn();
        }
        hud();
    }

    function gameOver() {
        S.cur = null;
        if (S.mode === 'demo') {
            // demo just starts over
            S.board = emptyBoard();
            S.score = 0;
            S.lines = 0;
            S.level = 1;
            spawn();
            hud();
            return;
        }
        S.mode = 'over';
        saveHi();
        showOverlay('GAME OVER', true);
        startBtn.textContent = '▶ PLAY AGAIN';
        pad.hidden = true;
        clearTimeout(S.overTimer);
        S.overTimer = setTimeout(() => { if (S.mode === 'over') toDemo(); }, 9000);
    }

    function saveHi() {
        if (S.score > hi) {
            hi = S.score;
            try { localStorage.setItem('asadtris-hi', String(hi)); } catch (e) { /* storage blocked */ }
        }
        hud();
    }

    /* ---------- modes ---------- */
    function toDemo() {
        clearTimeout(S.overTimer);
        if (S.mode === 'play') saveHi(); // quitting still counts
        S.mode = 'demo';
        pad.hidden = true;
        startBtn.textContent = '▶ PRESS START';
        resetGame();
        if (reduceMotion) {
            seedStatic();
            showOverlay('PRESS START', true);
        } else {
            showOverlay('DEMO · AI PLAYING', false);
        }
        kick();
    }

    function toPlay() {
        clearTimeout(S.overTimer);
        S.mode = 'play';
        pad.hidden = false;
        startBtn.textContent = '■ QUIT GAME';
        showOverlay(null);
        resetGame();
        well.focus({ preventScroll: true });
        kick();
    }

    function togglePause() {
        if (S.mode !== 'play') return;
        S.paused = !S.paused;
        showOverlay(S.paused ? 'PAUSED · P TO RESUME' : null, true);
    }

    function showOverlay(text, center) {
        if (!text) { overlay.hidden = true; return; }
        overlay.hidden = false;
        overlay.textContent = text;
        overlay.classList.toggle('is-center', !!center);
    }

    // A frozen board for reduced-motion visitors
    function seedStatic() {
        const rows = [
            'IIII.OOTTT',
            'SS.LLOOJTZ',
            'ZSSLJJJ.ZZ',
            'ZZ.LTTTIIZ'
        ];
        S.board = emptyBoard();
        rows.forEach((r, i) => {
            const y = ROWS - rows.length + i;
            for (let x = 0; x < COLS; x++) S.board[y][x] = r[x] === '.' ? null : r[x];
        });
        S.cur = { key: 'T', shape: SHAPES.T.map((r) => r.slice()), x: 4, y: 6, rotDone: 0 };
    }

    /* ---------- update ---------- */
    function update(dt) {
        if (S.mode === 'over') return;
        if (S.flash) {
            S.flash.t += dt;
            if (S.flash.t >= FLASH_MS) {
                S.board = removeRows(S.board, S.flash.rows);
                S.flash = null;
                spawn();
            }
            return;
        }
        if (!S.cur) return;

        if (S.mode === 'demo') {
            if (reduceMotion) return;
            const p = S.aiPlan;
            const c = S.cur;
            S.aiAcc += dt;
            const aligned = c.rotDone >= p.rot && c.x === p.x;
            const step = aligned ? AI_DROP_MS : AI_STEP_MS;
            while (S.aiAcc >= step && S.cur) {
                S.aiAcc -= step;
                if (c.rotDone < p.rot) {
                    rotate(1);
                    c.rotDone++;
                } else if (c.x !== p.x) {
                    if (!move(c.x < p.x ? 1 : -1)) p.x = c.x; // blocked, give up on the column
                } else if (!stepDown()) {
                    lock();
                    break;
                }
            }
            return;
        }

        // play
        if (S.paused) return;
        const gravity = Math.max(90, 800 - (S.level - 1) * 65);
        S.dropAcc += dt;
        while (S.dropAcc >= gravity) {
            S.dropAcc -= gravity;
            stepDown();
        }
        const c = S.cur;
        if (c && collides(S.board, c.shape, c.x, c.y + 1)) {
            S.lockAcc += dt;
            if (S.lockAcc >= LOCK_DELAY) lock();
        } else {
            S.lockAcc = 0;
        }
    }

    function act(a) {
        if (S.mode !== 'play' || S.paused || S.flash || !S.cur) return;
        switch (a) {
            case 'left': move(-1); break;
            case 'right': move(1); break;
            case 'rotate': rotate(1); break;
            case 'rotateCCW': rotate(-1); break;
            case 'down':
                if (stepDown()) { S.score += 1; S.dropAcc = 0; hud(); }
                break;
            case 'drop': hardDrop(); break;
        }
    }

    /* ---------- render ---------- */
    function cell(c, x, y, s, color) {
        const b = Math.max(2, Math.round(s * 0.16));
        c.fillStyle = color;
        c.fillRect(x + 1, y + 1, s - 2, s - 2);
        c.fillStyle = 'rgba(255,255,255,.45)';
        c.fillRect(x + 1, y + 1, s - 2, b);
        c.fillRect(x + 1, y + 1, b, s - 2);
        c.fillStyle = 'rgba(0,0,0,.32)';
        c.fillRect(x + 1, y + s - 1 - b, s - 2, b);
        c.fillRect(x + s - 1 - b, y + 1, b, s - 2);
        c.fillStyle = 'rgba(255,255,255,.8)';
        c.fillRect(x + 1 + b, y + 1 + b, b, b);
    }

    function draw() {
        const s = S.bs;
        const W = COLS * s;
        const H = ROWS * s;
        ctx.fillStyle = '#0a0313';
        ctx.fillRect(0, 0, W, H);

        // grid
        ctx.fillStyle = 'rgba(168,85,255,.09)';
        for (let x = 1; x < COLS; x++) ctx.fillRect(x * s, 0, 1, H);
        for (let y = 1; y < ROWS; y++) ctx.fillRect(0, y * s, W, 1);

        // settled blocks
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const k = S.board[y][x];
                if (k) cell(ctx, x * s, y * s, s, COLORS[k]);
            }
        }

        // line-clear flash
        if (S.flash) {
            const on = Math.floor(S.flash.t / 50) % 2 === 0;
            ctx.fillStyle = on ? 'rgba(255,255,255,.85)' : 'rgba(68,255,106,.75)';
            S.flash.rows.forEach((r) => ctx.fillRect(0, r * s, W, s));
        }

        const c = S.cur;
        if (c) {
            // ghost piece while playing
            if (S.mode === 'play') {
                const gy = dropY(S.board, c.shape, c.x, c.y);
                ctx.strokeStyle = 'rgba(255,255,255,.28)';
                ctx.lineWidth = 2;
                c.shape.forEach((row, y) => row.forEach((v, x) => {
                    if (v && gy + y >= 0) ctx.strokeRect((c.x + x) * s + 2, (gy + y) * s + 2, s - 4, s - 4);
                }));
            }
            c.shape.forEach((row, y) => row.forEach((v, x) => {
                if (v && c.y + y >= 0) cell(ctx, (c.x + x) * s, (c.y + y) * s, s, COLORS[c.key]);
            }));
        }
    }

    function drawNext() {
        const w = nextCv.width / dpr();
        const h = nextCv.height / dpr();
        nctx.clearRect(0, 0, w, h);
        if (!S.next) return;
        const m = SHAPES[S.next];
        const ys = [];
        const xs = [];
        m.forEach((row, y) => row.forEach((v, x) => { if (v) { ys.push(y); xs.push(x); } }));
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const cw = Math.max(...xs) - minX + 1;
        const ch = Math.max(...ys) - minY + 1;
        const s = Math.floor(Math.min(w / 4.4, h / 2.6));
        const ox = Math.round((w - cw * s) / 2);
        const oy = Math.round((h - ch * s) / 2);
        m.forEach((row, y) => row.forEach((v, x) => {
            if (v) cell(nctx, ox + (x - minX) * s, oy + (y - minY) * s, s, COLORS[S.next]);
        }));
    }

    const fmt = (n) => String(n).padStart(6, '0');
    function hud() {
        $score.textContent = fmt(S.score);
        $lines.textContent = String(S.lines);
        $level.textContent = String(S.level);
        const shownHi = Math.max(hi, S.mode === 'play' ? S.score : 0);
        $hi.textContent = fmt(shownHi);
        if ($navHi) $navHi.textContent = fmt(shownHi);
    }

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
        const bs = parseFloat(getComputedStyle(cabinet).getPropertyValue('--bs')) || 22;
        const r = dpr();
        S.bs = bs;
        well.width = COLS * bs * r;
        well.height = ROWS * bs * r;
        ctx.setTransform(r, 0, 0, r, 0, 0);
        const nb = nextCv.getBoundingClientRect();
        nextCv.width = Math.max(1, Math.round(nb.width * r));
        nextCv.height = Math.max(1, Math.round(nb.height * r));
        nctx.setTransform(r, 0, 0, r, 0, 0);
        drawNext();
        draw();
    }

    /* ---------- loop: runs only while the cabinet is on screen ---------- */
    let raf = 0;
    let last = 0;
    function frame(t) {
        const dt = Math.min(100, t - last);
        last = t;
        update(dt);
        draw();
        const animating = !(reduceMotion && S.mode === 'demo') && S.mode !== 'over';
        raf = (S.visible && !document.hidden && animating) ? requestAnimationFrame(frame) : 0;
    }
    function kick() {
        draw();
        if (!raf && S.visible && !document.hidden) {
            last = performance.now();
            raf = requestAnimationFrame(frame);
        }
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            S.visible = entries[0].isIntersecting;
            if (!S.visible && S.mode === 'play' && !S.paused) togglePause();
            if (S.visible) kick();
        }, { threshold: 0.2 }).observe(cabinet);
    }
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && S.mode === 'play' && !S.paused) togglePause();
        if (!document.hidden) kick();
    });

    /* ---------- input ---------- */
    startBtn.addEventListener('click', () => {
        if (S.mode === 'play') toDemo();
        else toPlay();
    });

    well.tabIndex = -1;
    well.addEventListener('click', () => { if (S.mode === 'play') togglePause(); });

    window.addEventListener('keydown', (e) => {
        if (S.mode !== 'play' || !S.visible) return;
        if (document.querySelector('dialog[open]')) return;
        const t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
        let handled = true;
        switch (e.key) {
            case 'ArrowLeft': act('left'); break;
            case 'ArrowRight': act('right'); break;
            case 'ArrowDown': act('down'); break;
            case 'ArrowUp': case 'x': case 'X': act('rotate'); break;
            case 'z': case 'Z': act('rotateCCW'); break;
            case ' ': case 'Spacebar': if (!e.repeat) act('drop'); break;
            case 'p': case 'P': togglePause(); break;
            case 'Escape': toDemo(); break;
            default: handled = false;
        }
        if (handled) e.preventDefault();
    });
    // stop Space from "clicking" a focused button while playing
    window.addEventListener('keyup', (e) => {
        if (S.mode === 'play' && (e.key === ' ' || e.key === 'Spacebar')) e.preventDefault();
    });

    // on-screen pad with hold-to-repeat
    let repeatT = 0;
    let repeatI = 0;
    const stopRepeat = () => { clearTimeout(repeatT); clearInterval(repeatI); };
    pad.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.act;
        b.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            act(a);
            stopRepeat();
            if (a === 'left' || a === 'right' || a === 'down') {
                repeatT = setTimeout(() => { repeatI = setInterval(() => act(a), 70); }, 170);
            }
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, stopRepeat));
        b.addEventListener('click', (e) => e.preventDefault());
    });

    let resizeT = 0;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(resize, 120);
    });

    /* ---------- boot ---------- */
    resize();
    toDemo();
})();
