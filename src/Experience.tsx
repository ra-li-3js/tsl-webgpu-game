import WebGPUCanvas from "./components/WebGPUCanvas.tsx";
import { Physics } from "@react-three/rapier";
import Lights from "./components/Lights.tsx";
import Level from "./components/Level.tsx";
import Player from "./components/Player.tsx";

const Experience = () => {
  return (
    <>
      <WebGPUCanvas>
        <color args={["#05475c"]} attach="background" />

        <Physics debug>
          <Lights />
          <Level />
          <Player />
        </Physics>
      </WebGPUCanvas>
    </>
  );
};
export default Experience;
