import {
  state, TOTAL_SCREENS, phaseAt, sectionCoord,
  progressForSection, progressForPrologue, PHASE,
} from './state.js';
import { clamp, damp } from './util.js';
import { SECTION_COUNT } from '../data/sections.js';
import { PROLOGUE } from '../data/prologue.js';

/**
 * The motion pipeline.
 *
 * Native scroll stays the input — accessibility and momentum come free — but
 * everything the camera feels is shaped here:
 *
 *   raw scroll ──► critically-damped spring ──► progress the world reads
 *
 * plus two behaviours a rail alone can't give:
 *
 *   SETTLE  when the traveller stops near a section, the camera glides onto
 *           its exact centre. You can never park in the dead zone between
 *           two sections.
 *   TWEEN   every programmatic jump (keys, rail, map, shaft click) is our own
 *           animation with one easing everywhere — never the browser's
 *           inconsistent `behavior:'smooth'`.
 */

let spacer = null;
let locked = false;

/* spring state */
let pv = 0;

/* user-intent bookkeeping */
let lastInput = -1e9;
let selfScrollMarks = 0;   // scroll events our own tween generated
const now = () => performance.now();

/* one scroll animation at a time */
let tween = null;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeInOutQuint = (t) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

export function initScroll(spacerEl) {
  spacer = spacerEl;
  resize();

  window.addEventListener('scroll', () => {
    if (selfScrollMarks > 0) selfScrollMarks--;
    else lastInput = now();               // scrollbar drags count as intent
    if (!locked) state.rawProgress = clamp(window.scrollY / scrollRange());
  }, { passive: true });

  // real input interrupts any animation immediately — the user always wins
  const interrupt = () => { lastInput = now(); tween = null; };
  window.addEventListener('wheel', interrupt, { passive: true, capture: true });
  window.addEventListener('touchstart', interrupt, { passive: true, capture: true });
  window.addEventListener('touchmove', interrupt, { passive: true, capture: true });
  window.addEventListener('pointerdown', interrupt, { passive: true, capture: true });
  window.addEventListener('keydown', interrupt, { capture: true });

  window.addEventListener('resize', resize);
  state.rawProgress = clamp(window.scrollY / scrollRange());
  state.progress = state.rawProgress;
  pv = 0;
}

function resize() {
  if (!spacer) return;
  spacer.style.height = `${TOTAL_SCREENS * 100}vh`;
}

export function scrollRange() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

/* ── the per-frame drive ───────────────────────────────────────────── */
export function tickScroll(dt) {
  // advance our own scroll animation, if one is running
  if (tween) {
    const t = clamp((now() - tween.t0) / tween.dur);
    selfScrollMarks++;
    window.scrollTo(0, tween.from + (tween.to - tween.from) * tween.ease(t));
    if (t >= 1) tween = null;
  }

  // critically-damped spring: tracks tightly while moving, lands without a
  // single oscillation when the input stops
  const target = state.rawProgress;
  if (state.reducedMotion) {
    state.progress = target;
    pv = 0;
  } else {
    const w = 7.4;                          // rad/s — the whole feel lives here
    const a = w * w * (target - state.progress) - 2 * w * pv;
    pv += a * dt;
    state.progress += pv * dt;
    if (Math.abs(state.progress - target) < 1e-5 && Math.abs(pv) < 1e-4) {
      state.progress = target;
      pv = 0;
    }
  }
  state.velocity = damp(state.velocity, pv, 0.002, dt);

  const ph = phaseAt(state.progress);
  state.phase = ph.name;
  state.phaseLocal = ph.local;

  state.sectionIndex =
    ph.name === 'colonnade'
      ? clamp(Math.round(sectionCoord(state.progress)), 0, SECTION_COUNT - 1)
      : ph.name === 'epilogue'
        ? SECTION_COUNT - 1
        : -1;

  state.prologueIndex =
    ph.name === 'prologue'
      ? clamp(Math.floor(ph.local * PROLOGUE.length), 0, PROLOGUE.length - 1)
      : -1;

  maybeSettle();
}

