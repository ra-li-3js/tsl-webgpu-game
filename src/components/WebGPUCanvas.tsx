import { Canvas } from "@react-three/fiber";
import type { WebGPURendererParameters } from "three/src/renderers/webgpu/WebGPURenderer.js";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three/webgpu";

const WebGpuCanvas = ({ children }: { children: React.ReactNode }) => {
  const params = new URLSearchParams(window.location.search);
  const webgl = params.get("webgl") === "true";
  const debug = params.get("debug") == "true";
  return (
    <Canvas
      performance={{ min: 0.5, debounce: 300 }}
      camera={{ position: [0, 0, 3], far: 25 }}
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer({
          ...(props as WebGPURendererParameters),
          forceWebGL: webgl,
        });
        await renderer.init();

        if (webgl) {
          const isWebGL =
            "isWebGLBackend" in renderer.backend &&
            renderer.backend.isWebGLBackend;
          console.log("Current Backend: ", isWebGL ? "WebGL 2" : "WebGPU"); // expect WebGL 2 because of the condition
        }

        return renderer;
      }}
    >
      {children}

      {debug && (
        <>
          <OrbitControls enableDamping />
          <Stats />
        </>
      )}
    </Canvas>
  );
};
export default WebGpuCanvas;
