import * as THREE from 'three';
import { NOISE } from './glsl.js';

/**
 * The sky was empty and static. Two additions make it a place:
 *
 *  AURORA — slow curtains of light breathing over the horizon, teal into
 *  violet with a gold seam near the sun. Under the martial-law prologue it
 *  collapses to a thin ember line.
 *
 *  COMETS — a handful of streaks on long, quiet cycles. Entirely GPU-driven:
 *  trajectory, timing and fade all derive from a per-quad seed, so they cost
 *  one draw call and zero JavaScript per frame.
 */

export function createAurora() {
  const uniforms = {
    uTime: { value: 0 },
    uIntensity: { value: 0.6 },
    uDread: { value: 0 },
    uWarm: { value: 0.5 },
  };

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(2600, 32, 20),
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        ${NOISE}
        uniform float uTime, uIntensity, uDread, uWarm;
        varying vec3 vDir;
        void main() {
          float el = vDir.y;
          // curtains live in a band above the horizon and thin with altitude
          float bandLo = mix(0.03, 0.015, uDread);
          float bandHi = mix(0.75, 0.22, uDread);
          float band = smoothstep(bandLo, 0.16, el) * (1.0 - smoothstep(0.34, bandHi, el));
          if (band < 0.003) { discard; }

          float az = atan(vDir.x, vDir.z);
          // two noise reads: one shapes the curtains, one folds them
          float n1 = noise3(vec3(az * 1.7, el * 3.0 - uTime * 0.020, uTime * 0.013));
          float n2 = noise3(vec3(az * 4.1 + 7.0, el * 6.5, uTime * 0.021));
          float curtain = pow(smoothstep(0.34, 0.82, n1 * 0.72 + n2 * 0.28), 2.0);

          // vertical striations — the classic aurora grain
          float rays = 0.75 + 0.25 * sin(az * 42.0 + n1 * 9.0);

          vec3 teal = vec3(0.16, 0.55, 0.47);
          vec3 violet = vec3(0.32, 0.22, 0.58);
          vec3 ember = vec3(0.42, 0.13, 0.10);
          vec3 c = mix(teal, violet, smoothstep(0.2, 0.8, n2));
          // a gold seam low over the sun's quarter of the sky
          float sunward = smoothstep(0.2, 1.0, -vDir.z) * (1.0 - smoothstep(0.05, 0.3, el));
          c = mix(c, vec3(0.62, 0.45, 0.18), sunward * uWarm * 0.6);
          c = mix(c, ember, uDread);

          float a = band * curtain * rays * uIntensity * 0.46;
          if (a < 0.003) discard;
          gl_FragColor = vec4(c * a * 2.4, a);
        }
      `,
    })
  );
  mesh.frustumCulled = false;
  mesh.renderOrder = -3;
  return { mesh, uniforms };
}

export function createComets(count = 7) {
  // one quad per comet; every vertex knows which corner it is and which
  // comet it belongs to, and the vertex shader does the rest
  const corner = [];
  const seed = [];
  const index = [];
  for (let i = 0; i < count; i++) {
    corner.push(-1, -1, 1, -1, 1, 1, -1, 1);
    for (let k = 0; k < 4; k++) seed.push(i * 13.71 + 4.7);
    const b = i * 4;
    index.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 4 * 3); // filled in the shader
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aCorner', new THREE.Float32BufferAttribute(corner, 2));
  geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
  geo.setIndex(index);

  const uniforms = {
    uTime: { value: 0 },
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
        attribute vec2 aCorner;
        attribute float aSeed;
        uniform float uTime;
        varying vec2 vUv;
        varying float vLive;

        float hash1(float n) { return fract(sin(n) * 43758.5453); }

        void main() {
          // each comet runs a private clock; most cycles it stays dark
          float T = uTime * 0.055 + aSeed;
          float cycle = floor(T);
          float ph = fract(T);
          float gate = step(0.72, hash1(aSeed * 3.1 + cycle * 17.7));

          float h1 = hash1(cycle * 7.13 + aSeed);
          float h2 = hash1(cycle * 3.77 + aSeed * 1.9);
          float az = h1 * 6.2832;
          float el = 0.32 + h2 * 0.4;

          vec3 start = vec3(cos(az) * cos(el), sin(el), sin(az) * cos(el)) * 1900.0;
          // travel obliquely downward across the sky
          vec3 dirTo = normalize(vec3(cos(az + 2.1), -0.55 - h2 * 0.4, sin(az + 2.1)));
          vec3 P = start + dirTo * ph * 900.0;

          vec3 view = normalize(P - cameraPosition);
          vec3 side = normalize(cross(dirTo, view));

          float trail = 130.0;
          float width = 2.6;
          vec3 world = P + dirTo * aCorner.x * trail + side * aCorner.y * width;

          vUv = aCorner;
          vLive = gate * smoothstep(0.0, 0.12, ph) * (1.0 - smoothstep(0.6, 1.0, ph));
          gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uIntensity;
        varying vec2 vUv;
        varying float vLive;
        void main() {
          if (vLive < 0.003) discard;
          // bright head at +x, tail dying behind it
          float head = smoothstep(-1.0, 1.0, vUv.x);
          float core = 1.0 - abs(vUv.y);
          float a = pow(head, 3.0) * core * core * vLive * uIntensity;
          vec3 c = mix(vec3(0.6, 0.72, 1.0), vec3(1.0, 0.96, 0.86), head);
          gl_FragColor = vec4(c * a * 1.6, a);
        }
      `,
    })
  );
  mesh.frustumCulled = false;
  return { mesh, uniforms };
}
