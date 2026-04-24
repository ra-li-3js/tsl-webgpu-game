import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { rippleStore } from "../stores/rippleStore.ts";

import {
  poolFragmentShader,
  poolVertexShader,
  uCamXZ,
  uRippleCenters,
  uRippleTimes,
  uRippleCount,
  uRippleSpeed,
  uRippleWidth,
  uRippleStrength,
  uRippleDecay,
  uRippleRings,
  uRippleSpacing,
  uDeepOpacity,
} from "./shaders/Pool.ts";

interface LavaFloorProps {
  deepOpacityOverride?: number;
}

export default function LavaFloor({ deepOpacityOverride }: LavaFloorProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const material = useMemo(
    () =>
      new MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        fragmentNode: poolFragmentShader(),
        positionNode: poolVertexShader(),
      }),
    [],
  );

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    uCamXZ.value.set(camera.position.x, camera.position.z);

    if (deepOpacityOverride !== undefined) {
      uDeepOpacity.value = deepOpacityOverride;
    }

    const cfg = rippleStore.getConfig();
    uRippleSpeed.value = cfg.speed;
    uRippleWidth.value = cfg.width;
    uRippleStrength.value = cfg.strength;
    uRippleDecay.value = cfg.decay;
    uRippleRings.value = cfg.rings;
    uRippleSpacing.value = cfg.spacing;

    const ripples = rippleStore.get();
    uRippleCount.value = ripples.length;

    for (let i = 0; i < ripples.length; i++) {
      // @ts-ignore
      uRippleCenters.value[i].set(ripples[i].x, ripples[i].z);
      uRippleTimes.value[i] = ripples[i].t;
    }

    meshRef.current.position.x = camera.position.x;
    meshRef.current.position.z = camera.position.z;
  });

  return (
    <mesh
      ref={meshRef}
      material={material}
      rotation-x={-Math.PI / 2}
      position={[0, -7, 0]}
      frustumCulled={true}
      renderOrder={2}
    >
      <planeGeometry args={[600, 600]} />
    </mesh>
  );
}
