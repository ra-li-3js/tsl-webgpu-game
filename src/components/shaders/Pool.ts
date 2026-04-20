import {
  uniform,
  varying,
  vec2,
  dot,
  sin,
  fract,
  Fn,
  abs,
  max,
  min,
  mul,
  add,
  floor,
  float,
  sub,
  mix,
  smoothstep,
  clamp,
  step,
  length,
  exp,
  pow,
  vec4,
  color,
  positionLocal,
  modelWorldMatrix,
  uniformArray,
} from "three/tsl";
import { uTime as Time } from "./uniforms.ts";
import * as THREE from "three";

export const uTime = Time;
export const uScale = uniform(0.23);
export const uSmoothness = uniform(0.46);
export const uEdgeThreshold = uniform(0.09);
export const uEdgeSoftness = uniform(0.1);
export const uFlowX = uniform(0.07);
export const uFlowZ = uniform(-0.23);
export const uCellSpeed = uniform(0.55);
export const uNoiseScale = uniform(0.87);
export const uNoiseFlowSpeed = uniform(0.11);
export const uDistortAmount = uniform(0.26);

export const uDeepColor = uniform(color("#c41000"));
export const uMidColor = uniform(color("#ff7300"));
export const uMidPos = uniform(0.31);
export const uHighlight = uniform(color("#ffffff"));

export const uOpacity = uniform(1.0);
export const uDeepOpacity = uniform(0.37);
export const uFadeDistance = uniform(275.0);
export const uFadeStrength = uniform(1.3);
export const uCamXZ = uniform(vec2(0, 0));

// FIXED: Using uniformArray instead of uniform
export const uRippleCenters = uniformArray(
  Array.from({ length: 8 }, () => new THREE.Vector2()),
);
export const uRippleTimes = uniformArray(new Array(8).fill(0));

export const uRippleCount = uniform(0);
export const uRippleSpeed = uniform(1.5);
export const uRippleWidth = uniform(0.12);
export const uRippleStrength = uniform(5.5);
export const uRippleDecay = uniform(1.6);
export const uRippleRings = uniform(2);
export const uRippleSpacing = uniform(1.0);

// ── Varyings ───────────────────────────────────────────────────────────────

export const vWorldPos = varying(vec2(), "vWorldPos");

// ── Helpers ────────────────────────────────────────────────────────────────

// FIXED: Pure helpers don't need Fn wrappers
export const smin = (a: any, b: any, k: any) => {
  const h = max(k.sub(abs(a.sub(b))), 0.0).div(k);
  return min(a, b).sub(h.mul(h).mul(h).mul(k).div(6.0));
};

export const hash2 = (p_in: any) => {
  return Fn(() => {
    const p = vec2(p_in).toVar();
    p.assign(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))));
    // return fract(sin(p as any).mul(43758.5453));
    return fract(vec2(sin((p as any).x), sin((p as any).y)).mul(43758.5453));
  })();
};

export const cellPt = (seed: any) => {
  // We wrap 'seed' in hash2() to shatter the perfect grid!
  return add(
    0.5,
    mul(0.5, sin(uTime.mul(uCellSpeed).add(mul(6.2831, hash2(seed))) as any)),
  );
};

// FIXED: Helpers with .toVar() wrapped in self-executing Fn blocks
export const voronoiF1 = (p_in: any) => {
  return Fn(() => {
    const p = vec2(p_in).toVar();
    const i = floor(p);
    const f = fract(p);
    const md = float(8.0).toVar();

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const neighbor = vec2(x, y);
        const pt = cellPt(i.add(neighbor));
        const diff = neighbor.add(pt).sub(f);
        const d = length(diff);
        md.assign(min(md, d));
      }
    }
    return md;
  })();
};

export const voronoiSF1 = (p_in: any) => {
  return Fn(() => {
    const p = vec2(p_in).toVar();
    const i = floor(p);
    const f = fract(p);
    const res = float(8.0).toVar();

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const neighbor = vec2(x, y);
        const pt = cellPt(i.add(neighbor));
        const diff = neighbor.add(pt).sub(f);
        const d = length(diff);
        res.assign(smin(res, d, uSmoothness));
      }
    }
    return res;
  })();
};

export const nHash = (p_in: any) => {
  return Fn(() => {
    const p = vec2(p_in).toVar();
    p.assign(fract(p.mul(vec2(127.1, 311.7))));
    p.addAssign(dot(p, p.add(45.32)));
    return fract((p as any).x.mul((p as any).y));
  })();
};

