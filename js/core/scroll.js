import { state, TOTAL_SCREENS, phaseAt, sectionCoord, progressForSection, progressForPrologue, PHASE } from './state.js';
import { clamp, damp } from './util.js';
import { SECTION_COUNT } from '../data/sections.js';
import { PROLOGUE } from '../data/prologue.js';

let spacer = null;
let locked = false;

export function initScroll(spacerEl) {
  spacer = spacerEl;
  resize();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize);
  onScroll();
  // on reload, start rendered at the restored position instead of easing in
  state.progress = state.rawProgress;
}

function resize() {
  if (!spacer) return;
  spacer.style.height = `${TOTAL_SCREENS * 100}vh`;
}

export function scrollRange() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function onScroll() {
  if (locked) return;
  state.rawProgress = clamp(window.scrollY / scrollRange());
}

/** Drive the smoothed progress. Call once per frame. */
export function tickScroll(dt) {
  const prev = state.progress;
  const rate = state.reducedMotion ? 0.00001 : 0.0009;
  state.progress = damp(state.progress, state.rawProgress, rate, dt);
  if (Math.abs(state.progress - state.rawProgress) < 0.00002) {
    state.progress = state.rawProgress;
  }
  const inst = (state.progress - prev) / Math.max(dt, 1 / 240);
  state.velocity = damp(state.velocity, inst, 0.002, dt);

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
}

export function goToProgress(p, smooth = true) {
  const y = clamp(p) * scrollRange();
  window.scrollTo({ top: y, behavior: smooth && !state.reducedMotion ? 'smooth' : 'auto' });
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
  locked = v;
  // html keeps its scrollTop while overflow is hidden, so closing an overlay
  // returns to exactly where the traveller was
  document.documentElement.classList.toggle('is-locked', v);
}
