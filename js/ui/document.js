import { SECTIONS } from '../data/sections.js';
import { CLUSTERS, CLUSTER_ORDER } from '../data/clusters.js';
import { PROLOGUE, EPILOGUE_NOTES } from '../data/prologue.js';
import { DEDICATION } from '../data/dedication.js';
import { readState } from '../core/read.js';
import { sealSVG, barsSVG, EMBLEMS } from './ornaments.js';

/**
 * The entire experience is one document, set like a fine statute book:
 * a title page, the case history of 1972–1987 told from inside the cell,
 * nine chapters of law, and the closing arguments. Native scroll, no
 * hijacking — the craft is in the typography, the materials, and restraint.
 */

const verbatim = (sec) => sec.text
  .map((t) => t.label
    ? `<p class="statute__p statute__p--marked"><b>${t.label}</b>${t.body}</p>`
    : `<p class="statute__p">${t.body}</p>`)
  .join('');

function sectionHTML(sec) {
  const cl = CLUSTERS[sec.cluster];
  return `
  <article class="law" id="s${sec.n}" data-n="${sec.n}" style="--tint:${cl.color2}">
    <header class="law__head">
      <div class="law__no">
        <span class="law__sec">Section ${sec.n}</span>
        <span class="law__roman" aria-hidden="true">${sec.roman}</span>
      </div>
      <h3 class="law__title">${sec.title}</h3>
      <p class="law__kicker">${sec.kicker}</p>
    </header>

    <div class="statute">
      <p class="statute__label">The text of the law</p>
      <div class="statute__body">${verbatim(sec)}</div>
      ${sec.note ? `<p class="statute__note"><span>Textual note</span>${sec.note}</p>` : ''}
    </div>

    <div class="notes">
      <div class="note-block">
        <h4>In plain words</h4>
        <p>${sec.plain}</p>
      </div>
      <div class="note-block">
        <h4>Why it exists</h4>
        <p>${sec.why}</p>
      </div>

      <div class="note-block note-block--wide">
        <h4>Doctrines</h4>
        <ol class="doctrine-list">
          ${sec.doctrines.map((d) => `<li><b>${d.name}.</b> ${d.body}</li>`).join('')}
        </ol>
      </div>

      <div class="note-block note-block--wide">
        <h4>Landmark cases</h4>
        <ul class="case-list">
          ${sec.cases.map((c) => `<li>
            <p class="case-list__name"><i>${c.name}</i><span>${c.year}</span></p>
            <p class="case-list__holding">${c.holding}</p>
          </li>`).join('')}
        </ul>
      </div>

      <div class="note-block note-block--callout">
        <h4>In practice</h4>
        <p>${sec.real}</p>
      </div>
      <div class="note-block note-block--callout note-block--limit">
        <h4>Where the right stops</h4>
        <p>${sec.limits}</p>
      </div>
    </div>

    <footer class="law__foot">
      <button class="markread" type="button" data-mark="${sec.n}" aria-pressed="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>
        <span>Mark as read</span>
      </button>
      <span class="law__cite">Art. III, §${sec.n} · 1987 Constitution</span>
    </footer>
  </article>`;
}

function chapterHTML(id, index) {
  const cl = CLUSTERS[id];
  const range = cl.sections.length === 1
    ? `Section ${cl.sections[0]}`
    : `Sections ${cl.sections[0]}–${cl.sections[cl.sections.length - 1]}`;
  return `
  <section class="chapter" id="ch-${id}" style="--tint:${cl.color2}">
    <header class="chapter__head">
      <div class="chapter__emblem">${EMBLEMS[id]}</div>
      <p class="chapter__count">${['First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth'][index]} movement · ${range}</p>
      <h2 class="chapter__title">${cl.name}</h2>
      <p class="chapter__blurb">${cl.blurb}</p>
    </header>
    ${cl.sections.map((n) => sectionHTML(SECTIONS[n - 1])).join('')}
  </section>`;
}

