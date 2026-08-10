import * as THREE from 'three';
import { NOISE } from './glsl.js';
import { SUN_POS } from './layout.js';

/**
 * The floor of the avenue. Not a solid surface — a dark tide with a faint
 * survey grid, brightest directly beneath whatever is currently lit.
 */
export function createGround(hazeColor) {
  const geo = new THREE.PlaneGeometry(5200, 5200, 1, 1);
  const uniforms = {
    uTime: { value: 0 },
    uCam: { value: new THREE.Vector3() },
    uFocus: { value: new THREE.Vector3() },
    uAccent: { value: new THREE.Color('#F7C548') },
    uHaze: { value: hazeColor },
    uSun: { value: SUN_POS.clone() },
    uWake: { value: 0 },
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
        varying vec3 vW;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        ${NOISE}
        uniform float uTime, uWake;
        uniform vec3 uCam, uFocus, uAccent, uHaze, uSun;
        varying vec3 vW;

        float gridLine(vec2 p, float step, float w) {
          vec2 g = abs(fract(p / step - 0.5) - 0.5) / fwidth(p / step);
          return 1.0 - min(min(g.x, g.y) / w, 1.0);
        }

        void main() {
          float dCam = length(vW - uCam);
          // everything dies off with distance; nothing is ever fully solid
          float reach = exp(-dCam / 300.0);
          if (reach < 0.004) discard;

          float g1 = gridLine(vW.xz, 30.0, 1.6) * 0.16;
          float g2 = gridLine(vW.xz, 150.0, 1.4) * 0.14;

          // single octave — this covers the whole lower half of the frame
          float swell = noise3(vec3(vW.xz * 0.004, uTime * 0.03)) * 0.5;

          float pool = exp(-length(vW.xz - uFocus.xz) / 22.0) * 0.8;
          float sunPool = exp(-length(vW.xz - uSun.xz) / 260.0) * 0.35;

          // the survey grid stays a neutral warm grey; the section colour
          // only tints it, so the whole world never turns one hue
          vec3 grid = mix(vec3(0.62, 0.64, 0.72), uAccent, 0.34);
          vec3 c = uHaze * (0.5 + swell * 0.8);
          c += grid * (g1 + g2) * (0.30 + uWake * 0.6);
          c += mix(grid, uAccent, 0.7) * pool * (0.22 + uWake * 0.6);
          c += vec3(0.95, 0.80, 0.52) * sunPool * 0.7;

          float a = (g1 + g2 + pool * 0.5 + sunPool * 0.45 + swell * 0.08) * reach;
          if (a < 0.003) discard;
          gl_FragColor = vec4(c * 0.95, clamp(a, 0.0, 1.0));
        }
      `,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, -30, -500);
  mesh.frustumCulled = false;

  return { mesh, uniforms };
}
