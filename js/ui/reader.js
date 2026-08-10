import { SECTIONS } from '../data/sections.js';
import { CLUSTERS } from '../data/clusters.js';
import { PROLOGUE, EPILOGUE_NOTES } from '../data/prologue.js';
import { DEDICATION } from '../data/dedication.js';
import { state, PHASE } from '../core/state.js';
import { clamp, invLerp, smoothstep, make } from '../core/util.js';

/**
 * The scroll-linked reading layer. One panel, whose contents are swapped as
 * the traveller reaches each section — rather than 22 stacked DOM blocks,
 * which would cost far more than they are worth.
 */

const TABS = [
  { id: 'plain', label: 'Plain words' },
  { id: 'why', label: 'Why' },
  { id: 'doctrines', label: 'Doctrines' },
  { id: 'cases', label: 'Cases' },
  { id: 'real', label: 'In real life' },
  { id: 'limits', label: 'Limits' },
];

export function createReader(root, opts = {}) {
  const onSectionChange = opts.onSectionChange || (() => {});

  /* ── hero ───────────────────────────────────────────────────────── */
  const hero = make('section', 'hero', `
    <div class="hero__inner">
      <p class="hero__eyebrow">1987 Constitution of the Republic of the Philippines</p>
      <h1 class="hero__title">
        <span class="hero__numeral" aria-hidden="true">III</span>
        <span class="hero__word">Article</span>
        <span class="hero__word hero__word--big">Three</span>
      </h1>
      <p class="hero__sub">The Bill of Rights — twenty-two sections, read one at a time,
      with the doctrine, the cases, and the history that produced them.</p>
      <div class="hero__meta">
        <span>22 sections</span><i></i><span>9 movements</span><i></i><span>Ratified 2 February 1987</span>
      </div>
      <button class="hero__cta" type="button" data-act="begin">
        <span>Begin the journey</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m0 0l-6-6m6 6l6-6"/></svg>
      </button>
      <p class="hero__hint">Scroll, or use <kbd>↓</kbd> <kbd>↑</kbd> · press <kbd>M</kbd> for the map</p>
    </div>
  `);

  /* ── prologue ───────────────────────────────────────────────────── */
  const prologue = make('section', 'prologue', `
    <div class="prologue__inner">
      <p class="prologue__label">Before the article — why it reads the way it does</p>
      <div class="prologue__stage"></div>
      <ol class="prologue__ticks">${PROLOGUE.map((_, i) =>
        `<li><button type="button" data-prologue="${i}"><span></span></button></li>`).join('')}
      </ol>
    </div>
  `);
  const proStage = prologue.querySelector('.prologue__stage');
  const proBeats = PROLOGUE.map((b, i) => {
    const n = make('article', `beat beat--${b.tone}`, `
      <p class="beat__date">${b.date}</p>
      <h2 class="beat__label">${b.label}</h2>
      <p class="beat__body">${b.body}</p>
    `);
    n.dataset.i = String(i);
    proStage.appendChild(n);
    return n;
  });
  const proTicks = [...prologue.querySelectorAll('[data-prologue]')];

  /* ── section panel ──────────────────────────────────────────────── */
  const panel = make('section', 'panel', `
    <article class="panel__card" aria-live="polite">
      <header class="panel__head">
        <div class="panel__id">
          <span class="panel__roman"></span>
          <div class="panel__idmeta">
            <span class="panel__sec"></span>
            <span class="panel__cluster"></span>
          </div>
        </div>
        <h2 class="panel__title"></h2>
        <p class="panel__kicker"></p>
      </header>

      <div class="panel__verbatim">
        <p class="panel__vlabel">The text, verbatim</p>
        <div class="panel__vbody"></div>
        <p class="panel__vnote"></p>
      </div>

      <nav class="panel__tabs" role="tablist">
        ${TABS.map((t, i) => `<button role="tab" type="button" data-tab="${t.id}"
          aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t.label}</button>`).join('')}
      </nav>

      <div class="panel__body" role="tabpanel"></div>
    </article>
  `);

  const q = (s) => panel.querySelector(s);
  const ui = {
    roman: q('.panel__roman'),
    sec: q('.panel__sec'),
    cluster: q('.panel__cluster'),
    title: q('.panel__title'),
    kicker: q('.panel__kicker'),
    vbody: q('.panel__vbody'),
    vnote: q('.panel__vnote'),
    body: q('.panel__body'),
    card: q('.panel__card'),
    tabs: [...panel.querySelectorAll('[data-tab]')],
  };

  let activeTab = 'plain';
  let rendered = -1;

  ui.tabs.forEach((b) => {
    b.addEventListener('click', () => selectTab(b.dataset.tab));
    b.addEventListener('keydown', (e) => {
      const i = ui.tabs.indexOf(b);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + ui.tabs.length) % ui.tabs.length;
        ui.tabs[n].focus();
        selectTab(ui.tabs[n].dataset.tab);
      }
    });
  });

  function selectTab(id) {
    activeTab = id;
    ui.tabs.forEach((b) => {
      const on = b.dataset.tab === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    if (rendered >= 0) renderTab(SECTIONS[rendered]);
  }

  function renderTab(sec) {
    let html = '';
    if (activeTab === 'plain') html = `<p class="lede">${sec.plain}</p>`;
    else if (activeTab === 'why') html = `<p class="lede">${sec.why}</p>`;
    else if (activeTab === 'real') html = `
      <p class="scenario__label">A concrete case</p>
      <p class="lede">${sec.real}</p>`;
    else if (activeTab === 'limits') html = `
      <p class="scenario__label">Where the right stops</p>
      <p class="lede">${sec.limits}</p>`;
    else if (activeTab === 'doctrines') html = `<dl class="doctrines">${sec.doctrines
      .map((d) => `<div><dt>${d.name}</dt><dd>${d.body}</dd></div>`).join('')}</dl>`;
    else if (activeTab === 'cases') html = `<ul class="cases">${sec.cases
      .map((c) => `<li>
        <p class="cases__name">${c.name} <span class="cases__year">${c.year}</span></p>
        <p class="cases__holding">${c.holding}</p>
      </li>`).join('')}</ul>`;
    ui.body.innerHTML = html;
    ui.body.scrollTop = 0;
    ui.body.classList.remove('is-in');
    // force reflow so the transition replays on every tab change
    void ui.body.offsetWidth;
    ui.body.classList.add('is-in');
  }

  function renderSection(i) {
    if (i === rendered || i < 0) return;
    rendered = i;
    const sec = SECTIONS[i];
    const cl = CLUSTERS[sec.cluster];

    panel.style.setProperty('--accent', cl.color);
    panel.style.setProperty('--accent-2', cl.color2);
    ui.roman.textContent = sec.roman;
    ui.sec.textContent = `Section ${sec.n}`;
    ui.cluster.textContent = cl.name;
    ui.title.textContent = sec.title;
    ui.kicker.textContent = sec.kicker;
    ui.vbody.innerHTML = sec.text
      .map((t) => `<p class="verse">${t.label ? `<b>${t.label}</b> ` : ''}${t.body}</p>`)
      .join('');
    if (sec.note) {
      ui.vnote.innerHTML = `<span>Textual note</span> ${sec.note}`;
      ui.vnote.hidden = false;
    } else {
      ui.vnote.hidden = true;
    }
    renderTab(sec);

    ui.card.classList.remove('is-in');
    void ui.card.offsetWidth;
    ui.card.classList.add('is-in');
    onSectionChange(i, sec);
  }

  /* ── epilogue ───────────────────────────────────────────────────── */
  // Two beats. The colonnade folds into a ring of rays around the sun first,
  // with nothing but a caption in the way; the reading matter arrives after.
  const epilogue = make('section', 'epilogue', `
    <div class="epilogue__reveal">
      <p class="epilogue__label">The whole charter, seen at once</p>
      <h2 class="epilogue__title">Twenty-two restraints on power</h2>
    </div>
    <div class="epilogue__close">
      <div class="epilogue__notes">
        ${EPILOGUE_NOTES.map((n) => `<div class="note"><h3>${n.h}</h3><p>${n.p}</p></div>`).join('')}
      </div>
      <div class="epilogue__actions">
        <button class="btn btn--primary" type="button" data-act="quiz">Test yourself · 15 scenarios</button>
        <button class="btn" type="button" data-act="map">Open the map</button>
        <button class="btn btn--ghost" type="button" data-act="restart">Return to the beginning</button>
      </div>
      <p class="epilogue__credit">
        Text of Article III cross-checked against ChanRobles Virtual Law Library,
        The LawPhil Project, and the University of Minnesota Human Rights Library.
        Commentary and case notes are study aids, not legal advice.
      </p>
      ${DEDICATION.line ? `<p class="epilogue__dedication">${
        DEDICATION.name ? `For ${DEDICATION.name}.` : ''} ${DEDICATION.line}</p>` : ''}
    </div>
  `);
  const epiReveal = epilogue.querySelector('.epilogue__reveal');
  const epiClose = epilogue.querySelector('.epilogue__close');

  root.append(hero, prologue, panel, epilogue);

  /* ── per-frame visibility & staging ─────────────────────────────── */
  const setVis = (node, v, cls = 'is-visible') => {
    const on = v > 0.02;
    if (node.classList.contains(cls) !== on) node.classList.toggle(cls, on);
    node.style.opacity = v.toFixed(3);
    node.style.pointerEvents = v > 0.5 ? 'auto' : 'none';
  };

  function update() {
    const p = state.progress;
    const phase = state.phase;

    // hero fades out across the back half of its own phase
    const heroV = 1 - smoothstep(invLerp(PHASE.hero[0] + (PHASE.hero[1] - PHASE.hero[0]) * 0.25, PHASE.hero[1], p));
    setVis(hero, clamp(heroV));

    // prologue
    const [pa, pb] = PHASE.prologue;
    const proV = phase === 'prologue'
      ? smoothstep(invLerp(pa - 0.006, pa + 0.006, p)) * (1 - smoothstep(invLerp(pb - 0.012, pb, p)))
      : 0;
    setVis(prologue, clamp(proV));
    if (proV > 0.02) {
      const localBeat = clamp(invLerp(pa, pb, p)) * PROLOGUE.length;
      proBeats.forEach((n, i) => {
        const d = localBeat - (i + 0.5);
        const v = clamp(1 - Math.abs(d) / 0.72);
        n.style.opacity = smoothstep(v).toFixed(3);
        n.style.transform = `translate3d(0, ${(-d * 26).toFixed(1)}px, 0) scale(${(0.97 + smoothstep(v) * 0.03).toFixed(3)})`;
        n.style.filter = v > 0.05 ? 'none' : 'blur(6px)';
      });
      const active = clamp(Math.floor(localBeat), 0, PROLOGUE.length - 1);
      proTicks.forEach((t, i) => t.classList.toggle('is-on', i <= active));
    }

    // section panel
    const [ca, cb] = PHASE.colonnade;
    const panV = phase === 'colonnade'
      ? smoothstep(invLerp(ca, ca + 0.008, p)) * (1 - smoothstep(invLerp(cb - 0.010, cb, p)))
      : 0;
    setVis(panel, clamp(panV));
    if (state.sectionIndex >= 0 && phase === 'colonnade') renderSection(state.sectionIndex);

    // epilogue — caption during the fold, reading matter once it has landed
    const [ea, eb] = PHASE.epilogue;
    const eLocal = phase === 'epilogue' ? clamp(invLerp(ea, eb, p)) : 0;
    const revealV = phase === 'epilogue'
      ? smoothstep(invLerp(0.08, 0.24, eLocal)) * (1 - smoothstep(invLerp(0.62, 0.76, eLocal)))
      : 0;
    const closeV = phase === 'epilogue' ? smoothstep(invLerp(0.70, 0.86, eLocal)) : 0;
    setVis(epilogue, clamp(Math.max(revealV, closeV)));
    if (phase === 'epilogue' || epilogue.style.opacity !== '0.000') {
      epiReveal.style.opacity = revealV.toFixed(3);
      epiClose.style.opacity = closeV.toFixed(3);
      epiClose.style.pointerEvents = closeV > 0.5 ? 'auto' : 'none';
      epilogue.style.setProperty('--scrim', closeV.toFixed(3));
    }
  }

  return { update, hero, prologue, panel, epilogue, renderSection, selectTab };
}
