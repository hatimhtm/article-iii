/** Shared GLSL fragments. Hash-based value noise — cheap, stable, no textures. */
import * as THREE from 'three';

export const NOISE = /* glsl */ `
  vec3 hash33(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123) * 2.0 - 1.0;
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
              dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
          mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
              dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
      mix(mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
              dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
          mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
              dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
      u.z) * 0.5 + 0.5;
  }

  float fbm(vec3 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * noise3(p);
      p *= 2.03;
      a *= 0.5;
    }
    return s;
  }
`;

/** Distance haze so far geometry sinks into the void instead of popping. */
export const HAZE = /* glsl */ `
  uniform vec3 uHazeColor;
  uniform vec2 uHazeRange;   // x = start fading, y = fully hazed
  float hazeAmount(float d) {
    return smoothstep(uHazeRange.x, uHazeRange.y, d);
  }
`;

export const hazeUniforms = (color, near = 240.0, far = 1150.0) => ({
  uHazeColor: { value: color },
  uHazeRange: { value: new THREE.Vector2(near, far) },
});
