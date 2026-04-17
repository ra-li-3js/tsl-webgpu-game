/*
Adapted from: https://github.com/pmndrs/gltfjsx
I copy-pasted the types and jsx return from the base model, adding the animations part
*/

import { type JSX, useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";

import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

type GLTFResult = GLTF & {
  nodes: {
    Mannequin_Medium_ArmLeft: THREE.SkinnedMesh;
    Mannequin_Medium_ArmRight: THREE.SkinnedMesh;
    Mannequin_Medium_Body: THREE.SkinnedMesh;
    Mannequin_Medium_Head: THREE.SkinnedMesh;
    Mannequin_Medium_LegLeft: THREE.SkinnedMesh;
    Mannequin_Medium_LegRight: THREE.SkinnedMesh;
    root: THREE.Bone;
  };
  materials: {
    Character_Material: THREE.MeshStandardMaterial;
  };
};

// @ts-ignore
type ActionName =
  | "Jump_Full_Long"
  | "Jump_Full_Short"
  | "Jump_Idle"
  | "Jump_Land"
  | "Jump_Start"
  | "Running_A"
  | "Running_B"
  | "T-Pose"
  | "Walking_A"
  | "Walking_B"
  | "Walking_C";

// type GLTFActions = Record<ActionName, THREE.AnimationAction>;

const PlayerModel = (props: JSX.IntrinsicElements["group"]) => {
  const group = useRef<THREE.Group | null>(null);

  const { nodes, materials } = useGLTF(
    "/models/player/Mannequin_Medium.glb",
  ) as unknown as GLTFResult;

  const { animations } = useGLTF("/models/player/Rig_Medium_MovementBasic.glb");

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const actionNames = Object.keys(actions);

    if (actionNames.length === 0) return;

    const run = actions[actionNames[5]];
    run?.reset().fadeIn(0.6).play();

    return () => {
      if (actionNames.length > 0) {
        run?.fadeOut(0.6);
      }
    };
  }, [actions]);
  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_ArmLeft.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_ArmLeft.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_ArmRight.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_ArmRight.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_Body.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_Body.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_Head.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_Head.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_LegLeft.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_LegLeft.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_LegRight.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_LegRight.skeleton}
        />
        <primitive object={nodes.root} />
      </group>
    </>
  );
};

useGLTF.preload("/models/player/Mannequin_Medium.glb");
useGLTF.preload("/models/player/Rig_Medium_MovementBasic.glb");

export default PlayerModel;