export const vnoise = (p_in: any) => {
  return Fn(() => {
    const p = vec2(p_in).toVar();
    const i = floor(p);
    const f = fract(p).toVar();
    f.assign(f.mul(f).mul(sub(3.0, mul(2.0, f))));

    return mix(
      mix(nHash(i), nHash(i.add(vec2(1.0, 0.0))), (f as any).x),
      mix(
        nHash(i.add(vec2(0.0, 1.0))),
        nHash(i.add(vec2(1.0, 1.0))),
        (f as any).x,
      ),
      (f as any).y,
    );
  })();
};

export const fbm = (p_in: any) => {
  return Fn(() => {
    const p = vec2(p_in).toVar();
    const v = float(0.0).toVar();
    const a = float(0.5).toVar();

    // FIXED: Standard unrolled JS loops instead of TSL Loops
    for (let i = 0; i < 2; i++) {
      v.addAssign(a.mul(vnoise(p)));
      p.mulAssign(2.0);
      a.mulAssign(0.5);
    }
    return v;
  })();
};

// ── Fragment Shader ───────────────────────────────────────────────────────

export const poolFragmentShader = /*@__PURE__*/ Fn(() => {
  const noiseUV = vWorldPos
    .mul(uNoiseScale)
    .add(vec2(uTime.mul(uNoiseFlowSpeed), 0.0));
  const noiseFac = fbm(noiseUV);
  const distort = vec2(noiseFac.sub(0.5)).mul(uDistortAmount);

  const uv = vWorldPos
    .mul(uScale)
    .add(vec2(uFlowX, uFlowZ).mul(uTime))
    .add(distort);
  const f1 = voronoiF1(uv);
  const sf1 = voronoiSF1(uv);

  const edge = f1.sub(sf1);
  const t = smoothstep(
    uEdgeThreshold.sub(uEdgeSoftness),
    uEdgeThreshold.add(uEdgeSoftness),
    edge,
  );

  const safeMP = max(uMidPos, 1e-4);
  const seg0 = clamp(t.div(safeMP), 0.0, 1.0);
  const seg1 = clamp(t.sub(safeMP).div(max(sub(1.0, safeMP), 1e-4)), 0.0, 1.0);
  const inSeg1 = step(safeMP, t);

  const colorNode = mix(
    mix(uDeepColor, uMidColor, seg0),
    mix(uMidColor, uHighlight, seg1),
    inSeg1,
  ).toVar();

  const rippleAcc = float(0.0).toVar();

  // FIXED: Standard JS unrolled loops and proper array indexing via 'any'
  for (let i = 0; i < 8; i++) {
    const isOn = step(float(i), float(uRippleCount).sub(0.5));
    const elapsed = max(uTime.sub((uRippleTimes as any).element(i)), 0.0);
    const d = length(vWorldPos.sub((uRippleCenters as any).element(i)));

    for (let r = 0; r < 4; r++) {
      const rIsOn = step(float(r), float(uRippleRings).sub(0.5));
      const re = max(elapsed.sub(float(r).mul(uRippleSpacing)), 0.0);
      const ringR = re.mul(uRippleSpeed);
      const ringDist = abs(d.sub(ringR));
      const ring = sub(1.0, smoothstep(0.0, uRippleWidth, ringDist));
      const fade = exp(re.negate().mul(uRippleDecay));
      rippleAcc.addAssign(ring.mul(fade).mul(isOn).mul(rIsOn));
    }
  }

  const ripple = clamp(rippleAcc.mul(uRippleStrength), 0.0, 1.0);
  colorNode.assign(mix(colorNode, uHighlight, ripple));

  const dist = length(vWorldPos.sub(uCamXZ));
  const fade = sub(
    1.0,
    pow(clamp(dist.div(uFadeDistance), 0.0, 1.0), uFadeStrength),
  );
  const alpha = mix(uDeepOpacity, 1.0, max(t, ripple)).mul(uOpacity).mul(fade);

  // FIXED: Strict node assertions
  return vec4(colorNode as any, alpha as any);
});

// ── Vertex Shader ─────────────────────────────────────────────────────────

export const poolVertexShader = /*@__PURE__*/ Fn(() => {
  const pos = positionLocal.toVar();
  const worldPos = modelWorldMatrix.mul(vec4(pos as any, 1.0));

  vWorldPos.assign(worldPos.xz);

  return pos;
});
