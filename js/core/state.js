import { SECTION_COUNT } from '../data/sections.js';
import { PROLOGUE } from '../data/prologue.js';
import { clamp, invLerp, prefersReducedMotion } from './util.js';

/* ── Journey layout, expressed in screen-heights ───────────────────── */
const SCREENS = {
  hero: 1.7,
  prologue: PROLOGUE.length * 0.9,   // 6.3
  colonnade: SECTION_COUNT * 1.12,   // 24.64
  epilogue: 3.4,
};
export const TOTAL_SCREENS =
  SCREENS.hero + SCREENS.prologue + SCREENS.colonnade + SCREENS.epilogue;

const acc = (() => {
  let z = 0;
  const out = {};
  for (const k of ['hero', 'prologue', 'colonnade', 'epilogue']) {
    out[k] = [z / TOTAL_SCREENS, (z + SCREENS[k]) / TOTAL_SCREENS];
    z += SCREENS[k];
  }
  return out;
})();

export const PHASE = acc; // { hero:[a,b], prologue:[a,b], colonnade:[a,b], epilogue:[a,b] }

/** Progress p (0..1) -> which phase, and the local 0..1 within it. */
export function phaseAt(p) {
  for (const name of ['hero', 'prologue', 'colonnade', 'epilogue']) {
    const [a, b] = PHASE[name];
    if (p < b || name === 'epilogue') {
      return { name, local: clamp(invLerp(a, b, p)) };
    }
  }
  return { name: 'epilogue', local: 1 };
}

/** Continuous section coordinate: 0 at §1's centre, 21 at §22's centre. */
export function sectionCoord(p) {
  const [a, b] = PHASE.colonnade;
  const local = invLerp(a, b, p);
  return local * SECTION_COUNT - 0.5;
}

/** Scroll progress that centres section index i (0-based). */
export function progressForSection(i) {
  const [a, b] = PHASE.colonnade;
  return a + ((i + 0.5) / SECTION_COUNT) * (b - a);
}

export function progressForPrologue(i) {
  const [a, b] = PHASE.prologue;
  return a + ((i + 0.5) / PROLOGUE.length) * (b - a);
}

/* ── Global mutable state ──────────────────────────────────────────── */
export const state = {
  progress: 0,        // smoothed 0..1
  rawProgress: 0,     // instantaneous 0..1
  velocity: 0,        // d(progress)/frame, smoothed — drives motion blur-ish effects
  phase: 'hero',
  phaseLocal: 0,
  sectionIndex: -1,   // active section (0-based) or -1
  prologueIndex: -1,
  pointer: { x: 0, y: 0, tx: 0, ty: 0 },  // -1..1, smoothed + target
  width: 0,
  height: 0,
  dpr: 1,
  isMobile: false,
  isCoarse: false,
  reducedMotion: prefersReducedMotion(),
  quality: 'high',    // high | medium | low
  overlay: null,      // 'map' | 'quiz' | 'search' | null
  spread: false,      // the full-screen study spread is open
  webgl: true,
  audio: false,
  time: 0,
};

export function detectQuality() {
  const w = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  state.isCoarse = coarse;
  state.isMobile = w < 900;
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  if (state.reducedMotion) state.quality = 'low';
  else if (w < 700 || mem <= 4 || cores <= 4) state.quality = 'medium';
  else state.quality = 'high';
  if (w < 500 && (mem <= 4 || cores <= 4)) state.quality = 'low';
  return state.quality;
}

export const COUNTS = {
  high: { stars: 4200, dust: 8000, bloom: true },
  medium: { stars: 2200, dust: 3600, bloom: true },
  low: { stars: 1100, dust: 1500, bloom: false },
};
