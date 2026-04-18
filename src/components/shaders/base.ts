import {
  varying,
  vec3,
  vec4,
  modelWorldMatrix,
  modelWorldMatrixInverse,
  positionLocal,
  Fn,
  normalLocal,
  normalize,
} from "three/tsl";

import { uBaseColor } from "./uniforms.ts";

const uColor = uBaseColor;

const vPosition = varying(vec3(), "vPosition");
const vNormal = varying(vec3(), "vNormal");

export const vertexShader = /*@__PURE__*/ Fn(
  () => {
    // Position
    const position = positionLocal.toVar();
    const modelPosition = modelWorldMatrix.mul(vec4(position, 1.0)).toVar();

    // Final position

    // positionNode expects local-space output, so convert displaced world position back.
    const displacedLocal = modelWorldMatrixInverse.mul(modelPosition).xyz;

    // Model normal

    const modelNormal = modelWorldMatrix.mul(vec4(normalLocal, 0.0)).toVar();

    // w is 1 -> vector is homogeneous (rts are applied), w is 0 -> vector is not homogeneous (translation not applied)
    // Varyings

    vPosition.assign(modelPosition.xyz);

    //vNormal = normal; // surprise, the normal rotates too, see aboe ^

    vNormal.assign(normalize(modelNormal.xyz));

    return displacedLocal;
  },
  // { return: "void" },
);

export const fragmentShader = /*@__PURE__*/ Fn(
  () => {
    // Final color

    // gl_FragColor.assign(vec4(vec3(uColor), holographic));
    return vec4(vec3(uColor), 1);
  },
  // { return: "void" },
);
