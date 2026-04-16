import WebGPUCanvas from "./components/WebGPUCanvas.tsx";
import Lights from "./components/Lights.tsx";

const Experience = () => {
  return (
    <>
      <WebGPUCanvas>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color={"red"} />
        </mesh>
        <Lights />
      </WebGPUCanvas>
    </>
  );
};
export default Experience;
