import * as THREE from 'three';
import { NOISE } from './glsl.js';
import { SUN_POS, SUN_SCALE } from './layout.js';

/**
 * The eight-rayed sun of the Philippine flag, built as light rather than
 * geometry: a noisy plasma core, twenty-four additive ray blades
 * (eight rays, each a long lance flanked by two short ones), a halo,
 * and the three stars for Luzon, the Visayas and Mindanao.
 */

const GOLD_HOT = new THREE.Color('#FFF4D2');
const GOLD = new THREE.Color('#F7C548');
const AMBER = new THREE.Color('#E07B2A');

export function createSun(quality) {
  const group = new THREE.Group();
  group.position.copy(SUN_POS);
  group.scale.setScalar(SUN_SCALE);

  /* ── core ─────────────────────────────────────────────────────── */
  // detail 4 is 5,120 faces; the core is a glowing blob and gains nothing from 5
  const detail = quality === 'low' ? 2 : quality === 'medium' ? 3 : 4;
  const coreGeo = new THREE.IcosahedronGeometry(21, detail);
  const coreUniforms = {
    uTime: { value: 0 },
    uHot: { value: GOLD_HOT },
    uMid: { value: GOLD },
    uCool: { value: AMBER },
    uIntensity: { value: 1 },
  };
  const core = new THREE.Mesh(
    coreGeo,
    new THREE.ShaderMaterial({
      uniforms: coreUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        ${NOISE}
        uniform float uTime;
        varying float vN;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main() {
          vec3 p = normalize(position);
          float n = fbm(p * 2.4 + vec3(0.0, uTime * 0.11, uTime * 0.07));
          float n2 = fbm(p * 6.0 - vec3(uTime * 0.16, 0.0, 0.0));
          vN = n * 0.7 + n2 * 0.3;
          vec3 displaced = position * (1.0 + (vN - 0.5) * 0.16);
          vec4 wp = modelMatrix * vec4(displaced, 1.0);
          vNormalW = normalize(mat3(modelMatrix) * p);
          vViewDir = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uHot, uMid, uCool;
        uniform float uIntensity;
        varying float vN;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main() {
          // f is 1 at the silhouette. Fading OUT there (rather than adding a
          // rim) lets the core dissolve into the halo instead of reading as a
          // hard-edged disc pasted on the sky.
          float f = pow(1.0 - clamp(dot(vNormalW, vViewDir), 0.0, 1.0), 1.7);
          float limb = pow(1.0 - f, 1.15);
          vec3 c = mix(uCool, uMid, smoothstep(0.14, 0.52, vN));
          c = mix(c, uHot, smoothstep(0.6, 0.95, vN));
          float a = (0.34 + vN * 0.38) * limb * uIntensity;
          gl_FragColor = vec4(c * (0.55 + vN * 0.5) * limb * uIntensity, a);
        }
      `,
    })
  );
  group.add(core);

  /* ── ray blades ───────────────────────────────────────────────── */
  const rays = buildRays();
  group.add(rays.mesh);

  /* ── halo ─────────────────────────────────────────────────────── */
  const haloUniforms = {
    uTime: { value: 0 },
    uColor: { value: GOLD.clone() },
    uIntensity: { value: 1 },
  };
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(420, 420),
    new THREE.ShaderMaterial({
      uniforms: haloUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uTime, uIntensity;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float inner = exp(-d * 4.6) * 0.62;
          float outer = exp(-d * 1.45) * 0.22;
          float breathe = 0.92 + 0.08 * sin(uTime * 0.6);
          float a = (inner + outer) * breathe * uIntensity;
          gl_FragColor = vec4(uColor * a * 1.15, a);
        }
      `,
    })
  );
  halo.renderOrder = -2;
  group.add(halo);

  /* ── the three stars ──────────────────────────────────────────── */
  const stars = buildStars();
  group.add(stars.mesh);

  const api = {
    group,
    core,
    halo,
    rays: rays.mesh,
    stars: stars.mesh,
    setIntensity(v) {
      coreUniforms.uIntensity.value = v;
      haloUniforms.uIntensity.value = v;
      rays.uniforms.uIntensity.value = v;
      stars.uniforms.uIntensity.value = v;
    },
    setWarmth(v) {
      // 0 = cold ember (prologue), 1 = full gold
      coreUniforms.uMid.value.copy(AMBER).lerp(GOLD, v);
      coreUniforms.uHot.value.copy(GOLD).lerp(GOLD_HOT, v);
      haloUniforms.uColor.value.copy(AMBER).lerp(GOLD, v);
      rays.uniforms.uColor.value.copy(AMBER).lerp(GOLD, v);
    },
    update(t, camera) {
      coreUniforms.uTime.value = t;
      haloUniforms.uTime.value = t;
      rays.uniforms.uTime.value = t;
      stars.uniforms.uTime.value = t;
      core.rotation.y = t * 0.035;
      core.rotation.x = Math.sin(t * 0.05) * 0.12;
      rays.mesh.quaternion.copy(camera.quaternion);
      rays.mesh.rotateZ(t * 0.017);
      halo.quaternion.copy(camera.quaternion);
      stars.mesh.quaternion.copy(camera.quaternion);
    },
  };
  return api;
}

/** 8 long rays at 45°, each flanked by two shorter ones. */
function buildRays() {
  const pos = [];
  const grad = [];
  const seed = [];
  const width = [];

  const pushBlade = (angle, len, halfW, base, idx) => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    // local blade axis
    const ax = (r, o) => [c * r - s * o, s * r + c * o, 0];
    const a = ax(base, -halfW);
    const b = ax(base, halfW);
    const tip = ax(base + len, 0);
    pos.push(...a, ...b, ...tip);
    grad.push(0, 0, 1);
    seed.push(idx, idx, idx);
    width.push(-1, 1, 0);
  };

  let idx = 0;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    pushBlade(a, 86, 10.5, 16, idx++);
    pushBlade(a - 0.2, 50, 5.5, 15, idx++);
    pushBlade(a + 0.2, 50, 5.5, 15, idx++);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aGrad', new THREE.Float32BufferAttribute(grad, 1));
  geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
  geo.setAttribute('aW', new THREE.Float32BufferAttribute(width, 1));

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: GOLD.clone() },
    uHot: { value: GOLD_HOT },
    uIntensity: { value: 1 },
  };

  const mesh = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aGrad;
        attribute float aSeed;
        attribute float aW;
        uniform float uTime;
        varying float vGrad;
        varying float vPulse;
        varying float vW;
        void main() {
          vGrad = aGrad;
          vW = aW;
          vPulse = 0.72 + 0.28 * sin(uTime * 0.9 + aSeed * 1.37);
          vec3 p = position * (0.94 + 0.06 * vPulse);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor, uHot;
        uniform float uIntensity;
        varying float vGrad;
        varying float vPulse;
        varying float vW;
        void main() {
          float along = pow(1.0 - vGrad, 1.9);
          float across = 1.0 - abs(vW);
          float a = along * across * 0.42 * vPulse * uIntensity;
          vec3 c = mix(uHot, uColor, vGrad);
          gl_FragColor = vec4(c * a * 1.5, a);
        }
      `,
    })
  );
  mesh.renderOrder = -1;
  return { mesh, uniforms };
}

/** Luzon, the Visayas, Mindanao. */
function buildStars() {
  const R = 205;
  const coords = [
    [Math.cos(-Math.PI / 2) * R, Math.sin(-Math.PI / 2) * R],
    [Math.cos(Math.PI / 6) * R, Math.sin(Math.PI / 6) * R],
    [Math.cos((5 * Math.PI) / 6) * R, Math.sin((5 * Math.PI) / 6) * R],
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(coords.flatMap(([x, y]) => [x, y, 0]), 3)
  );
  geo.setAttribute('aSeed', new THREE.Float32BufferAttribute([0, 1, 2], 1));

  const uniforms = {
    uTime: { value: 0 },
    uIntensity: { value: 1 },
    uSize: { value: 200 },
    uPixelRatio: { value: 1 },
  };

  const mesh = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime, uSize, uPixelRatio;
        varying float vTwinkle;
        void main() {
          vTwinkle = 0.75 + 0.25 * sin(uTime * 1.1 + aSeed * 2.1);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPixelRatio * (300.0 / max(-mv.z, 1.0));
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uIntensity;
        varying float vTwinkle;
        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float r = length(uv);
          if (r > 1.0) discard;
          float ang = atan(uv.y, uv.x);
          // five-pointed star field
          float star = pow(max(0.0, cos(ang * 5.0)), 6.0);
          float core = exp(-r * 9.0);
          float spikes = star * exp(-r * 3.2) * 0.7;
          float a = (core + spikes) * vTwinkle * uIntensity;
          gl_FragColor = vec4(vec3(1.0, 0.94, 0.78) * a * 1.8, a);
        }
      `,
    })
  );
  return { mesh, uniforms };
}
