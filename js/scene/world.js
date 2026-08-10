import * as THREE from 'three';
import { state, COUNTS, phaseAt, sectionCoord } from '../core/state.js';
import { SECTIONS } from '../data/sections.js';
import { CLUSTERS } from '../data/clusters.js';
import { MOTIF_FIELD } from '../data/motifs.js';
import { clamp, lerp, damp, band, smoothstep, invLerp } from '../core/util.js';
import {
  frameAt, progressToK, epilogueCamera, assemblyAmount, SUN_POS, LAT_MAIN,
} from './layout.js';
import { createSun } from './sun.js';
import { createMonoliths } from './monoliths.js';
import { createStarfield, createDust } from './particles.js';
import { createGround } from './ground.js';
import { createAurora, createComets } from './sky.js';
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
  const aurora = counts.sky ? createAurora() : null;
  const comets = counts.sky ? createComets() : null;

  scene.add(sun.group, monoliths.group, stars.points, dust.points, ground.mesh);
  if (aurora) scene.add(aurora.mesh);
  if (comets) scene.add(comets.mesh);

  const post = createComposer(renderer, scene, camera, {
    bloom: counts.bloom,
    rayTaps: counts.rayTaps,
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
  let dread = 0;
  let flash = 0;
  let roll = 0;
  let ringT = 1;
  let lastActive = -1;
  let firedFlash = false;
  let field = { pull: 0.3, turb: 1, rise: 1 };
  const focusAim = new THREE.Vector3();
  const _dolly = new THREE.Vector3();
  const _sunNdc = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = -1;
  let pickTick = 0;

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

      /* composed shot while dwelling: the eye lands on the lit band, the
         camera dollies in a touch, the lens tightens, and a slow drift keeps
         the parked frame alive. Leaving, everything releases to the road. */
      if (name === 'colonnade') {
        const nearest = clamp(Math.round(coord), 0, N - 1);
        const u = Math.abs(coord - nearest);
        const dwell = (1 - band(u, 0.16, 0.46)) * (1 - assembly);
        if (dwell > 0.001) {
          const it = monoliths.items[nearest];
          focusAim.copy(it.node.position);
          focusAim.y = it.avenuePos.y + (it.uniforms.uMark.value - 0.5) * it.height;
          // hold the shaft off dead-centre; the reading card owns the right
          focusAim.addScaledVector(f0.right, 5.5 * (1 - framing));
          camAim.lerp(focusAim, 0.62 * dwell);
          _dolly.copy(focusAim).sub(camPos).normalize();
          camPos.addScaledVector(_dolly, 2.1 * dwell);
          targetFov -= 2.4 * dwell;
          if (!state.reducedMotion) {
            camPos.addScaledVector(f0.right, Math.sin(t * 0.20) * 0.5 * dwell);
            camPos.y += Math.sin(t * 0.155 + 1.3) * 0.28 * dwell;
          }
        }
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

    // bank from actual path curvature, scaled by speed — the rail's own
    // geometry decides the lean, so it can never wobble against the turn
    const curve = (f1.fwd ? f1.fwd.x - f0.fwd.x : 0);
    const rollT = state.reducedMotion || name === 'epilogue'
      ? 0
      : clamp(curve * (2.2 + Math.min(Math.abs(state.velocity) * 30, 1.6)), -0.045, 0.045);
    roll = damp(roll, rollT, 0.002, dt);
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.position.copy(camPos);
    camera.lookAt(camAim);
    targetFov += state.reducedMotion ? 0 : Math.min(Math.abs(state.velocity) * 22, 5.5);
    smoothFov = damp(smoothFov, targetFov, 0.001, dt);
    if (Math.abs(camera.fov - smoothFov) > 0.01) {
      camera.fov = smoothFov;
      camera.updateProjectionMatrix();
    }

    /* mood --------------------------------------------------------- */
    let targetWake = 0;
    let targetDread = 0;
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
      targetDread = 1 - band(local, 0.26, 0.58);
      // beat 3 of 7 — Ninoy Aquino on the tarmac, 21 August 1983
      if (!firedFlash && local > 0.345 && local < 0.42) { flash = 1; firedFlash = true; }
      if (local < 0.30 || local > 0.50) firedFlash = false;
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
    dread = damp(dread, targetDread, 0.02, dt);
    flash = Math.max(0, flash - dt * 1.35);
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

    const activeIdx = clamp(Math.round(coord), 0, SECTIONS.length - 1);
    if (activeIdx !== lastActive) {
      if (lastActive >= 0 && name === 'colonnade') ringT = 0;
      lastActive = activeIdx;
      const f = MOTIF_FIELD[SECTIONS[activeIdx].motif];
      if (f) field = f;
    }
    ringT = Math.min(1, ringT + dt * 0.9);

    /* pointer picking — the shafts are objects, not wallpaper */
    if (!state.isCoarse && name === 'colonnade' && !state.spread && ++pickTick % 3 === 0) {
      ndc.set(state.pointer.tx, state.pointer.ty);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(monoliths.pickables, false)[0];
      const idx = hit ? monoliths.pickables.indexOf(hit.object) : -1;
      if (idx !== hovered) {
        hovered = idx;
        canvas.style.cursor = idx >= 0 ? 'pointer' : '';
      }
    } else if (hovered !== -1 && (state.isCoarse || name !== 'colonnade' || state.spread)) {
      hovered = -1;
      canvas.style.cursor = '';
    }

    // once the ring has landed, light walks it from §1 round to §22
    const seqLocal = name === 'epilogue' ? clamp((local - 0.64) / 0.30) : -1;
    const sequence = seqLocal > 0 && seqLocal < 1 ? seqLocal * SECTIONS.length : -1;

    monoliths.update(t, coord, assembly, wake, { hovered, dt, sequence });

    /* particles ---------------------------------------------------- */
    stars.uniforms.uTime.value = t;
    stars.uniforms.uOpacity.value = lerp(0.35, 1.0, clamp(0.35 + wake * 0.65));
    stars.points.rotation.y = t * 0.0035;

    dust.uniforms.uTime.value = t;
    dust.uniforms.uCam.value.copy(camera.position);
    dust.uniforms.uFocus.value.copy(focus);
    const motion = state.reducedMotion ? 0.3 : 1;
    dust.uniforms.uPull.value = name === 'colonnade'
      ? field.pull + Math.sign(field.pull || 1) * Math.abs(state.velocity) * 5
      : lerp(0.05, 0.02, dread);
    dust.uniforms.uTurb.value = lerp(field.turb, 0.55, dread) * motion;
    dust.uniforms.uRise.value = lerp(field.rise, -1.35, dread);   // ash falls
    dust.uniforms.uAsh.value = dread;
    dust.uniforms.uOpacity.value = lerp(0.4, 1.0, wake) * lerp(1, 3.4, dread);
    dust.uniforms.uAccent.value.copy(accent);

    ground.uniforms.uTime.value = t;
    ground.uniforms.uCam.value.copy(camera.position);
    ground.uniforms.uFocus.value.copy(focus);
    ground.uniforms.uAccent.value.copy(accent);
    ground.uniforms.uWake.value = wake;
    ground.uniforms.uRing.value = ringT;
    ground.uniforms.uDread.value = dread;

    /* sky ---------------------------------------------------------- */
    if (aurora) {
      aurora.uniforms.uTime.value = t;
      aurora.uniforms.uDread.value = dread;
      aurora.uniforms.uWarm.value = warmth;
      // quiet on the hero, breathing through the colonnade, glorious at the end
      aurora.uniforms.uIntensity.value =
        lerp(0.5, 1.0, wake) + assembly * 0.5 - dread * 0.15;
    }
    if (comets) {
      comets.uniforms.uTime.value = t;
      // no comets while history is being told
      comets.uniforms.uIntensity.value = (1 - dread) * lerp(0.5, 1, wake);
    }

    /* grade -------------------------------------------------------- */
    const g = post.grade.uniforms;
    g.uTime.value = t;
    g.uWarm.value = warmth;
    g.uVignette.value = lerp(1.15, 0.85, wake);
    g.uAberration.value = state.reducedMotion
      ? 0
      : 0.00035 + Math.min(Math.abs(state.velocity) * 0.5, 0.0022);
    g.uGrain.value = (state.reducedMotion ? 0.010 : 0.024) + dread * 0.045;
    g.uDread.value = dread;
    g.uFlash.value = flash * flash;
    g.uShake.value = state.reducedMotion ? 0 : dread * 0.8;
    g.uVignette.value += dread * 0.55;

    /* volumetric rays — project the sun and fade as it leaves frame */
    if (g.uRay) {
      _sunNdc.copy(SUN_POS).project(camera);
      const off = Math.max(Math.abs(_sunNdc.x), Math.abs(_sunNdc.y));
      const inFront = _sunNdc.z < 1;
      const vis = inFront ? clamp(1 - Math.max(0, (off - 1.05) / 0.7)) : 0;
      g.uSunScreen.value.set(_sunNdc.x * 0.5 + 0.5, _sunNdc.y * 0.5 + 0.5);
      g.uRay.value = vis * sunLevel * (0.16 + wake * 0.14 + assembly * 0.30);
      g.uRayTint.value.setRGB(1.0, lerp(0.62, 0.87, warmth), lerp(0.35, 0.60, warmth));
      if (dread > 0.01) {
        g.uRayTint.value.lerp(_cA.setRGB(0.85, 0.28, 0.20), dread);
        g.uRay.value *= 1 - dread * 0.5;
      }
    }

    if (post.bloom) {
      post.bloom.strength = lerp(0.34, 0.56, wake) + assembly * 0.18;
    }

    post.composer.render();
  }

  return {
    renderer, scene, camera, setSize, update,
    accent,
    hovered: () => hovered,
    dispose() {
      renderer.dispose();
      post.composer.dispose?.();
    },
  };
}
