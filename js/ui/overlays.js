import { SECTIONS } from '../data/sections.js';
import { CLUSTERS, CLUSTER_ORDER } from '../data/clusters.js';
import { QUIZ } from '../data/quiz.js';
import { make } from '../core/util.js';

const goToSection = (i) => document.querySelector(`#s${i + 1}`)?.scrollIntoView({
  behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
});
const lockScroll = (v) => document.documentElement.classList.toggle('is-locked', v);

/* ══ shared shell ════════════════════════════════════════════════════ */
function shell(id, title, sub, bodyHtml) {
  return make('div', `overlay overlay--${id}`, `
    <div class="overlay__scrim" data-close></div>
    <div class="overlay__panel" role="dialog" aria-modal="true" aria-label="${title}">
      <header class="overlay__head">
        <div>
          <h2>${title}</h2>
          <p>${sub}</p>
        </div>
        <button class="overlay__x" type="button" data-close aria-label="Close">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="overlay__body">${bodyHtml}</div>
    </div>
  `);
}

/* ══ map ═════════════════════════════════════════════════════════════ */
export function createMap(root, onClose) {
  const groups = CLUSTER_ORDER.map((id) => {
    const cl = CLUSTERS[id];
    return `<section class="mapgrp" data-cluster="${id}" style="--c:${cl.color};--c2:${cl.color2}">
      <header class="mapgrp__head">
        <span class="mapgrp__dot"></span>
        <h3>${cl.name}</h3>
        <p>${cl.blurb}</p>
      </header>
      <div class="mapgrp__cards">
        ${cl.sections.map((n) => {
          const s = SECTIONS[n - 1];
          return `<button class="mapcard" type="button" data-go="${n - 1}" data-n="${n}">
            <span class="mapcard__roman">${s.roman}</span>
            <span class="mapcard__body">
              <b>Section ${s.n}</b>
              <i>${s.title}</i>
              <em>${s.kicker}</em>
            </span>
          </button>`;
        }).join('')}
      </div>
    </section>`;
  }).join('');

  const node = shell('map', 'Index of the article', 'Twenty-two sections in nine movements. Choose one, or search any word in the text, the doctrines, or the cases.', `
    <div class="map__filter">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>
      <input type="search" placeholder="Search the text, doctrines and cases…" aria-label="Filter sections">
      <span class="map__count"></span>
    </div>
    <div class="map__grid">${groups}</div>
  `);

  const input = node.querySelector('input');
  const count = node.querySelector('.map__count');
  const cards = [...node.querySelectorAll('.mapcard')];
  const grps = [...node.querySelectorAll('.mapgrp')];

  const applyFilter = () => {
    const term = input.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((c) => {
      const s = SECTIONS[+c.dataset.go];
      const hit = !term || s.search.includes(term) || `section ${s.n}`.includes(term)
        || `§${s.n}` === term;
      c.hidden = !hit;
      if (hit) shown++;
    });
    grps.forEach((g) => {
      g.hidden = ![...g.querySelectorAll('.mapcard')].some((c) => !c.hidden);
    });
    count.textContent = term ? `${shown} of 22` : '';
  };

  input.addEventListener('input', applyFilter);
  cards.forEach((c) => c.addEventListener('click', () => {
    goToSection(+c.dataset.go);
    onClose();
  }));

  root.appendChild(node);

  return {
    node,
    onOpen() { setTimeout(() => input.focus(), 260); },
    reset() { input.value = ''; applyFilter(); },
  };
}

