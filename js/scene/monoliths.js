import * as THREE from 'three';
import { SECTIONS } from '../data/sections.js';
import { CLUSTERS } from '../data/clusters.js';
import { buildPlacements, RING_STRETCH, RING_GIRTH, SUN_POS } from './layout.js';
import { NOISE, HAZE } from './glsl.js';
import { clamp } from '../core/util.js';

/**
 * One hexagonal shaft per section. The height of the bright band on each
 * shaft encodes its position in the article — §1 near the foot, §22 near
 * the crown — so the colonnade reads as a rising scale as you travel it.
 */

const BODY_VS = /* glsl */ `
  uniform float uTime;
  uniform float uCharge;
  uniform float uSeed;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vW;
  varying float vH;
  varying float vDist;
  void main() {
    vH = position.y + 0.5;
    vec3 p = position;
    // a slow breathing sway, stronger when the shaft is lit
    float sway = sin(uTime * 0.6 + uSeed * 3.1 + vH * 2.0) * 0.012 * (0.4 + uCharge);
    p.x += sway;
    p.z += sway * 0.7;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vW = wp.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    vDist = length(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const BODY_FS = /* glsl */ `
  ${NOISE}
  ${HAZE}
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform vec3 uBody;
  uniform float uTime;
  uniform float uCharge;
  uniform float uMark;
  uniform float uSeed;
  uniform float uReveal;
  uniform vec3 uSun;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vW;
  varying float vH;
  varying float vDist;

  void main() {
    vec3 N = normalize(vNormalW);
    float fres = pow(1.0 - clamp(dot(N, normalize(vViewDir)), 0.0, 1.0), 2.2);

    // the sun is the only light in this world; wrap-lighting keeps the
    // faces turned away from it readable instead of pure black
    vec3 L = normalize(uSun - vW);
    float lam = max(dot(N, L), 0.0);
    float wrap = lam * 0.72 + 0.28;
    float kiss = pow(lam, 3.0);

    // vertical grain inside the stone. Two octaves by hand rather than fbm():
    // this runs on every pixel of a shaft that can fill half the screen.
    float grain = (noise3(vec3(vH * 7.0, uSeed * 4.0, uTime * 0.05)) * 0.66
                 + noise3(vec3(vH * 19.0, uSeed * 9.0, 0.0)) * 0.34) * 0.5 + 0.4;

    // the section band: a soft halo with a cut line at its centre.
    // its height along the shaft is where this section sits in the article.
    float band = exp(-pow((vH - uMark) * 19.0, 2.0));
    float line = exp(-pow((vH - uMark) * 78.0, 2.0));

    // a travelling pulse of light, only while the shaft is charged
    float travel = exp(-pow((vH - fract(uTime * 0.16 + uSeed)) * 11.0, 2.0)) * uCharge;

    vec3 c = uBody;
    c += uColor2 * wrap * (0.26 + uCharge * 0.34);
    c += vec3(1.0, 0.84, 0.58) * kiss * (0.06 + uCharge * 0.20);
    c += uColor2 * fres * (0.24 + uCharge * 0.60);
    c += uColor * band * (0.14 + uCharge * 0.42);
    c += uColor * line * (0.22 + uCharge * 0.75);
    c += uColor * travel * 0.30;
    c *= 0.55 + grain * 0.6;

    float a = 0.10 + fres * 0.46 + wrap * 0.13 + kiss * 0.10
            + band * (0.13 + uCharge * 0.20)
            + line * (0.16 + uCharge * 0.24)
            + travel * 0.16;
    a *= (0.30 + uCharge * 0.55) * uReveal;

    float hz = hazeAmount(vDist);
    c = mix(c, uHazeColor, hz);
    a *= 1.0 - hz * 0.85;

    // a shaft you have drawn level with dissolves rather than becoming a wall
    a *= smoothstep(14.0, 40.0, vDist);

    if (a < 0.004) discard;
    gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
  }
