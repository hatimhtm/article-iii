import { SECTIONS } from '../data/sections.js';
import { CLUSTERS } from '../data/clusters.js';
import { PROLOGUE, EPILOGUE_NOTES } from '../data/prologue.js';
import { DEDICATION } from '../data/dedication.js';
import { state, PHASE } from '../core/state.js';
import { readState } from '../core/read.js';
import { lockScroll, goToSection } from '../core/scroll.js';
import { clamp, invLerp, smoothstep, make } from '../core/util.js';

/**
 * The reading layer, in two registers.
 *
 * TRAVELLING — a compact card carrying the identity of the section and the
 * text of the law itself, set as the monument it is. Nothing hidden behind
 * tabs, because a card that hides five-sixths of its content is a filing
 * cabinet, not a page.
 *
 * STUDYING — the same section opened into a full editorial spread with every
 * facet visible at once. It stays open as you move between sections, so the
 * whole article can be read straight through without collapsing once.
 */

const FACETS = [
  { key: 'plain', label: 'In plain words', span: 1 },
  { key: 'why', label: 'Why it exists', span: 1 },
  { key: 'doctrines', label: 'Doctrines', span: 2 },
  { key: 'cases', label: 'Landmark cases', span: 2 },
  { key: 'real', label: 'In real life', span: 1 },
  { key: 'limits', label: 'The limits', span: 1 },
];

/** The constitutional text, with subsection marks hanging in the margin. */
function verbatimHtml(sec) {
  return sec.text
    .map((t) => t.label
      ? `<p class="verse verse--marked"><b class="verse__mark">${t.label}</b>${t.body}</p>`
      : `<p class="verse">${t.body}</p>`)
    .join('');
}

