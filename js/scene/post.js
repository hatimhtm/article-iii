import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/** Final grade: vignette, a whisper of chromatic aberration, and film grain. */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberration: { value: 0.0016 },
    uVignette: { value: 1.0 },
    uGrain: { value: 0.035 },
    uFade: { value: 0.0 },     // 0 = normal, 1 = black
    uWarm: { value: 0.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uAberration, uVignette, uGrain, uFade, uWarm;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);

      // chromatic aberration grows toward the corners
      float k = uAberration * (0.35 + r2 * 3.0);
      vec3 col;
      col.r = texture2D(tDiffuse, vUv - c * k).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv + c * k).b;

      // warm the highlights very slightly — gold, not orange
      col = mix(col, col * vec3(1.05, 1.0, 0.93), uWarm);

      float vig = 1.0 - uVignette * smoothstep(0.18, 0.78, r2);
      col *= vig;

      float g = hash(vUv * vec2(1024.0, 768.0) + fract(uTime) * 91.7) - 0.5;
      col += g * uGrain * (0.4 + 0.6 * (1.0 - vig));

      col *= (1.0 - uFade);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export function createComposer(renderer, scene, camera, opts) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  let bloom = null;
  if (opts.bloom) {
    bloom = new UnrealBloomPass(
      new THREE.Vector2(opts.width, opts.height),
      0.52,  // strength — only true highlights bloom
      0.55,  // radius
      0.62   // threshold
    );
    composer.addPass(bloom);
  }

  composer.addPass(new OutputPass());

  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);

  return {
    composer,
    bloom,
    grade,
    setSize(w, h) {
      composer.setSize(w, h);
      if (bloom) bloom.setSize(w, h);
    },
  };
}
