/* Illustrative "splat avatar" for the XISION card.
   ~560 soft splats are locked to a procedural walking skeleton (each splat stores
   bone, position along the bone, angle and radius, like per-triangle splat binding),
   turned on a turntable and drawn at low resolution, then upscaled with pixelated
   sampling for the 8-bit look. It is a sketch of the idea, not output from the real pipeline. */
(function () {
    'use strict';

    const PALETTE = {
        head: '#ff9ccf',
        torso: '#a855ff',
        arm: '#44ff6a',
        hand: '#ff9ccf',
        leg: '#42e8ff',
        foot: '#ffe45e'
    };

    // bone list: [from joint, to joint, radius at start, radius at end, splat count, palette key]
    const BONES = [
        ['pelvis', 'chest', 0.15, 0.17, 110, 'torso'],
        ['chest', 'neck', 0.17, 0.08, 50, 'torso'],
        ['hipL', 'hipR', 0.09, 0.09, 20, 'torso'],
        ['shL', 'shR', 0.07, 0.07, 22, 'torso'],
        ['neck', 'headBase', 0.05, 0.05, 8, 'head'],
        ['hipL', 'kneeL', 0.08, 0.06, 36, 'leg'],
        ['hipR', 'kneeR', 0.08, 0.06, 36, 'leg'],
        ['kneeL', 'ankleL', 0.055, 0.045, 30, 'leg'],
        ['kneeR', 'ankleR', 0.055, 0.045, 30, 'leg'],
        ['ankleL', 'toeL', 0.045, 0.035, 12, 'foot'],
        ['ankleR', 'toeR', 0.045, 0.035, 12, 'foot'],
        ['shL', 'elbowL', 0.05, 0.045, 24, 'arm'],
        ['shR', 'elbowR', 0.05, 0.045, 24, 'arm'],
        ['elbowL', 'wristL', 0.042, 0.035, 20, 'arm'],
        ['elbowR', 'wristR', 0.042, 0.035, 20, 'arm'],
        ['wristL', 'handL', 0.035, 0.03, 6, 'hand'],
        ['wristR', 'handR', 0.035, 0.03, 6, 'hand']
    ];
    const HEAD_SPLATS = 70;

    const v = (x, y, z) => ({ x, y, z });
    const add = (a, b) => v(a.x + b.x, a.y + b.y, a.z + b.z);
    const sub = (a, b) => v(a.x - b.x, a.y - b.y, a.z - b.z);
    const mul = (a, s) => v(a.x * s, a.y * s, a.z * s);
    const cross = (a, b) => v(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    const norm = (a) => { const l = Math.hypot(a.x, a.y, a.z) || 1; return mul(a, 1 / l); };
    const dir = (pitch) => v(0, -Math.cos(pitch), Math.sin(pitch)); // limb direction in the sagittal plane

    function skeleton(phase) {
        const j = {};
        const bob = 0.025 * Math.cos(2 * phase);
        j.pelvis = v(0, 0.96 + bob, 0);
        j.chest = v(0, 1.28 + bob, 0.02);
        j.neck = v(0, 1.48 + bob, 0.03);
        j.headBase = v(0, 1.54 + bob, 0.03);
        j.head = v(0, 1.66 + bob, 0.04);
        j.hipL = v(-0.1, 0.93 + bob, 0);
        j.hipR = v(0.1, 0.93 + bob, 0);
        j.shL = v(-0.2, 1.43 + bob, 0.02);
        j.shR = v(0.2, 1.43 + bob, 0.02);

        [['L', phase], ['R', phase + Math.PI]].forEach(([s, p]) => {
            const a = 0.42 * Math.sin(p); // thigh swing
            const k = 0.12 + 0.6 * Math.max(0, Math.cos(p)); // knee flex during swing
            j['knee' + s] = add(j['hip' + s], mul(dir(a), 0.44));
            j['ankle' + s] = add(j['knee' + s], mul(dir(a - k), 0.43));
            j['toe' + s] = add(j['ankle' + s], v(0, -0.04, 0.15));
            // arms swing against the opposite leg
            const b = -0.38 * Math.sin(p);
            const e = 0.25 + 0.2 * Math.max(0, -Math.sin(p));
            j['elbow' + s] = add(j['sh' + s], mul(dir(b), 0.29));
            j['wrist' + s] = add(j['elbow' + s], mul(dir(b + e), 0.26));
            j['hand' + s] = add(j['wrist' + s], mul(dir(b + e), 0.08));
        });
        return j;
    }

    function rand(seed) {
        let s = seed >>> 0;
        return () => {
            s = (s + 0x6D2B79F5) >>> 0;
            let t = s;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function buildSplats() {
        const r = rand(64);
        const splats = [];
        BONES.forEach((b, bi) => {
            for (let i = 0; i < b[4]; i++) {
                splats.push({
                    bone: bi,
                    u: r(),
                    th: r() * Math.PI * 2,
                    rho: 0.7 + r() * 0.35,
                    size: 0.7 + r() * 0.9,
                    col: PALETTE[b[5]]
                });
            }
        });
        for (let i = 0; i < HEAD_SPLATS; i++) {
            const z = r() * 2 - 1;
            const t = r() * Math.PI * 2;
            const q = Math.sqrt(1 - z * z);
            splats.push({ head: true, d: v(q * Math.cos(t), z * 1.15, q * Math.sin(t)), rho: 0.75 + r() * 0.3, size: 0.8 + r() * 0.9, col: PALETTE.head });
        }
        return splats;
    }

    function sprite(color) {
        const c = document.createElement('canvas');
        c.width = c.height = 16;
        const g = c.getContext('2d');
        const grd = g.createRadialGradient(8, 8, 0, 8, 8, 8);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(0.25, color);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 16, 16);
        return c;
    }

    window.mountSplats = function (canvas) {
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');
        const splats = buildSplats();
        const sprites = {};
        Object.values(PALETTE).forEach((c) => { if (!sprites[c]) sprites[c] = sprite(c); });
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const PIX = 4; // upscale factor
        let W = 0;
        let H = 0;
        let raf = 0;
        let visible = true;
        let t0 = performance.now();

        function size() {
            const b = canvas.getBoundingClientRect();
            W = Math.max(40, Math.round(b.width / PIX));
            H = Math.max(60, Math.round(b.height / PIX));
            canvas.width = W;
            canvas.height = H;
        }

        function render(t) {
            const time = (t - t0) / 1000;
            const phase = time * 3.4;
            const yaw = 0.7 + time * 0.45; // start at a three-quarter view
            const cy = Math.cos(yaw);
            const sy = Math.sin(yaw);
            const j = skeleton(phase);
            const D = 3.6;
            const f = H * 1.5;
            const horizon = H * 0.5;

            ctx.clearRect(0, 0, W, H);

            // floor ring
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(168,85,255,.35)';
            for (let i = 0; i < 48; i++) {
                const a = (i / 48) * Math.PI * 2;
                const px = 0.42 * Math.cos(a);
                const pz = 0.42 * Math.sin(a);
                const zc = D - pz;
                ctx.fillRect(Math.round(W / 2 + (f * px) / zc), Math.round(horizon - (f * (0.0 - 0.96)) / zc), 1, 1);
            }

            // scan line sweeping the body
            const scanY = 0.1 + 1.65 * (0.5 + 0.5 * Math.sin(time * 1.3));
            const sly = Math.round(horizon - (f * (scanY - 0.96)) / D);
            ctx.fillStyle = 'rgba(68,255,106,.35)';
            ctx.fillRect(Math.round(W * 0.28), sly, Math.round(W * 0.44), 1);

            // splats
            const pts = [];
            for (let i = 0; i < splats.length; i++) {
                const s = splats[i];
                let p;
                if (s.head) {
                    p = add(j.head, mul(s.d, 0.105 * s.rho));
                } else {
                    const b = BONES[s.bone];
                    const A = j[b[0]];
                    const B = j[b[1]];
                    const d = norm(sub(B, A));
                    const ref = Math.abs(d.x) > 0.9 ? v(0, 1, 0) : v(1, 0, 0);
                    const e1 = norm(cross(d, ref));
                    const e2 = cross(d, e1);
                    const rad = (b[2] + (b[3] - b[2]) * s.u) * s.rho;
                    const torso = s.bone < 2;
                    const off = add(mul(e1, Math.cos(s.th) * rad * (torso ? 0.65 : 1)), mul(e2, Math.sin(s.th) * rad));
                    p = add(add(A, mul(sub(B, A), s.u)), off);
                }
                const x = p.x * cy - p.z * sy;
                const z = p.x * sy + p.z * cy;
                const zc = D - z;
                pts.push({
                    x: W / 2 + (f * x) / zc,
                    y: horizon - (f * (p.y - 0.96)) / zc,
                    z,
                    r: (s.size * f * 0.028) / zc,
                    col: s.col,
                    lit: Math.abs(p.y - scanY) < 0.05
                });
            }
            pts.sort((a, b) => a.z - b.z);
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < pts.length; i++) {
                const q = pts[i];
                ctx.globalAlpha = Math.min(1, 0.45 + (q.z + 0.4) * 0.55 + (q.lit ? 0.4 : 0));
                const d = Math.max(1.4, q.r * 2);
                ctx.drawImage(sprites[q.col], q.x - d / 2, q.y - d / 2, d, d);
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
        }

        function loop(t) {
            render(t);
            raf = (visible && !document.hidden && !reduce) ? requestAnimationFrame(loop) : 0;
        }
        function start() {
            if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
        }

        size();
        render(performance.now() + 1200);
        if (!reduce) start();

        if ('IntersectionObserver' in window) {
            new IntersectionObserver((en) => {
                visible = en[0].isIntersecting;
                if (visible && !reduce) start();
            }).observe(canvas);
        }
        document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) start(); });
        let rt = 0;
        window.addEventListener('resize', () => {
            clearTimeout(rt);
            rt = setTimeout(() => { size(); render(performance.now()); }, 150);
        });
    };
})();