export function renderDocument(root) {
  root.innerHTML = `
  <!-- ── title page ─────────────────────────────────────────────── -->
  <section class="frontis" id="top">
    <div class="frontis__rule frontis__rule--top"></div>
    <p class="frontis__state">1987 Constitution of the Republic of the Philippines</p>
    <div class="frontis__seal">${sealSVG(132)}</div>
    <h1 class="frontis__title"><span>Article</span><b>III</b></h1>
    <p class="frontis__sub">The Bill of Rights</p>
    <p class="frontis__desc">Twenty-two sections, read in full — the verbatim text,
    the doctrines, the landmark cases, and the history that produced them.</p>
    <div class="frontis__meta">
      <span>Ratified 2 February 1987</span><i></i>
      <span>22 sections</span><i></i>
      <span>9 movements</span>
    </div>
    <div class="frontis__rule"></div>
    <a class="frontis__begin" href="#cell">Begin with the history<svg viewBox="0 0 24 24"><path d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg></a>
  </section>

  <!-- ── the cell: 1972–1987 ────────────────────────────────────── -->
  <section class="cell" id="cell">
    <div class="cell__bars" aria-hidden="true"></div>
    <div class="cell__inner">
      <div class="cell__emblem">${barsSVG()}</div>
      <p class="cell__label">Before the article</p>
      <h2 class="cell__title">Why it reads the way it does</h2>
      <p class="cell__lead">Article III cannot be understood from inside a library.
      It was written by people who had been inside a cell.</p>
      <ol class="timeline">
        ${PROLOGUE.map((b) => `
        <li class="beat beat--${b.tone}">
          <p class="beat__date">${b.date}</p>
          <div class="beat__body">
            <h3>${b.label}</h3>
            <p>${b.body}</p>
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </section>

  <!-- ── the nine chapters ──────────────────────────────────────── -->
  ${CLUSTER_ORDER.map((id, i) => chapterHTML(id, i)).join('')}

  <!-- ── closing ────────────────────────────────────────────────── -->
  <section class="closing" id="closing">
    <div class="closing__seal">${sealSVG(96)}</div>
    <p class="closing__label">On the whole article</p>
    <h2 class="closing__title">Twenty-two restraints on power</h2>
    <div class="closing__notes">
      ${EPILOGUE_NOTES.map((n) => `<div class="closing__note"><h3>${n.h}</h3><p>${n.p}</p></div>`).join('')}
    </div>
    <div class="closing__actions">
      <button class="btn btn--primary" type="button" data-act="quiz">Test yourself · 15 scenarios</button>
      <a class="btn" href="#top">Return to the title page</a>
    </div>
    <div class="colophon">
      <p>The text of Article III was cross-checked against the ChanRobles Virtual Law
      Library, The LawPhil Project, and the University of Minnesota Human Rights
      Library, and is reproduced as ratified. Commentary, doctrine summaries and
      case notes are study aids — not legal advice, and no substitute for the reports.</p>
      ${DEDICATION.line ? `<p class="colophon__dedication">${
        DEDICATION.name ? `For ${DEDICATION.name}. ` : ''}${DEDICATION.line}</p>` : ''}
    </div>
  </section>`;

  /* ── mark-as-read wiring ─────────────────────────────────────── */
  const paint = () => {
    root.querySelectorAll('[data-mark]').forEach((b) => {
      const on = readState.has(+b.dataset.mark);
      b.setAttribute('aria-pressed', String(on));
      b.querySelector('span').textContent = on ? 'Read' : 'Mark as read';
    });
  };
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mark]');
    if (!b) return;
    readState.toggle(+b.dataset.mark);
  });
  readState.onChange(paint);
  paint();
}

/** Sticky index rail — the case index of the document. */
export function renderIndex(root) {
  root.innerHTML = `
    <p class="toc__label">Index</p>
    <a class="toc__item toc__item--front" href="#cell">1972 – 1987</a>
    ${CLUSTER_ORDER.map((id) => {
      const cl = CLUSTERS[id];
      return `<div class="toc__group">
        <a class="toc__movement" href="#ch-${id}" style="--tint:${cl.color2}">${cl.name}</a>
        ${cl.sections.map((n) => `
          <a class="toc__item" href="#s${n}" data-toc="${n}">
            <span class="toc__n">§${n}</span>
            <span class="toc__t">${SECTIONS[n - 1].short}</span>
            <svg class="toc__tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>
          </a>`).join('')}
      </div>`;
    }).join('')}
    <a class="toc__item toc__item--front" href="#closing">Closing</a>
    <div class="toc__progress"><span>0 of 22 read</span><i><b style="width:0%"></b></i></div>`;

  const items = [...root.querySelectorAll('[data-toc]')];
  const progressLabel = root.querySelector('.toc__progress span');
  const progressBar = root.querySelector('.toc__progress b');

  const paint = () => {
    items.forEach((a) => a.classList.toggle('is-read', readState.has(+a.dataset.toc)));
    progressLabel.textContent = `${readState.size} of 22 read`;
    progressBar.style.width = `${(readState.size / 22) * 100}%`;
  };
  readState.onChange(paint);
  paint();

  return {
    setCurrent(n) {
      items.forEach((a) => a.classList.toggle('is-current', +a.dataset.toc === n));
    },
  };
}
