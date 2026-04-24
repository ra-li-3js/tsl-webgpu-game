import WebGPUCanvas from "./components/WebGPUCanvas.tsx";
import { Physics } from "@react-three/rapier";
import Lights from "./components/Lights.tsx";
import Level from "./components/Level.tsx";
import Player from "./components/Player.tsx";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./Interface.tsx";
import useGame from "./stores/useGame.ts";

const Experience = () => {
  const blocksCount = useGame((state) => state.blocksCount);
  const blockSeed = useGame((state) => state.blockSeed);

  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <WebGPUCanvas>
          <color args={["#000809"]} attach="background" />

          <Physics debug={false}>
            <Lights />
            <Level count={blocksCount} seed={blockSeed} />
            <Player />
          </Physics>
        </WebGPUCanvas>
        <Interface />
      </KeyboardControls>
    </>
  );
};
export default Experience;