/* ── magnetic settle ───────────────────────────────────────────────── */
function maybeSettle() {
  if (tween || locked || state.overlay || state.spread) return;
  if (state.reducedMotion) return;          // never move a reduced-motion user
  if (now() - lastInput < 260) return;      // momentum is still the user's

  const ph = phaseAt(state.rawProgress);
  let target = null;
  let half = 0;

  if (ph.name === 'colonnade') {
    const i = clamp(Math.round(sectionCoord(state.rawProgress)), 0, SECTION_COUNT - 1);
    target = progressForSection(i);
    half = (PHASE.colonnade[1] - PHASE.colonnade[0]) / SECTION_COUNT / 2;
  } else if (ph.name === 'prologue') {
    const i = clamp(Math.round(ph.local * PROLOGUE.length - 0.5), 0, PROLOGUE.length - 1);
    target = progressForPrologue(i);
    half = (PHASE.prologue[1] - PHASE.prologue[0]) / PROLOGUE.length / 2;
  } else {
    return;
  }

  const d = Math.abs(state.rawProgress - target);
  if (d < 1e-4 || d > half * 0.98) return;  // already there, or truly between

  const px = d * scrollRange();
  startTween(target, clamp(560 + px * 0.4, 560, 900), easeInOutCubic);
}

/* ── programmatic movement ─────────────────────────────────────────── */
function startTween(p, dur, ease) {
  const to = clamp(p) * scrollRange();
  const from = window.scrollY;
  if (Math.abs(to - from) < 1) return;
  if (state.reducedMotion) {
    selfScrollMarks++;
    window.scrollTo(0, to);
    return;
  }
  tween = { from, to, t0: now(), dur, ease };
}

export function goToProgress(p, smooth = true) {
  const target = clamp(p);
  if (locked) {
    // The study spread freezes the page but still needs to move the journey,
    // so drive progress directly and reconcile the scrollbar on unlock.
    state.rawProgress = target;
    return;
  }
  lastInput = now();
  if (!smooth || state.reducedMotion) {
    tween = null;
    selfScrollMarks++;
    window.scrollTo(0, target * scrollRange());
    return;
  }
  const px = Math.abs(target * scrollRange() - window.scrollY);
  startTween(target, clamp(480 + px * 0.22, 520, 1400), easeInOutQuint);
}

export const goToSection = (i, smooth = true) =>
  goToProgress(progressForSection(clamp(i, 0, SECTION_COUNT - 1)), smooth);

export const goToPrologue = (i, smooth = true) =>
  goToProgress(progressForPrologue(clamp(i, 0, PROLOGUE.length - 1)), smooth);

export const goToPhase = (name, smooth = true) =>
  goToProgress(name === 'hero' ? 0 : PHASE[name][0] + 0.004, smooth);

/** Advance to the next / previous meaningful stop. */
export function step(dir) {
  const { name } = phaseAt(state.rawProgress);
  if (name === 'colonnade') {
    const i = Math.round(sectionCoord(state.rawProgress));
    const next = i + dir;
    if (next < 0) return goToPhase('prologue');
    if (next >= SECTION_COUNT) return goToPhase('epilogue');
    return goToSection(next);
  }
  if (name === 'prologue') {
    const i = state.prologueIndex < 0 ? 0 : state.prologueIndex;
    const next = i + dir;
    if (next < 0) return goToProgress(0);
    if (next >= PROLOGUE.length) return goToSection(0);
    return goToPrologue(next);
  }
  if (name === 'hero') return dir > 0 ? goToPhase('prologue') : goToProgress(0);
  return dir > 0 ? goToProgress(1) : goToSection(SECTION_COUNT - 1);
}

export function lockScroll(v) {
  if (v === locked) return;
  locked = v;
  tween = null;
  document.documentElement.classList.toggle('is-locked', v);
  if (!v) {
    // progress may have been driven programmatically while frozen — put the
    // scrollbar back under it before live scroll events resume
    selfScrollMarks++;
    window.scrollTo({ top: state.rawProgress * scrollRange(), behavior: 'auto' });
  }
}