function facetHtml(sec, key) {
  if (key === 'doctrines') {
    return `<dl class="doctrines">${sec.doctrines
      .map((d) => `<div><dt>${d.name}</dt><dd>${d.body}</dd></div>`).join('')}</dl>`;
  }
  if (key === 'cases') {
    return `<ul class="cases">${sec.cases.map((c) => `<li>
      <p class="cases__name">${c.name}<span class="cases__year">${c.year}</span></p>
      <p class="cases__holding">${c.holding}</p>
    </li>`).join('')}</ul>`;
  }
  return `<p class="lede">${sec[key]}</p>`;
}

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
      <p class="hero__hint"><kbd>↓</kbd> travel · <kbd>Enter</kbd> read in full · <kbd>M</kbd> map</p>
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

  /* ── the travelling card ────────────────────────────────────────── */
  const panel = make('section', 'panel', `
    <article class="card" aria-live="polite">
      <span class="card__watermark" aria-hidden="true"></span>
      <header class="card__head">
        <p class="card__eyebrow"><b class="card__sec"></b><i class="card__cluster"></i></p>
        <h2 class="card__title"></h2>
        <p class="card__kicker"></p>
      </header>
      <div class="card__law">
        <p class="card__lawlabel">The text of the law</p>
        <div class="card__verbatim"></div>
        <p class="card__note"></p>
      </div>
      <footer class="card__foot">
        <button class="card__open" type="button" data-spread>
          <span>Read in full</span>
          <i class="card__counts"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7M4 4v7M4 4l7 7M20 20h-7M20 20v-7M20 20l-7-7"/></svg>
        </button>
        <button class="card__mark" type="button" data-mark aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>
          <span>Read</span>
        </button>
      </footer>
    </article>
  `);

  /* ── the study spread ───────────────────────────────────────────── */
  const spread = make('section', 'spread', `
    <div class="spread__scrim"></div>
    <div class="spread__frame" role="dialog" aria-modal="true" aria-label="Section in full">
      <header class="spread__bar">
        <p class="spread__eyebrow"><b class="spread__sec"></b><i class="spread__cluster"></i></p>
        <div class="spread__tools">
          <button class="spread__tool" type="button" data-copy>
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>
            <span>Copy the text</span>
          </button>
          <button class="spread__tool spread__tool--mark" type="button" data-mark aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>
            <span>Mark as read</span>
          </button>
          <button class="spread__close" type="button" data-collapse aria-label="Close (Esc)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </header>

      <div class="spread__cols">
        <aside class="spread__law">
          <span class="spread__watermark" aria-hidden="true"></span>
          <h2 class="spread__title"></h2>
          <p class="spread__kicker"></p>
          <p class="spread__lawlabel">The text, verbatim</p>
          <div class="spread__verbatim"></div>
          <p class="spread__note"></p>
        </aside>
        <div class="spread__facets"></div>
      </div>

      <footer class="spread__foot">
        <button class="spread__step" type="button" data-step="-1">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19l-7-7 7-7"/></svg>
          <span></span>
        </button>
        <span class="spread__count"></span>
        <button class="spread__step spread__step--next" type="button" data-step="1">
          <span></span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </footer>
    </div>
  `);

  /* ── epilogue ───────────────────────────────────────────────────── */
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
        DEDICATION.name ? `For ${DEDICATION.name}. ` : ''}${DEDICATION.line}</p>` : ''}
    </div>
  `);

  root.append(hero, prologue, panel, epilogue);
  // the spread must be able to cover the HUD, so it lives above #stage
  (opts.overlayRoot || root).append(spread);

  /* ── element handles ────────────────────────────────────────────── */
  const c = (s) => panel.querySelector(s);
  const s = (sel) => spread.querySelector(sel);
  const ui = {
    card: c('.card'),
    watermark: c('.card__watermark'),
    sec: c('.card__sec'),
    cluster: c('.card__cluster'),
    title: c('.card__title'),
    kicker: c('.card__kicker'),
    verbatim: c('.card__verbatim'),
    note: c('.card__note'),
    counts: c('.card__counts'),
    mark: c('[data-mark]'),

    sSec: s('.spread__sec'),
    sCluster: s('.spread__cluster'),
    sWatermark: s('.spread__watermark'),
    sTitle: s('.spread__title'),
    sKicker: s('.spread__kicker'),
    sVerbatim: s('.spread__verbatim'),
    sNote: s('.spread__note'),
    sFacets: s('.spread__facets'),
    sMark: s('.spread__tool--mark'),
    sCount: s('.spread__count'),
    sPrev: s('[data-step="-1"]'),
    sNext: s('[data-step="1"]'),
    sCopy: s('[data-copy]'),
    sFrame: s('.spread__frame'),
  };

  let rendered = -1;
  let spreadOpen = false;

  /* ── rendering ──────────────────────────────────────────────────── */
  function paintMarks(n) {
    const on = readState.has(n);
    ui.mark.setAttribute('aria-pressed', String(on));
    ui.mark.querySelector('span').textContent = on ? 'Read' : 'Mark read';
    ui.sMark.setAttribute('aria-pressed', String(on));
    ui.sMark.querySelector('span').textContent = on ? 'Read' : 'Mark as read';
  }

  function renderSection(i) {
    if (i === rendered || i < 0) return;
    rendered = i;
    const sec = SECTIONS[i];
    const cl = CLUSTERS[sec.cluster];
    const vb = verbatimHtml(sec);
    const noteHtml = sec.note ? `<span>Textual note</span> ${sec.note}` : '';

    for (const node of [panel, spread]) {
      node.style.setProperty('--accent', cl.color);
      node.style.setProperty('--accent-2', cl.color2);
    }

    // travelling card
    ui.watermark.textContent = sec.roman;
    ui.sec.textContent = `Section ${sec.n}`;
    ui.cluster.textContent = cl.name;
    ui.title.textContent = sec.title;
    ui.kicker.textContent = sec.kicker;
    ui.verbatim.innerHTML = vb;
    ui.note.innerHTML = noteHtml;
    ui.note.hidden = !sec.note;
    ui.counts.textContent = `${sec.doctrines.length} doctrines · ${sec.cases.length} cases`;

    // spread
    ui.sSec.textContent = `Section ${sec.n}`;
    ui.sCluster.textContent = cl.name;
    ui.sWatermark.textContent = sec.roman;
    ui.sTitle.textContent = sec.title;
    ui.sKicker.textContent = sec.kicker;
    ui.sVerbatim.innerHTML = vb;
    ui.sNote.innerHTML = noteHtml;
    ui.sNote.hidden = !sec.note;
    ui.sFacets.innerHTML = FACETS.map((f) => `
      <section class="facet facet--${f.span === 2 ? 'wide' : 'half'}">
        <h3 class="facet__label">${f.label}</h3>
        ${facetHtml(sec, f.key)}
      </section>`).join('');
    ui.sCount.textContent = `Section ${sec.n} of 22`;

    const prev = SECTIONS[i - 1];
    const next = SECTIONS[i + 1];
    ui.sPrev.querySelector('span').textContent = prev ? `§${prev.n} ${prev.short}` : 'Prologue';
    ui.sNext.querySelector('span').textContent = next ? `§${next.n} ${next.short}` : 'The charter, assembled';
    ui.sPrev.disabled = false;
    ui.sNext.disabled = false;

    paintMarks(sec.n);

    ui.card.classList.remove('is-in');
    void ui.card.offsetWidth;
    ui.card.classList.add('is-in');
    if (spreadOpen) {
      ui.sFrame.classList.remove('is-in');
      void ui.sFrame.offsetWidth;
      ui.sFrame.classList.add('is-in');
      ui.sFacets.scrollTop = 0;
    }
    onSectionChange(i, sec);
  }

  /* ── the spread ─────────────────────────────────────────────────── */
  function openSpread() {
    if (spreadOpen || rendered < 0) return;
    spreadOpen = true;
    state.spread = true;
    lockScroll(true);
    document.documentElement.classList.add('is-spread');
    spread.classList.add('is-open');
    ui.sFacets.scrollTop = 0;
    // reading it in full is the strongest signal we have that it was read
    readState.mark(SECTIONS[rendered].n, true);
    paintMarks(SECTIONS[rendered].n);
    setTimeout(() => ui.sFrame.focus?.(), 60);
  }

  function closeSpread() {
    if (!spreadOpen) return;
    spreadOpen = false;
    state.spread = false;
    document.documentElement.classList.remove('is-spread');
    spread.classList.remove('is-open');
    lockScroll(false);
  }

  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-spread]')) openSpread();
    else if (e.target.closest('[data-mark]')) {
      readState.toggle(SECTIONS[rendered].n);
      paintMarks(SECTIONS[rendered].n);
    }
  });

  spread.addEventListener('click', (e) => {
    if (e.target.closest('[data-collapse]') || e.target.classList.contains('spread__scrim')) {
      closeSpread();
      return;
    }
    if (e.target.closest('[data-mark]')) {
      readState.toggle(SECTIONS[rendered].n);
      paintMarks(SECTIONS[rendered].n);
      return;
    }
    if (e.target.closest('[data-copy]')) {
      const sec = SECTIONS[rendered];
      const plain = sec.text.map((t) => (t.label ? `${t.label} ` : '') + t.body).join('\n\n');
      const cite = `Article III, Section ${sec.n}, 1987 Constitution of the Republic of the Philippines`;
      navigator.clipboard?.writeText(`${plain}\n\n— ${cite}`).then(() => {
        const b = e.target.closest('[data-copy]');
        const label = b.querySelector('span');
        const was = label.textContent;
        label.textContent = 'Copied with citation';
        b.classList.add('is-done');
        setTimeout(() => { label.textContent = was; b.classList.remove('is-done'); }, 2200);
      }).catch(() => {});
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) goToSection(rendered + Number(step.dataset.step));
  });

  /* ── per-frame visibility & staging ─────────────────────────────── */
  const setVis = (node, v) => {
    const on = v > 0.02;
    if (node.classList.contains('is-visible') !== on) node.classList.toggle('is-visible', on);
    node.style.opacity = v.toFixed(3);
    node.style.pointerEvents = v > 0.5 ? 'auto' : 'none';
  };

  function update() {
    const p = state.progress;
    const phase = state.phase;

    const heroV = 1 - smoothstep(invLerp(
      PHASE.hero[0] + (PHASE.hero[1] - PHASE.hero[0]) * 0.25, PHASE.hero[1], p));
    setVis(hero, clamp(heroV));

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

    const [ca, cb] = PHASE.colonnade;
    const panV = phase === 'colonnade' && !spreadOpen
      ? smoothstep(invLerp(ca, ca + 0.008, p)) * (1 - smoothstep(invLerp(cb - 0.010, cb, p)))
      : 0;
    setVis(panel, clamp(panV));
    if (state.sectionIndex >= 0 && (phase === 'colonnade' || spreadOpen)) {
      renderSection(state.sectionIndex);
    }

    const [ea, eb] = PHASE.epilogue;
    const eLocal = phase === 'epilogue' ? clamp(invLerp(ea, eb, p)) : 0;
    const revealV = phase === 'epilogue'
      ? smoothstep(invLerp(0.08, 0.24, eLocal)) * (1 - smoothstep(invLerp(0.62, 0.76, eLocal)))
      : 0;
    const closeV = phase === 'epilogue' ? smoothstep(invLerp(0.70, 0.86, eLocal)) : 0;
    setVis(epilogue, clamp(Math.max(revealV, closeV)));
    if (phase === 'epilogue' || epilogue.style.opacity !== '0.000') {
      epilogue.querySelector('.epilogue__reveal').style.opacity = revealV.toFixed(3);
      const close = epilogue.querySelector('.epilogue__close');
      close.style.opacity = closeV.toFixed(3);
      close.style.pointerEvents = closeV > 0.5 ? 'auto' : 'none';
      epilogue.style.setProperty('--scrim', closeV.toFixed(3));
    }
  }

  return {
    update, hero, prologue, panel, spread, epilogue,
    renderSection,
    openSpread, closeSpread,
    isSpreadOpen: () => spreadOpen,
    toggleSpread() { spreadOpen ? closeSpread() : openSpread(); },
  };
}
