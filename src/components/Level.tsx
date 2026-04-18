import * as THREE from "three";
import { type RapierRigidBody, RigidBody } from "@react-three/rapier";

import { MeshBasicNodeMaterial } from "three/webgpu";
import { fragmentShader as fresnelFragmentShader } from "./shaders/fresnel.ts";
import { RoundedBoxGeometry } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";

import { Fn, vec3, float } from "three/tsl";
import { uTime } from "./shaders/uniforms.ts";
import { vertexShader as baseVertexShader } from "./shaders/base.ts";
import {
  vertexShader as holographicVertexShader,
  fragmentShader as holographicFragmentShader,
} from "./shaders/holographic.ts";
import { Crown } from "./assets/Crown.tsx";
import { mulberry32 } from "../utils.ts";

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
holographicMaterial.opacityNode = float(30).toVar();

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

function BlockLimbo({ position = [0, 0, 0] }: BlockProps) {
  const obstacle = useRef<RapierRigidBody | null>(null);
  const [timeOffset, _] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!obstacle.current) return;
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;

    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });
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
  );
}

function BlockAxe({ position = [0, 0, 0] }: BlockProps) {
  const obstacle = useRef<RapierRigidBody | null>(null);
  const [timeOffset, _] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!obstacle.current) return;

    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;

    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });
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
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }: BlockProps) {
  const crown = useRef<RapierRigidBody | null>(null);
  const [speed, _] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
  );

  useFrame((state) => {
    if (!crown.current) return;

    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // console.log(rotation);

    crown.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <RigidBody type={"fixed"} restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={glassMaterial}
          position={[0, 0, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={crown}
        type={"kinematicPosition"}
        colliders={"trimesh"}
        position={[0, 0.25, 0]}
        restitution={0.2}
        friction={0}
      >
        <Crown scale={0.6} />
      </RigidBody>
    </group>
  );
}

const Level = ({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 2,
}) => {
  const blocks = useMemo(() => {
    const blocks = [];
    const rand = mulberry32(seed);
    console.log(rand());

    for (let i = 0; i < count; i++) {
      const random = rand();
      const type = types[Math.floor(random * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types, seed]);
  // console.log(blocks);

  useFrame((state) => {
    uTime.value = state.clock.getElapsedTime();
  });
  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, i) => (
        <Block key={i} position={[0, 0, -(i + 1) * 4]} />
      ))}

      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
    </>
  );
};
export default Level;
