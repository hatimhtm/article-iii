import * as THREE from 'three';
import { hazeUniforms, HAZE } from './glsl.js';
import { rand } from '../core/util.js';

/** Deep field of stars, far enough away to read as sky. */
export function createStarfield(count) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const tint = new Float32Array(count);
  const size = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // shell between r=900 and r=2200, biased toward the horizon band
    const u = rand(i * 1.7) * 2 - 1;
    const th = rand(i * 3.3) * Math.PI * 2;
    const r = 900 + rand(i * 5.1) * 1300;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    pos[i * 3] = Math.cos(th) * s * r;
    pos[i * 3 + 1] = u * r * 0.55;
    pos[i * 3 + 2] = Math.sin(th) * s * r;
    seed[i] = rand(i * 7.9) * 6.283;
    tint[i] = rand(i * 11.3);
    size[i] = 0.85 + rand(i * 13.7) * rand(i * 17.1) * 1.6;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setAttribute('aTint', new THREE.BufferAttribute(tint, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uOpacity: { value: 1 },
    uWarm: { value: new THREE.Color('#FFE9B8') },
    uCool: { value: new THREE.Color('#8FB6FF') },
  };

  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aSeed, aTint, aSize;
        uniform float uTime, uPixelRatio;
        varying float vTw;
        varying float vTint;
        void main() {
          vTint = aTint;
          vTw = 0.55 + 0.45 * sin(uTime * 0.7 + aSeed * 3.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = max(aSize * uPixelRatio * (620.0 / max(-mv.z, 40.0)), 1.5 * uPixelRatio);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        uniform vec3 uWarm, uCool;
        varying float vTw;
        varying float vTint;
        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float r = dot(uv, uv);
          if (r > 1.0) discard;
          float a = exp(-r * 5.0) * vTw * uOpacity * 0.72;
          vec3 c = mix(uCool, uWarm, vTint);
          gl_FragColor = vec4(c * a * 1.25, a);
        }
      `,
    })
  );
  points.frustumCulled = false;
  return { points, uniforms };
}

/**
 * Drifting motes that tile infinitely around the camera, so the traveller
 * is never in empty space no matter how far down the avenue they are.
 */
export function createDust(count, hazeColor) {
  const CELL = new THREE.Vector3(240, 150, 240);
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const size = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3] = rand(i * 2.1) * CELL.x;
    pos[i * 3 + 1] = rand(i * 4.3) * CELL.y;
    pos[i * 3 + 2] = rand(i * 6.7) * CELL.z;
    seed[i] = rand(i * 8.9);
    size[i] = 0.4 + rand(i * 10.1) * rand(i * 12.3) * 2.2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uCell: { value: CELL },
    uCam: { value: new THREE.Vector3() },
    uFocus: { value: new THREE.Vector3() },
    uPull: { value: 0 },
    uAccent: { value: new THREE.Color('#F7C548') },
    uBase: { value: new THREE.Color('#CBD9F5') },
    uOpacity: { value: 1 },
    uTurb: { value: 1 },
    ...hazeUniforms(hazeColor, 200, 620),
  };

  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aSeed, aSize;
        uniform float uTime, uPixelRatio, uPull, uTurb;
        uniform vec3 uCell, uCam, uFocus;
        varying float vFade;
        varying float vSeed;
        varying float vDist;

        void main() {
          vSeed = aSeed;
          vec3 base = position;
          // slow convection, then tile the cell around the camera
          base.y += uTime * (1.4 + aSeed * 2.2) * uTurb;
          base.x += sin(uTime * 0.24 + aSeed * 6.283) * 5.0 * uTurb;
          base.z += cos(uTime * 0.19 + aSeed * 4.1) * 5.0 * uTurb;

          vec3 w = base - uCell * floor((base - uCam) / uCell + 0.5);
          vec3 rel = w - uCam;

          // drawn toward the lit shaft
          if (uPull > 0.001) {
            vec3 d = uFocus - w;
            float len = max(length(d), 1.0);
            w += (d / len) * uPull * min(len * 0.28, 26.0);
            rel = w - uCam;
          }

          vec3 edge = abs(rel) / (uCell * 0.5);
          float f = (1.0 - smoothstep(0.62, 1.0, max(edge.x, max(edge.y, edge.z))));
          float near = smoothstep(2.0, 16.0, length(rel));
          vFade = f * near;

          vec4 mv = modelViewMatrix * vec4(w, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPixelRatio * (300.0 / max(-mv.z, 4.0));
        }
      `,
      fragmentShader: /* glsl */ `
        ${HAZE}
        uniform vec3 uAccent, uBase;
        uniform float uOpacity, uTime;
        varying float vFade;
        varying float vSeed;
        varying float vDist;
        void main() {
          vec2 uv = gl_PointCoord * 2.0 - 1.0;
          float r = dot(uv, uv);
          if (r > 1.0) discard;
          float tw = 0.6 + 0.4 * sin(uTime * 1.6 + vSeed * 31.0);
          float a = exp(-r * 3.6) * vFade * uOpacity * tw * 0.75;
          a *= 1.0 - hazeAmount(vDist);
          if (a < 0.004) discard;
          vec3 c = mix(uBase, uAccent, smoothstep(0.35, 0.9, vSeed));
          gl_FragColor = vec4(c * a * 1.6, a);
        }
      `,
    })
  );
  points.frustumCulled = false;
  return { points, uniforms };
}
