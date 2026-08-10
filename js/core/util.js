export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));
export const smoothstep = (t) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Frame-rate independent exponential smoothing.
 *  `rate` is roughly "fraction remaining after 1 second". */
export const damp = (current, target, rate, dt) =>
  lerp(current, target, 1 - Math.pow(rate, dt));

/** Maps v from [a,b] to [0,1], clamped, then smoothstepped. */
export const band = (v, a, b) => smoothstep(invLerp(a, b, v));

/** 1 inside [a,b] with soft shoulders of width `f`. */
export const pulse = (v, a, b, f) =>
  band(v, a - f, a) * (1 - band(v, b, b + f));

export const rand = (seed) => {
  // deterministic 0..1 — we never want a different layout between reloads
  let x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const el = (sel, root = document) => root.querySelector(sel);
export const els = (sel, root = document) => [...root.querySelectorAll(sel)];

export function make(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/** Roman numerals for 1..22 — small fixed table beats an algorithm here. */
export const ROMAN = [
  '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
  'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII',
];
