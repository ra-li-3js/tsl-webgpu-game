/*
Adapted from: https://github.com/pmndrs/gltfjsx
I copy-pasted the types and jsx return from the base model, adding the animations part
*/

import { type JSX, useEffect, useRef } from "react";
import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";

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

/*
type MovementActionName =
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

type GeneralActionName =
  | 'Death_A'
  | 'Death_A_Pose'
  | 'Death_B'
  | 'Death_B_Pose'
  | 'Hit_A'
  | 'Hit_B'
  | 'Idle_A'
  | 'Idle_B'
  | 'Interact'
  | 'PickUp'
  | 'Spawn_Air'
  | 'Spawn_Ground'
  | 'T-Pose'
  | 'Throw'
  | 'Use_Item'
 */

// type GLTFActions = Record<GeneralActionName, THREE.AnimationAction>
// type GLTFActions = Record<MovementActionName, THREE.AnimationAction>;

const baseUrl = import.meta.env.BASE_URL;

const PlayerModel = (
  props: JSX.IntrinsicElements["group"],
  shadow: boolean = true,
) => {
  const group = useRef<THREE.Group | null>(null);

  const isMoving = useKeyboardControls(
    (state) =>
      state.forward || state.backward || state.leftward || state.rightward,
  );
  const isJumping = useKeyboardControls((state) => state.jump);

  const { nodes, materials } = useGLTF(
    `${baseUrl}/models/player/Mannequin_Medium.glb`,
  ) as unknown as GLTFResult;

  const { animations: movementAnims } = useGLTF(
    `${baseUrl}/models/player/Rig_Medium_MovementBasic.glb`,
  );
  const { animations: generalAnims } = useGLTF(
    `${baseUrl}/models/player/Rig_Medium_General.glb`,
  );

  const animations = [...movementAnims, ...generalAnims];

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const idleAction = actions["Idle_B"];
    const runAction = actions["Running_A"];
    const jumpAction = actions["Jump_Full_Short"];

    if (isJumping) {
      // 1. Highest Priority: Jumping
      jumpAction?.reset().fadeIn(0.1).play();
      runAction?.fadeOut(0.3);
      idleAction?.fadeOut(0.3);
    } else if (isMoving) {
      runAction?.reset().fadeIn(0.2).play();
      jumpAction?.fadeOut(0.2);
      idleAction?.reset().fadeOut(0.2).play();
    } else {
      idleAction?.reset().fadeIn(0.2).play();
      runAction?.reset().fadeOut(0.2).play();
      jumpAction?.fadeOut(0.2);
    }

    return () => {
      idleAction?.stop();
      runAction?.stop();
      jumpAction?.stop();
    };
  }, [isMoving, isJumping, actions]);
  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_ArmLeft.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_ArmLeft.skeleton}
          castShadow={shadow}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_ArmRight.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_ArmRight.skeleton}
          castShadow={shadow}
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
          castShadow={shadow}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_LegLeft.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_LegLeft.skeleton}
          castShadow={shadow}
        />
        <skinnedMesh
          geometry={nodes.Mannequin_Medium_LegRight.geometry}
          material={materials.Character_Material}
          skeleton={nodes.Mannequin_Medium_LegRight.skeleton}
          castShadow={shadow}
        />
        <primitive object={nodes.root} />
      </group>
    </>
  );
};

useGLTF.preload(`${baseUrl}/models/player/Mannequin_Medium.glb`);
useGLTF.preload(`${baseUrl}/models/player/Rig_Medium_MovementBasic.glb`);
useGLTF.preload(`${baseUrl}/models/player/Rig_Medium_General.glb`);

export default PlayerModel;
