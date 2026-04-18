import * as THREE from "three";
import { type RapierRigidBody, RigidBody } from "@react-three/rapier";

import { MeshBasicNodeMaterial } from "three/webgpu";
import { fragmentShader as fresnelFragmentShader } from "./shaders/fresnel.ts";
import { RoundedBoxGeometry } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

import { Fn, vec3, float } from "three/tsl";
import { uTime } from "./shaders/uniforms.ts";
import { vertexShader as baseVertexShader } from "./shaders/base.ts";
import {
  vertexShader as holographicVertexShader,
  fragmentShader as holographicFragmentShader,
} from "./shaders/holographic.ts";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 256, 256);

// const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
// const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
// const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
// const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

// TSL customs :p
const glassMaterial = new MeshBasicNodeMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  positionNode: baseVertexShader(),
  colorNode: vec3(0, 0.3, 0),
  opacityNode: Fn(
    () => {
      return fresnelFragmentShader().toVar();
    },
    // { return: "vec3" },
  )(),
});

const holographicMaterial = glassMaterial.clone();
holographicMaterial.positionNode = holographicVertexShader();
holographicMaterial.colorNode = holographicFragmentShader();
holographicMaterial.opacityNode = float(1).toVar();

interface BlockProps {
  position?: [number, number, number];
}

function BlockStart({ position = [0, 0, 0] }: BlockProps) {
  return (
    <group position={position}>
      <RigidBody type={"fixed"} restitution={0.2} friction={0}>
        <mesh
          // geometry={boxGeometry}
          material={glassMaterial}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        >
          <RoundedBoxGeometry />
        </mesh>
      </RigidBody>
    </group>
  );
}

function BlockSpinner({ position = [0, 0, 0] }: BlockProps) {
  const obstacle = useRef<RapierRigidBody | null>(null);
  const [speed, _] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
  );

  useFrame((state) => {
    if (!obstacle.current) return;

    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // console.log(rotation);

    obstacle.current.setNextKinematicRotation(rotation);
  });
  return (
    <>
      <group position={position}>
        <RigidBody type={"fixed"} restitution={0.2} friction={0}>
          <mesh
            // geometry={boxGeometry}
            material={glassMaterial}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
          >
            <RoundedBoxGeometry />
          </mesh>
        </RigidBody>
        <RigidBody
          ref={obstacle}
          type={"kinematicPosition"}
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={holographicMaterial}
            scale={[3.5, 0.3, 0.3]}
            castShadow
            receiveShadow
          />
        </RigidBody>
      </group>
    </>
  );
}

const Level = () => {
  useFrame((state) => {
    uTime.value = state.clock.getElapsedTime();
  });
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      <BlockSpinner position={[0, 0, -4]} />
    </>
  );
};
export default Level;
