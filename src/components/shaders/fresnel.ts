import {
  cameraPosition,
  dot,
  float,
  frontFacing,
  If,
  normalize,
  pow,
  varying,
  vec3,
} from "three/tsl";

const vPosition = varying(vec3(), "vPosition");
const vNormal = varying(vec3(), "vNormal");
type Vec3Node = ReturnType<typeof vec3>;
type FloatNode = ReturnType<typeof float>;

// Allows both fragmentShader() and fragmentShader(normal, viewDirection).
export const fragmentShader = (
  normal?: Vec3Node,
  viewDirection?: Vec3Node,
): FloatNode => {
  const finalNormal = (normal ?? normalize(vNormal)).toVar();
  If(frontFacing.not(), () => {
    finalNormal.mulAssign(-1);
  });

  const finalViewDirection =
    viewDirection ?? normalize(vPosition.sub(cameraPosition));

  const fresnel = dot(finalViewDirection, finalNormal).add(1).toVar();
  fresnel.assign(pow(fresnel, 2.0));

  return fresnel as FloatNode;
};

// export const main = /*@__PURE__*/ overloadingFn([main_0, main_1]);
