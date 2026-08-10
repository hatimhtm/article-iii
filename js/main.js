import { state, detectQuality, progressForSection } from './core/state.js';
import { initScroll, tickScroll, goToSection, goToProgress, step } from './core/scroll.js';
import { damp, clamp, el } from './core/util.js';
import { SECTION_COUNT } from './data/sections.js';
import { createReader } from './ui/reader.js';
import { createHud } from './ui/hud.js';
import { createOverlays } from './ui/overlays.js';
import { createAudio } from './ui/audio.js';

const MDBG = /[?&]mdbg/.test(location.search);
if (MDBG) {
  window.__motion = [];
  window.__dbg = { state, progressForSection };
}

const stage = el('#stage');
const canvas = el('#gl');
const boot = el('#boot');

detectQuality();
state.width = window.innerWidth;
state.height = window.innerHeight;

/* ── 3D, with a graceful way out ─────────────────────────────────── */
let world = null;
try {
  const { createWorld } = await import('./scene/world.js');
  world = createWorld(canvas);
} catch (err) {
  console.warn('[article-iii] WebGL unavailable, continuing without it.', err);
  state.webgl = false;
  document.documentElement.classList.add('no-webgl');
}

/* ── UI ──────────────────────────────────────────────────────────── */
const audio = createAudio();
const overlays = createOverlays(el('#overlays'));

const reader = createReader(stage, {
  overlayRoot: el('#overlays'),
  onSectionChange(i) {
    audio.chime(i);
    const h = `#s${i + 1}`;
    if (location.hash !== h) history.replaceState(null, '', h);
  },
});

const hud = createHud(el('#hud'), {
  map: () => overlays.open('map'),
  quiz: () => overlays.open('quiz'),
  sound: () => hud.setToggle('sound', audio.toggle()),
  motion: () => {
    state.reducedMotion = !state.reducedMotion;
    hud.setToggle('motion', state.reducedMotion);
    document.documentElement.classList.toggle('reduce-motion', state.reducedMotion);
  },
});

if (state.reducedMotion) {
  hud.setToggle('motion', true);
  document.documentElement.classList.add('reduce-motion');
}

initScroll(el('#spacer'));

/* ── input ───────────────────────────────────────────────────────── */
window.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (overlays.isOpen()) return;

  if (e.key === 'Escape' && reader.isSpreadOpen()) {
    e.preventDefault(); reader.closeSpread(); return;
  }
  if (e.key === 'Enter' && state.phase === 'colonnade') {
    e.preventDefault(); reader.toggleSpread(); return;
  }

  switch (e.key) {
    case 'ArrowRight': case 'l': case 'L':
      e.preventDefault(); step(1); break;
    case 'ArrowLeft': case 'h': case 'H':
      e.preventDefault(); step(-1); break;
    case 'j': e.preventDefault(); step(1); break;
    case 'k': e.preventDefault(); step(-1); break;
    case 'm': case 'M': e.preventDefault(); overlays.open('map'); break;
    case 't': case 'T': e.preventDefault(); overlays.open('quiz'); break;
    case 'Home': e.preventDefault(); goToProgress(0); break;
    case 'End': e.preventDefault(); goToProgress(1); break;
    default:
      if (/^[1-9]$/.test(e.key)) { e.preventDefault(); goToSection(+e.key - 1); }
  }
});

// clicking a shaft is the most direct way to reach a section there is
canvas.addEventListener('click', () => {
  const i = world?.hovered?.() ?? -1;
  if (i < 0) return;
  if (i === state.sectionIndex) reader.openSpread();
  else goToSection(i);
});

if (!state.isCoarse) {
  window.addEventListener('pointermove', (e) => {
    state.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    state.pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
}

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (e) => {
  state.reducedMotion = e.matches;
  hud.setToggle('motion', e.matches);
  document.documentElement.classList.toggle('reduce-motion', e.matches);
});

/* ── size ────────────────────────────────────────────────────────── */
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  state.width = w;
  state.height = h;
  state.isMobile = w < 900;
  // the look is soft and bloomed; full retina buys nothing and costs 40% of the frame
  const cap = state.quality === 'high' ? 1.6 : state.quality === 'medium' ? 1.35 : 1.1;
  state.dpr = Math.min(window.devicePixelRatio || 1, cap);
  world?.setSize(w, h, state.dpr);
  document.documentElement.style.setProperty('--vh', `${h * 0.01}px`);
}
window.addEventListener('resize', resize);
resize();

/* ── deep link ───────────────────────────────────────────────────── */
const m = location.hash.match(/^#(?:s|section-?)(\d{1,2})$/i);
if (m) {
  const n = clamp(parseInt(m[1], 10), 1, SECTION_COUNT);
  requestAnimationFrame(() => goToSection(n - 1, false));
}

/* ── loop ────────────────────────────────────────────────────────── */
let last = performance.now();
let hidden = false;
document.addEventListener('visibilitychange', () => { hidden = document.hidden; });

function frame(now) {
  requestAnimationFrame(frame);
  if (hidden) { last = now; return; }
  const dt = Math.min((now - last) / 1000, 1 / 20);
  last = now;
  state.time += dt;

  state.pointer.x = damp(state.pointer.x, state.pointer.tx, 0.004, dt);
  state.pointer.y = damp(state.pointer.y, state.pointer.ty, 0.004, dt);

  tickScroll(dt);
  reader.update();
  hud.update();
  world?.update(dt);

  if (MDBG && window.__motion.length < 30000) {
    const c = world?.camera;
    window.__motion.push([
      now, state.rawProgress, state.progress,
      c ? c.position.z : 0, c ? c.fov : 0,
    ]);
  }
}
requestAnimationFrame(frame);

/* ── curtain up ──────────────────────────────────────────────────── */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add('is-ready');
    boot?.addEventListener('transitionend', () => boot.remove(), { once: true });
    setTimeout(() => boot?.remove(), 2000);
  });
});
