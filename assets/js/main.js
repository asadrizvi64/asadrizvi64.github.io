(function () {
    'use strict';

    const PROJECTS = window.PROJECTS || [];
    const COLOR = {
        purple: 'var(--purple)', green: 'var(--green)', pink: 'var(--pink)', cyan: 'var(--cyan)',
        yellow: 'var(--yellow)', orange: 'var(--orange)', blue: 'var(--blue)'
    };
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const pad2 = (n) => String(n).padStart(2, '0');
    const isExternal = (url) => /^https?:/.test(url);

    /* ---------------- project cards ---------------- */
    const stepsHTML = (steps) =>
        `<ol class="steps">${steps.map(([a, b]) => `<li><b>${esc(a)}</b>${esc(b)}</li>`).join('')}</ol>`;

    const chipsHTML = (stack, max) => {
        const items = max ? stack.slice(0, max) : stack;
        const more = max && stack.length > max ? `<li>+${stack.length - max}</li>` : '';
        return `<ul class="chips">${items.map((s) => `<li>${esc(s)}</li>`).join('')}${more}</ul>`;
    };

    function visualHTML(p) {
        if (p.visual === 'splat') {
            return `<div class="boss-visual" aria-hidden="true">
                <span class="vis-label">ILLUSTRATIVE SIM · 560 SURFACE-LOCKED SPLATS</span>
                <canvas class="splat-canvas" data-splat></canvas>
            </div>`;
        }
        if (p.visual === 'stack') {
            const rows = [
                ['01 AGENT RUNTIME', 'var(--green)', [3]],
                ['02 WORKFLOW ENGINE', 'var(--purple)', []],
                ['03 MEMORY · MEM0 / GRAPHITI', 'var(--pink)', [7]],
                ['04 RAG · QDRANT / PGVECTOR', 'var(--cyan)', []],
                ['05 INFRA · POSTGRES / COOLIFY', 'var(--yellow)', []]
            ];
            const line = ([label, c, gaps]) =>
                `<div class="line" style="--c:${c}">${Array.from({ length: 10 }, (_, i) => `<i${gaps.indexOf(i) > -1 ? ' class="gap"' : ''}></i>`).join('')}<span>${label}</span></div>`;
            return `<div class="boss-visual" aria-hidden="true">
                <span class="vis-label">SYSTEM STACK · 5 LAYERS</span>
                <i class="tet tet-T drop-piece"></i>
                <div class="linestack">${rows.map(line).join('')}</div>
            </div>`;
        }
        if (p.visual === 'video' && p.video) {
            const v = p.video;
            return `<div class="boss-visual boss-visual-media" aria-hidden="true">
                <video class="boss-video" src="${esc(v.src)}" poster="${esc(v.poster)}" muted loop playsinline preload="metadata" data-autoplay></video>
                <span class="vis-label">${esc(v.label)}</span>
            </div>`;
        }
        if (p.visual === 'race' && p.race) {
            // bar length = seconds relative to the slower run in each group
            const groups = p.race.map((g) => {
                const max = Math.max(...g.rows.map((r) => r[1]));
                const saved = Math.round((1 - g.rows[1][1] / g.rows[0][1]) * 100);
                const rows = g.rows.map(([name, s], i) =>
                    `<div class="race-row${i ? ' is-new' : ''}">
                        <span class="race-name">${esc(name)}</span>
                        <span class="race-track"><span class="race-fill" style="--w:${((s / max) * 100).toFixed(1)}%"></span></span>
                        <span class="race-val">${s} s</span>
                    </div>`).join('');
                return `<div class="race-group"><p class="race-label">${esc(g.label)} <b>\u2212${saved}%</b></p>${rows}</div>`;
            }).join('');
            return `<div class="boss-visual" aria-hidden="true">
                <span class="vis-label">SINGLE-SEED EXAMPLES · H100 · LOWER IS BETTER</span>
                <div class="race">${groups}</div>
            </div>`;
        }
        return '';
    }

    function cardHTML(p, n) {
        const repo = (p.links || []).find((l) => /github\.com/.test(l[1]));
        const tags = esc(p.tags.join(' '));
        const top = `<header class="card-top">
                <span class="lvl">LVL ${pad2(n)}</span>
                ${p.boss ? '<span class="boss-tag">BOSS</span>' : ''}
                <span class="kind">${esc(p.kind)}</span>
                <i class="tet tet-${p.piece}" aria-hidden="true"></i>
            </header>`;
        const main = `<div class="card-main">
                <h3 id="t-${p.id}">${esc(p.title)}</h3>
                <p class="card-sub">${esc(p.sub)}</p>
                <p class="card-ctx">${esc(p.context)}</p>
                <p class="card-sum">${esc(p.summary)}</p>
                ${p.steps && (p.boss || p.wide) ? stepsHTML(p.steps) : ''}
                ${chipsHTML(p.stack, p.boss ? 0 : 5)}
            </div>`;
        const foot = `<footer class="card-foot">
                <button class="open-case" data-id="${p.id}" aria-haspopup="dialog">OPEN CASE FILE ▸<span class="sr-only">: ${esc(p.title)}</span></button>
                ${repo ? `<a href="${esc(repo[1])}" target="_blank" rel="noopener">SRC ▸<span class="sr-only"> ${esc(p.title)} on GitHub</span></a>` : ''}
            </footer>`;
        const style = `--accent:${COLOR[p.color] || COLOR.purple}`;

        if (p.boss) {
            return `<article class="card card-boss reveal" data-tags="${tags}" style="${style}" aria-labelledby="t-${p.id}">
                ${top}<div class="boss-left">${main}${foot}</div>${visualHTML(p)}
            </article>`;
        }
        return `<article class="card reveal${p.wide ? ' wide' : ''}" data-tags="${tags}" style="${style}" aria-labelledby="t-${p.id}">
                ${top}${main}${foot}
            </article>`;
    }

    const bossEl = document.getElementById('boss');
    const levelsEl = document.getElementById('levels');
    if (bossEl && levelsEl) {
        let n = 0;
        const boss = [];
        const levels = [];
        PROJECTS.forEach((p) => {
            n += 1;
            p._n = n;
            (p.boss ? boss : levels).push(cardHTML(p, n));
        });
        bossEl.innerHTML = boss.join('');
        levelsEl.innerHTML = levels.join('');
        if (window.mountSplats) document.querySelectorAll('[data-splat]').forEach((c) => window.mountSplats(c));

        // card videos play only while on screen, and never for reduced-motion visitors
        const vids = document.querySelectorAll('video[data-autoplay]');
        if (vids.length && !reduceMotion && 'IntersectionObserver' in window) {
            const vo = new IntersectionObserver((entries) => {
                entries.forEach((en) => {
                    const v = en.target;
                    if (en.isIntersecting && !document.hidden) {
                        v.muted = true;
                        const pr = v.play();
                        if (pr && pr.catch) pr.catch(() => {});
                    } else {
                        v.pause();
                    }
                });
            }, { threshold: 0.25 });
            vids.forEach((v) => vo.observe(v));
        }
    }

    /* ---------------- filters ---------------- */
    const cards = () => Array.from(document.querySelectorAll('#boss .card, #levels .card'));
    const countEl = document.getElementById('filterCount');
    function applyFilter(f, initial) {
        let shown = 0;
        const all = cards();
        all.forEach((c) => {
            const ok = f === 'all' || c.dataset.tags.split(' ').indexOf(f) > -1;
            c.hidden = !ok;
            if (ok) { shown++; if (!initial) c.classList.add('in'); }
        });
        if (countEl) countEl.textContent = `${pad2(shown)} / ${pad2(all.length)} LEVELS`;
    }
    document.querySelectorAll('.filter').forEach((b) => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.filter').forEach((x) => {
                x.classList.toggle('is-on', x === b);
                x.setAttribute('aria-pressed', String(x === b));
            });
            applyFilter(b.dataset.filter);
        });
    });
    applyFilter('all', true);

    /* ---------------- case-file dialog ---------------- */
    const dlg = document.getElementById('casefile');
    const body = document.getElementById('caseBody');
    const fileName = document.getElementById('caseFileName');
    let opener = null;

    function caseHTML(p) {
        const meta = p.meta && p.meta.length
            ? `<dl class="cf-meta">${p.meta.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>`
            : '';
        const steps = p.steps ? `<div class="cf-sec"><h4>PIPELINE</h4>${stepsHTML(p.steps)}</div>` : '';
        const size = (f) => (f.w && f.h ? ` width="${f.w}" height="${f.h}"` : '');
        const cap = (f) => (f.caption ? `<figcaption>${esc(f.caption)}</figcaption>` : '');
        const figs = (p.figures || []).map((f) => (f.type === 'video'
            ? `<figure class="cf-fig"><video src="${esc(f.src)}"${f.poster ? ` poster="${esc(f.poster)}"` : ''}${size(f)} controls muted loop playsinline preload="none" aria-label="${esc(f.alt || '')}"></video>${cap(f)}</figure>`
            : `<figure class="cf-fig"><img src="${esc(f.src)}" alt="${esc(f.alt || '')}"${size(f)} loading="lazy" decoding="async">${cap(f)}</figure>`)).join('');
        const secs = (p.sections || []).map((s) => `<div class="cf-sec"><h4>${esc(s.h.toUpperCase())}</h4>${
            s.list ? `<ul class="cf-list">${s.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : `<p>${esc(s.text)}</p>`
        }</div>`).join('');
        const links = p.links && p.links.length
            ? `<div class="cf-links">${p.links.map(([label, url], i) =>
                `<a class="btn ${i ? 'btn-pink' : 'btn-green'}" href="${esc(url)}"${isExternal(url) ? ' target="_blank" rel="noopener"' : ''}>${esc(label)} ▸</a>`).join('')}</div>`
            : '';
        return `<p class="cf-kicker">LVL ${pad2(p._n)} · ${esc(p.kind)}</p>
            <h3 class="cf-title" id="caseTitle">${esc(p.title)}</h3>
            <p class="cf-sub">${esc(p.sub)}</p>
            ${meta}
            <p class="cf-overview">${esc(p.overview || p.summary)}</p>
            ${figs}
            ${steps}
            ${secs}
            <div class="cf-sec"><h4>STACK</h4>${chipsHTML(p.stack)}</div>
            ${links}`;
    }

    function openCase(id, from) {
        const p = PROJECTS.find((x) => x.id === id);
        if (!p || !dlg) return;
        opener = from || null;
        body.innerHTML = caseHTML(p);
        fileName.textContent = `CASE_${pad2(p._n)}_${p.id.toUpperCase().replace(/-/g, '_')}.TXT`;
        dlg.style.setProperty('--accent', COLOR[p.color] || COLOR.purple);
        if (typeof dlg.showModal === 'function') dlg.showModal();
        else dlg.setAttribute('open', '');
        body.scrollTop = 0;
    }

    function closeCase() {
        if (!dlg) return;
        if (typeof dlg.close === 'function') dlg.close();
        else { dlg.removeAttribute('open'); onClosed(); }
    }
    function onClosed() {
        body.querySelectorAll('video').forEach((v) => v.pause());
        if (opener) opener.focus();
    }

    if (dlg) {
        document.addEventListener('click', (e) => {
            const b = e.target.closest('.open-case');
            if (b) openCase(b.dataset.id, b);
        });
        document.getElementById('caseClose').addEventListener('click', closeCase);
        dlg.addEventListener('click', (e) => { if (e.target === dlg) closeCase(); });
        dlg.addEventListener('close', onClosed);
    }

    /* ---------------- nav ---------------- */
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    function setMenu(open) {
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.textContent = open ? 'CLOSE' : 'MENU';
    }
    if (nav && menuBtn) {
        menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
        nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false); });
    }

    /* ---------------- observers: reveal, active nav, countdown ---------------- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const ro = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach((el) => ro.observe(el));

        const links = new Map();
        document.querySelectorAll('.nav a').forEach((a) => links.set(a.getAttribute('href').slice(1), a));
        const so = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                links.forEach((a) => a.classList.remove('is-active'));
                const a = links.get(en.target.id);
                if (a) a.classList.add('is-active');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main section[id]').forEach((s) => so.observe(s));
    } else {
        reveals.forEach((el) => el.classList.add('in'));
    }

    const cd = document.getElementById('countdown');
    if (cd && !reduceMotion && 'IntersectionObserver' in window) {
        let n = 9;
        let timer = 0;
        const tick = () => {
            n = n <= 0 ? 9 : n - 1;
            cd.textContent = String(n);
        };
        new IntersectionObserver((en) => {
            if (en[0].isIntersecting && !timer) timer = setInterval(tick, 1000);
            else if (!en[0].isIntersecting && timer) { clearInterval(timer); timer = 0; }
        }).observe(cd);
    }

    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
