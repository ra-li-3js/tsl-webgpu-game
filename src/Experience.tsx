import WebGPUCanvas from "./components/WebGPUCanvas.tsx";
import { Physics } from "@react-three/rapier";
import Lights from "./components/Lights.tsx";
import Level from "./components/Level.tsx";
import Player from "./components/Player.tsx";
import { KeyboardControls } from "@react-three/drei";

const Experience = () => {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp"] },
          { name: "backward", keys: ["ArrowDown"] },
          { name: "leftward", keys: ["ArrowLeft"] },
          { name: "rightward", keys: ["ArrowRight"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <WebGPUCanvas>
          <color args={["#000809"]} attach="background" />

          <Physics debug={false}>
            <Lights />
            <Level />
            <Player />
          </Physics>
        </WebGPUCanvas>
      </KeyboardControls>
    </>
  );
};
export default Experience;
