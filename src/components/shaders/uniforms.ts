import { Color } from "three/webgpu";
import { uniform } from "three/tsl";

export const uTime = uniform(0);

export const uBaseColor = uniform(new Color("#ff70c6"));
export const uHolographicColor = uniform(new Color("#b80780"));
