import { vec2, dot, sin, fract, Fn } from "three/tsl";

type Vec2Node = ReturnType<typeof vec2>;

const random2DFn = /*@__PURE__*/ Fn(
  ({ value }: { value: Vec2Node }, _builder: any) => {
    return fract(sin(dot(value, vec2(12.9898, 78.233))).mul(43758.5453123));
  },
  { value: "vec2", return: "float" },
);

export const random2D: (value: Vec2Node) => ReturnType<typeof random2DFn> = (
  value,
) => random2DFn({ value });
