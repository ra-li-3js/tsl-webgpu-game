import {
  CapsuleCollider,
  type RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import PlayerModel from "./assets/PlayerModel.tsx";
import { useEffect, useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import useGame from "../stores/useGame.ts";
import { Group } from "three";

const Player = () => {
  const body = useRef<RapierRigidBody | null>(null);
  const modelRef = useRef<Group | null>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const targetRotation = new THREE.Quaternion();

  const [smoothedCameraPosition, _setSmoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10),
  );
  const [smoothedCameraTarget, _setSmoothedCameraTarget] = useState(
    () => new THREE.Vector3(0, 0, 0),
  );

  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);
  // const playerName = useGame((state) => state.playerName);

  const jump = () => {
    if (!body.current) return;

    const origin = body.current.translation();
    // console.log(origin);
    origin.y -= 0.61;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(
      ray,
      0.2,
      true,
      undefined,
      undefined,
      undefined,
      body.current,
    );
    // console.log(hit);

    if (hit && hit.timeOfImpact < 0.15) {
      const currentVel = body.current.linvel();
      body.current.setLinvel({ x: currentVel.x, y: 4, z: currentVel.z }, true);
    }
  };

  const reset = () => {
    if (!body.current) return;

    // console.log("reset");
    body.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };

  const lastBlock = useRef(0);

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        // console.log("state changed to ", value);
        if (value === "ready") {
          reset();
          lastBlock.current = 0;
        }
      },
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        // console.log(value);
        if (value) {
          // console.log("Yes jump");
          jump();
        }
      },
    );

    const unsubscribeAny = subscribeKeys(() => {
      // console.log("any key down");
      start();
    });

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    if (!body.current) return;

    // CONTROLS
    const { forward, backward, leftward, rightward } = getKeys();
    // console.log(getKeys());

    const currentVel = body.current.linvel();
    // const targetVel = new THREE.Vector3(0, currentVel.y, 0);
    // const speed = 3;

    const impulse = new THREE.Vector3(0, 0, 0);
    const accel = 5 * delta;

    if (forward) {
      // targetVel.z -= speed;
      impulse.z -= accel;
    }
    if (rightward) {
      // targetVel.x += speed;
      impulse.x += accel;
    }
    if (backward) {
      // targetVel.z += speed;
      impulse.z += accel;
    }
    if (leftward) {
      // targetVel.x -= speed;
      impulse.x -= accel;
    }

    // body.current.setLinvel(targetVel, true);
    body.current.applyImpulse(impulse, true);

    if (forward || backward || leftward || rightward) {
      const angle = Math.atan2(currentVel.x, currentVel.z);
      targetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
      modelRef.current?.quaternion.slerp(targetRotation, 15 * delta);
    }

    // CAMERA
    const bodyPosition = body.current.translation();
    // console.log(bodyPosition);

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;
    // state.camera.position.lerp(cameraPosition, 0.1);

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // PHASES
    if (bodyPosition.z < -(blocksCount * 4 + 2) && bodyPosition.y > -3)
      // console.log("We are at the end");
      end();

    if (bodyPosition.y < -10) restart();
  });
  return (
    <>
      <RigidBody
        ref={body}
        canSleep={false}
        colliders={false}
        enabledRotations={[false, false, false]}
        restitution={0.2}
        friction={0.2}
        linearDamping={2.5}
        position={[0, 1, 0]}
      >
        <group ref={modelRef} rotation={[0, Math.PI, 0]}>
          <PlayerModel scale={0.5} position={[0, -0.6, 0]} />
        </group>
        <CapsuleCollider args={[0.3, 0.3]} position={[0, 0, 0]} />
      </RigidBody>
    </>
  );
};
export default Player;
