import * as THREE from 'three';
import { SECTION_COUNT } from '../data/sections.js';
import { PHASE, phaseAt } from '../core/state.js';
import { rand, clamp, lerp } from '../core/util.js';

export const SPACING = 30;          // world units between sections
export const K_START = -6;          // curve param at the very beginning
export const K_END = SECTION_COUNT + 2;
const PTS = K_END - K_START + 1;    // 31 control points

/** Sun sits far down the avenue, slightly above the eye line. */
export const SUN_POS = new THREE.Vector3(0, 40, -1900);

/** The sun is built at unit scale then blown up, so it reads across 2 km of void. */
export const SUN_SCALE = 2.8;

/** Radius of the ring the shafts fold into — just outside the longest sun ray. */
export const RING_RADIUS = 345;
export const RING_STRETCH = 4.6;   // shafts lengthen as they become rays
export const RING_GIRTH = 3.0;

const UP = new THREE.Vector3(0, 1, 0);

/** The camera rides this. `k` is the section coordinate (-6 … 24). */
export const camCurve = new THREE.CatmullRomCurve3(
  Array.from({ length: PTS }, (_, idx) => {
    const k = K_START + idx;
    return new THREE.Vector3(
      Math.sin(k * 0.33) * 10,
      2.2 + Math.sin(k * 0.77) * 1.5,
      -k * SPACING
    );
  }),
  false,
  'catmullrom',
  0.5
);

export const kToU = (k) => clamp((k - K_START) / (PTS - 1), 0, 1);

/** Scroll progress -> section coordinate k (continuous, incl. lead-in). */
export function progressToK(p) {
  const { name, local } = phaseAt(p);
  if (name === 'hero') return lerp(K_START, K_START + 2.5, local);
  if (name === 'prologue') return lerp(K_START + 2.5, -0.5, local);
  if (name === 'colonnade') return local * SECTION_COUNT - 0.5;
  return SECTION_COUNT - 0.5; // epilogue drives the camera itself
}

const _p = new THREE.Vector3();
const _t = new THREE.Vector3();
const _r = new THREE.Vector3();

/** Position + orthonormal frame on the camera curve at section coordinate k. */
export function frameAt(k, out = {}) {
  const u = kToU(k);
  camCurve.getPoint(u, _p);
  camCurve.getTangent(u, _t).normalize();
  _r.crossVectors(_t, UP).normalize();
  out.pos = (out.pos || new THREE.Vector3()).copy(_p);
  out.fwd = (out.fwd || new THREE.Vector3()).copy(_t);
  out.right = (out.right || new THREE.Vector3()).copy(_r);
  return out;
}

const DIST = 46;      // how far ahead of the camera a monolith is planted
export const LAT_MAIN = -14;  // negative = left of the avenue, where the eye lands
const LAT_ECHO = 19;

/** Baked placement for the 22 section monoliths + their decorative echoes. */
export function buildPlacements() {
  const main = [];
  const echo = [];
  const f = {};
  for (let i = 0; i < SECTION_COUNT; i++) {
    frameAt(i, f);
    const p = f.pos.clone()
      .addScaledVector(f.fwd, DIST)
      .addScaledVector(f.right, LAT_MAIN);
    p.y -= 2.0;
    main.push({
      pos: p,
      height: 25 + rand(i * 3.1) * 4,
      radius: 1.45 + rand(i * 7.7) * 0.3,
      spin: (rand(i * 5.3) - 0.5) * 0.9,
      tilt: (rand(i * 11.9) - 0.5) * 0.07,
      ring: ringTransform(i),
    });

    frameAt(i + 0.5, f);
    const q = f.pos.clone()
      .addScaledVector(f.fwd, DIST)
      .addScaledVector(f.right, LAT_ECHO);
    q.y -= 5.5;
    echo.push({
      pos: q,
      height: 13 + rand(i * 2.7) * 6,
      radius: 1.15 + rand(i * 9.1) * 0.28,
      spin: (rand(i * 4.4) - 0.5) * 1.2,
      tilt: (rand(i * 13.3) - 0.5) * 0.05,
    });
  }
  return { main, echo };
}

/** Where monolith i flies to when the colonnade folds into the sun's ring. */
function ringTransform(i) {
  const theta = -Math.PI / 2 + (i / SECTION_COUNT) * Math.PI * 2;
  const dir = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
  const pos = SUN_POS.clone().addScaledVector(dir, RING_RADIUS);
  // orient local +Y along the radial direction so the shafts read as rays
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir);
  return { pos, quat, dir, theta };
}

/* ── Epilogue camera choreography ──────────────────────────────────── */
const endFrame = frameAt(SECTION_COUNT - 0.5, {});

export const EPILOGUE_KEYS = [
  { // still on the avenue, sun far ahead
    pos: endFrame.pos.clone(),
    aim: SUN_POS.clone().add(new THREE.Vector3(0, -14, 0)),
    fov: 45,
  },
  { // travel toward it
    pos: new THREE.Vector3(0, 24, SUN_POS.z + 1080),
    aim: SUN_POS.clone(),
    fov: 50,
  },
  { // rise, and the ring begins to read
    pos: new THREE.Vector3(0, SUN_POS.y + 70, SUN_POS.z + 1020),
    aim: SUN_POS.clone(),
    fov: 54,
  },
  { // settle square-on to the assembled charter
    pos: new THREE.Vector3(0, SUN_POS.y, SUN_POS.z + 1080),
    aim: SUN_POS.clone(),
    fov: 54,
  },
];

export function epilogueCamera(local, outPos, outAim) {
  const n = EPILOGUE_KEYS.length - 1;
  const x = clamp(local, 0, 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  const t = x - i;
  const e = t * t * (3 - 2 * t);
  const a = EPILOGUE_KEYS[i];
  const b = EPILOGUE_KEYS[i + 1];
  outPos.lerpVectors(a.pos, b.pos, e);
  outAim.lerpVectors(a.aim, b.aim, e);
  return lerp(a.fov, b.fov, e);
}

/** 0 → colonnade layout, 1 → ring around the sun. */
export function assemblyAmount(p) {
  const [a, b] = PHASE.epilogue;
  if (p <= a) return 0;
  const local = clamp((p - a) / (b - a));
  // hold, then fold between 12% and 62% of the epilogue
  return clamp((local - 0.12) / 0.5);
}
