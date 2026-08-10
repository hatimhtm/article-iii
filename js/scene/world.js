import * as THREE from 'three';
import { state, COUNTS, phaseAt, sectionCoord } from '../core/state.js';
import { SECTIONS } from '../data/sections.js';
import { CLUSTERS } from '../data/clusters.js';
import { clamp, lerp, damp, band, smoothstep, invLerp } from '../core/util.js';
import {
  frameAt, progressToK, epilogueCamera, assemblyAmount, SUN_POS, LAT_MAIN,
} from './layout.js';
import { createSun } from './sun.js';
import { createMonoliths } from './monoliths.js';
import { createStarfield, createDust } from './particles.js';
import { createGround } from './ground.js';
import { createComposer } from './post.js';

const HAZE_COLOR = new THREE.Color('#070C1B');
const VOID_COLOR = new THREE.Color('#04060F');

export function createWorld(canvas) {
  const q = state.quality;
  const counts = COUNTS[q];

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: q === 'high',
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
  });
  renderer.setClearColor(VOID_COLOR, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 4200);

  const sun = createSun(q);
  const monoliths = createMonoliths(HAZE_COLOR);
  const stars = createStarfield(counts.stars);
  const dust = createDust(counts.dust, HAZE_COLOR);
  const ground = createGround(HAZE_COLOR);

  scene.add(sun.group, monoliths.group, stars.points, dust.points, ground.mesh);

  const post = createComposer(renderer, scene, camera, {
    bloom: counts.bloom,
    width: 1280,
    height: 720,
  });

  /* ── working vectors ─────────────────────────────────────────────── */
  const camPos = new THREE.Vector3();
  const camAim = new THREE.Vector3();
  const focus = new THREE.Vector3();
  const f0 = {};
  const f1 = {};
  const accent = new THREE.Color();
  const accent2 = new THREE.Color();
  let smoothFov = 45;
  let wake = 0;
  let sunLevel = 0.5;
  let warmth = 0.25;
  let reveal = 0;

  camera.position.set(0, 3, 200);

  function setSize(w, h, dpr) {
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    post.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    stars.uniforms.uPixelRatio.value = dpr;
    dust.uniforms.uPixelRatio.value = dpr;
  }

  /** Colour the atmosphere with whatever section is currently in view. */
  const _cA = new THREE.Color();
  const _cB = new THREE.Color();
  const N = SECTIONS.length;
  function resolveAccent(coord) {
    const lo = clamp(Math.floor(coord), 0, N - 1);
    const hi = clamp(lo + 1, 0, N - 1);
    const t = clamp(coord - lo);
    const a = CLUSTERS[SECTIONS[lo].cluster];
    const b = CLUSTERS[SECTIONS[hi].cluster];
    accent.copy(_cA.set(a.color)).lerp(_cB.set(b.color), t);
    accent2.copy(_cA.set(a.color2)).lerp(_cB.set(b.color2), t);
  }

  function update(dt) {
    const p = state.progress;
    const t = state.time;
    const { name, local } = phaseAt(p);
    const coord = sectionCoord(p);
    const assembly = assemblyAmount(p);

    /* camera ------------------------------------------------------- */
    // On a tall, narrow screen the shaft placed left of the avenue falls clean
    // outside the horizontal field. `framing` slides the camera across toward
    // it and opens the lens, so the same composition survives a phone.
    const aspect = camera.aspect || 1.6;
    const framing = smoothstep(invLerp(1.45, 0.72, aspect));
    let targetFov = lerp(45, 62, framing);
    if (name === 'epilogue') {
      targetFov = epilogueCamera(local, camPos, camAim) + framing * 16;
    } else {
      const k = progressToK(p);
      frameAt(k, f0);
      frameAt(k + 1.25, f1);
      camPos.copy(f0.pos);
      camAim.copy(f1.pos);
      // ease the eye down the avenue rather than at the very next step
      camAim.y = lerp(camAim.y, f0.pos.y - 0.6, 0.4);
      if (name === 'hero') targetFov = lerp(52, 45, smoothstep(local)) + framing * 14;

      if (framing > 0.001) {
        const shift = LAT_MAIN * 0.78 * framing;
        camPos.addScaledVector(f0.right, shift);
        camAim.addScaledVector(f0.right, shift);
        camAim.y -= 7 * framing;   // lifts the shaft clear of the bottom sheet
      }
    }

    // pointer parallax — small, so it reads as presence not wobble
    const par = state.reducedMotion ? 0 : 1;
    const px = state.pointer.x * 2.1 * par;
    const py = state.pointer.y * 1.3 * par;
    if (name !== 'epilogue') {
      camPos.x += px;
      camPos.y += py;
      camAim.x += px * 0.35;
      camAim.y += py * 0.35;
    } else {
      camPos.x += px * 4;
      camPos.y += py * 3;
    }

    camera.position.copy(camPos);
    camera.lookAt(camAim);
    smoothFov = damp(smoothFov, targetFov, 0.001, dt);
    if (Math.abs(camera.fov - smoothFov) > 0.01) {
      camera.fov = smoothFov;
      camera.updateProjectionMatrix();
    }

    /* mood --------------------------------------------------------- */
    let targetWake = 0;
    let targetSun = 0.55;
    let targetWarm = 0.3;
    let targetReveal = 1;
    if (name === 'hero') {
      targetWake = 0.1;
      targetSun = lerp(0.55, 0.78, local);
      targetWarm = lerp(0.4, 0.55, local);
      targetReveal = 0;             // the colonnade is not there yet
    } else if (name === 'prologue') {
      // the article's own history: dark, then the turn, then light
      targetWake = band(local, 0.5, 1.0) * 0.5;
      targetSun = lerp(0.12, 0.92, band(local, 0.3, 0.95));
      targetWarm = band(local, 0.4, 1.0);
      targetReveal = band(local, 0.72, 1.0) * 0.8;  // it rises as 1987 arrives
    } else if (name === 'colonnade') {
      targetWake = 1;
      targetSun = 1;
      targetWarm = 1;
    } else {
      targetWake = 1;
      // the sun must not blow out the epilogue text sitting in front of it
      targetSun = lerp(1, 0.72, smoothstep(local));
      targetWarm = 1;
    }
    wake = damp(wake, targetWake, 0.02, dt);
    sunLevel = damp(sunLevel, targetSun, 0.02, dt);
    warmth = damp(warmth, targetWarm, 0.02, dt);
    reveal = damp(reveal, targetReveal, 0.015, dt);
    monoliths.setReveal(reveal);
    // in the epilogue the shafts are ~900 units out; the avenue's haze would
    // erase them, so push it far back as the ring assembles
    monoliths.setHazeRange(
      lerp(240, 1400, assembly),
      lerp(1150, 3200, assembly)
    );

    sun.setIntensity(sunLevel);
    sun.setWarmth(warmth);
    sun.update(t, camera);

    /* focus point -------------------------------------------------- */
    resolveAccent(coord);
    const active = monoliths.items[clamp(Math.round(coord), 0, SECTIONS.length - 1)];
    if (name === 'epilogue' && assembly > 0.5) focus.copy(SUN_POS);
    else if (name === 'colonnade' || name === 'epilogue') focus.copy(active.node.position);
    else focus.copy(camPos).addScaledVector(f0.fwd || new THREE.Vector3(0, 0, -1), 60);

    monoliths.update(t, coord, assembly, wake);

    /* particles ---------------------------------------------------- */
    stars.uniforms.uTime.value = t;
    stars.uniforms.uOpacity.value = lerp(0.35, 1.0, clamp(0.35 + wake * 0.65));
    stars.points.rotation.y = t * 0.0035;

    dust.uniforms.uTime.value = t;
    dust.uniforms.uCam.value.copy(camera.position);
    dust.uniforms.uFocus.value.copy(focus);
    dust.uniforms.uPull.value =
      name === 'colonnade' ? 0.28 + Math.abs(state.velocity) * 6 : 0.05;
    dust.uniforms.uTurb.value = state.reducedMotion ? 0.25 : 1;
    dust.uniforms.uOpacity.value = lerp(0.4, 1.0, wake);
    dust.uniforms.uAccent.value.copy(accent);

    ground.uniforms.uTime.value = t;
    ground.uniforms.uCam.value.copy(camera.position);
    ground.uniforms.uFocus.value.copy(focus);
    ground.uniforms.uAccent.value.copy(accent);
    ground.uniforms.uWake.value = wake;

    /* grade -------------------------------------------------------- */
    const g = post.grade.uniforms;
    g.uTime.value = t;
    g.uWarm.value = warmth;
    g.uVignette.value = lerp(1.15, 0.85, wake);
    g.uAberration.value = state.reducedMotion
      ? 0
      : 0.00035 + Math.min(Math.abs(state.velocity) * 0.5, 0.0022);
    g.uGrain.value = state.reducedMotion ? 0.010 : 0.024;

    if (post.bloom) {
      post.bloom.strength = lerp(0.34, 0.56, wake) + assembly * 0.18;
    }

    post.composer.render();
  }

  return {
    renderer, scene, camera, setSize, update,
    accent,
    dispose() {
      renderer.dispose();
      post.composer.dispose?.();
    },
  };
}
