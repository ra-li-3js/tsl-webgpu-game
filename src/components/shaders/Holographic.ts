import {
  varying,
  vec3,
  vec4,
  modelWorldMatrix,
  modelWorldMatrixInverse,
  positionLocal,
  sin,
  smoothstep,
  Fn,
  normalize,
  If,
  mod,
  pow,
  normalLocal,
  frontFacing,
  // float,
} from "three/tsl";

import { random2D } from "./includes/random2D.ts";
import { fragmentShader as fresnelFragmentShader } from "./fresnel";
import { uHolographicColor, uTime as Time } from "./uniforms";

const uColor = uHolographicColor;
const uTime = Time;

const vPosition = varying(vec3(), "vPosition");
const vNormal = varying(vec3(), "vNormal");

// #include "../includes/random2D.glsl"

export const vertexShader = /*@__PURE__*/ Fn(
  () => {
    // Position
    const position = positionLocal.toVar();
    const modelPosition = modelWorldMatrix.mul(vec4(position, 1.0)).toVar();

    // Glitch

    const glitchTime = uTime.sub(modelPosition.y);
    const glitchStrength = sin(glitchTime)
      .add(sin(glitchTime.mul(3.45)))
      .add(sin(glitchTime.mul(8.76)))
      .toVar();
    glitchStrength.divAssign(3.0);
    glitchStrength.assign(smoothstep(0.3, 1, glitchStrength));
    glitchStrength.mulAssign(0.25);
    modelPosition.x.addAssign(
      random2D(modelPosition.xz.add(uTime)).sub(0.5).mul(glitchStrength),
    );
    modelPosition.z.addAssign(
      random2D(modelPosition.zx.add(uTime)).sub(0.5).mul(glitchStrength),
    );

    // Final position

    // positionNode expects local-space output, so convert displaced world position back.
    const displacedLocal = modelWorldMatrixInverse.mul(modelPosition).xyz;

    // Model normal

    const modelNormal = modelWorldMatrix.mul(vec4(normalLocal, 0.0)).toVar();

    // w is 1 -> vector is homogeneous (rts are applied), w is 0 -> vector is not homogeneous (translation not applied)
    // Varyings

    vPosition.assign(modelPosition.xyz);

    //vNormal = normal; // surprise, the normal rotates too, see aboe ^

    vNormal.assign(modelNormal.xyz);

    return displacedLocal;
  },
  // { return: "void" },
);

export const fragmentShader = /*@__PURE__*/ Fn(
  () => {
    // Normal

    const normal = normalize(vNormal).toVar();

    If(frontFacing.not(), () => {
      normal.mulAssign(-1);
    });

    // Stripes

    // Copy varying component to a local mutable var (WGSL inputs are immutable).
    const stripes = vPosition.y.toVar();
    stripes.assign(mod(stripes.sub(uTime.mul(0.02)).mul(20), 1));
    stripes.assign(pow(stripes, 3));

    // Fresnel

    // const fresnel = dot(viewDirection, normal).add(1).toVar();
    // fresnel.assign(pow(fresnel, 2.0));

    const fresnel = fresnelFragmentShader(normal);

    // Falloff

    const falloff = smoothstep(0.8, 0.0, fresnel);

    // Holographic

    const holographic = stripes.mul(fresnel).toVar();
    holographic.addAssign(fresnel.mul(1.25));
    holographic.mulAssign(falloff);

    // Was it too hard to see???
    holographic.addAssign(0.002);

    // Final color

    // Base
    const finalColor = uColor.mul(1.4);

    // gl_FragColor.assign(vec4(vec3(uColor), holographic));
    return vec4(finalColor, holographic);
  },
  // { return: "void" },
);

// export const main = /*@__PURE__*/ overloadingFn([main_0, main_1]);