`;

const CORE_VS = /* glsl */ `
  varying float vH;
  varying float vDist;
  void main() {
    vH = position.y + 0.5;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vDist = length(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const CORE_FS = /* glsl */ `
  ${HAZE}
  uniform vec3 uColor;
  uniform float uCharge;
  uniform float uTime;
  uniform float uSeed;
  uniform float uReveal;
  varying float vH;
  varying float vDist;
  void main() {
    float shape = smoothstep(0.0, 0.26, vH) * (1.0 - smoothstep(0.48, 0.98, vH));
    float flicker = 0.86 + 0.14 * sin(uTime * 2.3 + uSeed * 5.0);
    float a = shape * uCharge * 0.26 * flicker * uReveal;
    a *= 1.0 - hazeAmount(vDist);
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor * a * 2.2, a);
  }
`;

export function createMonoliths(hazeColor) {
  const group = new THREE.Group();
  const { main, echo } = buildPlacements();

  // one shared handle that fades the whole colonnade in and out — the shafts
  // do not exist yet during the overture and the prologue
  const reveal = { value: 0 };
  const sunRef = { value: SUN_POS.clone() };
  // shared so the epilogue can push the fog back and let the ring read at 900 units
  const hazeRange = { value: new THREE.Vector2(240, 1150) };
  const haze = () => ({ uHazeColor: { value: hazeColor }, uHazeRange: hazeRange });

  // flat-faceted: six clean planes of stone rather than a smooth tube
  const shaftGeo = new THREE.CylinderGeometry(0.62, 1.0, 1.0, 6, 1, false).toNonIndexed();
  shaftGeo.computeVertexNormals();
  const coreGeo = new THREE.CylinderGeometry(0.34, 0.5, 1.0, 6, 1, true);
  const bodyColor = new THREE.Color('#0A1024');

  const items = [];

  SECTIONS.forEach((sec, i) => {
    const pl = main[i];
    const cl = CLUSTERS[sec.cluster];
    const c1 = new THREE.Color(cl.color);
    const c2 = new THREE.Color(cl.color2);

    const uniforms = {
      uTime: { value: 0 },
      uCharge: { value: 0 },
      uColor: { value: c1 },
      uColor2: { value: c2 },
      uBody: { value: bodyColor.clone() },
      uMark: { value: 0.1 + (i / (SECTIONS.length - 1)) * 0.8 },
      uSeed: { value: i * 0.618 },
      uReveal: reveal,
      uSun: sunRef,
      ...haze(),
    };

    const body = new THREE.Mesh(
      shaftGeo,
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: BODY_VS,
        fragmentShader: BODY_FS,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );

    const coreUniforms = {
      uTime: uniforms.uTime,
      uCharge: uniforms.uCharge,
      uColor: { value: c1 },
      uSeed: uniforms.uSeed,
      uReveal: reveal,
      ...haze(),
    };
    const core = new THREE.Mesh(
      coreGeo,
      new THREE.ShaderMaterial({
        uniforms: coreUniforms,
        vertexShader: CORE_VS,
        fragmentShader: CORE_FS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );

    const node = new THREE.Group();
    node.add(body, core);
    node.scale.set(pl.radius, pl.height, pl.radius);

    const avenueQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(pl.tilt, pl.spin, pl.tilt * 0.6)
    );
    node.position.copy(pl.pos);
    node.quaternion.copy(avenueQuat);

    group.add(node);
    items.push({
      node, uniforms, coreUniforms, index: i,
      avenuePos: pl.pos.clone(),
      avenueQuat,
      ringPos: pl.ring.pos.clone(),
      ringQuat: pl.ring.quat.clone(),
      height: pl.height,
      radius: pl.radius,
      pos: node.position,
    });
  });

  /* decorative counter-row — colonnade depth, no data attached */
  const echoItems = [];
  echo.forEach((pl, i) => {
    const cl = CLUSTERS[SECTIONS[i].cluster];
    const uniforms = {
      uTime: { value: 0 },
      uCharge: { value: 0 },
      uColor: { value: new THREE.Color(cl.color2) },
      uColor2: { value: new THREE.Color(cl.color2) },
      uBody: { value: bodyColor.clone() },
      uMark: { value: -1 },
      uSeed: { value: i * 0.37 + 5 },
      uReveal: reveal,
      uSun: sunRef,
      ...haze(),
    };
    const m = new THREE.Mesh(
      shaftGeo,
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: BODY_VS,
        fragmentShader: BODY_FS,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    m.position.copy(pl.pos);
    m.scale.set(pl.radius, pl.height, pl.radius);
    m.quaternion.setFromEuler(new THREE.Euler(pl.tilt, pl.spin, 0));
    group.add(m);
    echoItems.push({ mesh: m, uniforms, index: i });
  });

  const _p = new THREE.Vector3();
  const _q = new THREE.Quaternion();

  return {
    group,
    items,
    /** 0 = the colonnade is not there at all, 1 = fully present */
    setReveal(v) { reveal.value = v; },
    setHazeRange(near, far) { hazeRange.value.set(near, far); },
    /**
     * @param t        elapsed seconds
     * @param coord    continuous section coordinate (may be outside 0..21)
     * @param assembly 0 = avenue, 1 = folded into the sun's ring
     * @param wake     0..1 global "the article is alive" level
     */
    update(t, coord, assembly, wake) {
      const folding = assembly > 0.0001;
      for (const it of items) {
        const d = Math.abs(it.index - coord);
        let charge = clamp(1 - d / 1.9);
        charge = charge * charge * (3 - 2 * charge);
        charge = Math.max(charge, wake * 0.22);
        if (folding) charge = Math.max(charge, assembly * 0.85);
        it.uniforms.uCharge.value = charge;
        it.uniforms.uTime.value = t;

        if (folding) {
          // stagger so the shafts arrive in order, §1 first
          const s = clamp((assembly - (it.index / items.length) * 0.35) / 0.65);
          const e = s * s * (3 - 2 * s);
          _p.lerpVectors(it.avenuePos, it.ringPos, e);
          it.node.position.copy(_p);
          _q.copy(it.avenueQuat).slerp(it.ringQuat, e);
          it.node.quaternion.copy(_q);
          // they grow as they become rays, so the ring reads from 900 units out
          const g = 1 + (RING_GIRTH - 1) * e;
          it.node.scale.set(
            it.radius * g,
            it.height * (1 + (RING_STRETCH - 1) * e),
            it.radius * g
          );
        } else if (it.node.position.x !== it.avenuePos.x || it.node.scale.y !== it.height) {
          it.node.position.copy(it.avenuePos);
          it.node.quaternion.copy(it.avenueQuat);
          it.node.scale.set(it.radius, it.height, it.radius);
        }
      }
      for (const e of echoItems) {
        const d = Math.abs(e.index + 0.5 - coord);
        e.uniforms.uCharge.value =
          Math.max(clamp(1 - d / 2.6) * 0.5, wake * 0.12) * (1 - assembly);
        e.uniforms.uTime.value = t;
      }
    },
  };
}