/* ══ quiz ════════════════════════════════════════════════════════════ */
export function createQuiz(root, onClose) {
  const node = shell('quiz', 'Recall practice', 'Fifteen scenarios. Name the section each one turns on.', `
    <div class="quiz">
      <div class="quiz__progress"><i></i></div>
      <div class="quiz__stage"></div>
      <footer class="quiz__foot">
        <span class="quiz__score"></span>
        <button class="btn btn--primary" type="button" data-next hidden>Next</button>
      </footer>
    </div>
  `);
  root.appendChild(node);

  const stage = node.querySelector('.quiz__stage');
  const bar = node.querySelector('.quiz__progress i');
  const scoreEl = node.querySelector('.quiz__score');
  const nextBtn = node.querySelector('[data-next]');

  let order = [];
  let i = 0;
  let score = 0;
  let answered = false;

  function start() {
    order = QUIZ.map((_, k) => k);
    // deterministic shuffle keyed off the question count — same order each run,
    // so the user can compare their score honestly between attempts
    for (let k = order.length - 1; k > 0; k--) {
      const j = Math.floor(((Math.sin(k * 91.7) + 1) / 2) * (k + 1));
      [order[k], order[j]] = [order[j], order[k]];
    }
    i = 0; score = 0;
    render();
  }

  function render() {
    answered = false;
    nextBtn.hidden = true;
    bar.style.transform = `scaleX(${(i / QUIZ.length).toFixed(3)})`;
    scoreEl.textContent = `${score} correct · question ${i + 1} of ${QUIZ.length}`;

    if (i >= QUIZ.length) return renderDone();

    const item = QUIZ[order[i]];
    stage.innerHTML = `
      <p class="quiz__q">${item.q}</p>
      <div class="quiz__options">
        ${item.options.map((o, k) => `<button class="quiz__opt" type="button" data-k="${k}">
          <span class="quiz__key">${String.fromCharCode(65 + k)}</span><span>${o}</span>
        </button>`).join('')}
      </div>
      <div class="quiz__why" hidden></div>`;
    stage.classList.remove('is-in'); void stage.offsetWidth; stage.classList.add('is-in');

    stage.querySelectorAll('.quiz__opt').forEach((b) => {
      b.addEventListener('click', () => answer(+b.dataset.k, item));
    });
  }

  function answer(k, item) {
    if (answered) return;
    answered = true;
    const opts = [...stage.querySelectorAll('.quiz__opt')];
    opts.forEach((b, idx) => {
      b.disabled = true;
      if (idx === item.a) b.classList.add('is-right');
      else if (idx === k) b.classList.add('is-wrong');
    });
    if (k === item.a) score++;
    const why = stage.querySelector('.quiz__why');
    why.innerHTML = `
      <p class="quiz__verdict ${k === item.a ? 'ok' : 'no'}">${k === item.a ? 'Correct' : 'Not quite'}</p>
      <p>${item.why}</p>
      <button class="quiz__jump" type="button" data-jump="${item.s - 1}">Read Section ${item.s} →</button>`;
    why.hidden = false;
    why.querySelector('[data-jump]').addEventListener('click', () => {
      goToSection(item.s - 1);
      onClose();
    });
    scoreEl.textContent = `${score} correct · question ${i + 1} of ${QUIZ.length}`;
    nextBtn.hidden = false;
    nextBtn.textContent = i === QUIZ.length - 1 ? 'See your result' : 'Next';
    nextBtn.focus();
  }

  nextBtn.addEventListener('click', () => { i++; render(); });

  function renderDone() {
    bar.style.transform = 'scaleX(1)';
    const pct = Math.round((score / QUIZ.length) * 100);
    const verdict =
      pct >= 90 ? 'You know this article.' :
      pct >= 70 ? 'Solid. The gaps are worth a second pass.' :
      pct >= 45 ? 'The shape is there. Re-read the movements you missed.' :
      'Worth reading the article again, slowly.';
    stage.innerHTML = `
      <div class="quiz__done">
        <p class="quiz__bignum">${score}<span>/ ${QUIZ.length}</span></p>
        <p class="quiz__verdictbig">${verdict}</p>
        <div class="quiz__doneacts">
          <button class="btn btn--primary" type="button" data-again>Try again</button>
          <button class="btn" type="button" data-close>Back to the article</button>
        </div>
      </div>`;
    stage.classList.remove('is-in'); void stage.offsetWidth; stage.classList.add('is-in');
    stage.querySelector('[data-again]').addEventListener('click', start);
    scoreEl.textContent = `${score} of ${QUIZ.length} · ${pct}%`;
    nextBtn.hidden = true;
  }

  return { node, onOpen: start };
}

/* ══ overlay manager ═════════════════════════════════════════════════ */
export function createOverlays(root) {
  let current = null;
  let lastFocus = null;

  const close = () => {
    if (!current) return;
    current.node.classList.remove('is-open');
    current = null;
    lockScroll(false);
    lastFocus?.focus?.();
  };

  const map = createMap(root, close);
  const quiz = createQuiz(root, close);
  const all = { map, quiz };

  const open = (id) => {
    if (current) close();
    const o = all[id];
    if (!o) return;
    lastFocus = document.activeElement;
    current = o;
    lockScroll(true);
    o.node.classList.add('is-open');
    o.onOpen?.();
  };

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) { e.preventDefault(); close(); }
    if (current && e.key === 'Tab') trapFocus(e, current.node);
  });

  return { open, close, isOpen: () => !!current };
}

function trapFocus(e, node) {
  const f = [...node.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter((n) => !n.disabled && n.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
