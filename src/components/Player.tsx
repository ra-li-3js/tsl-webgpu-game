import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import PlayerModel from "./PlayerModel.tsx";

const Player = () => {
  return (
    <>
      <RigidBody
        canSleep={false}
        colliders={false}
        enabledRotations={[false, false, false]}
        restitution={0.2}
        friction={1}
        position={[0, 1, 0]}
      >
        <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />
        <PlayerModel />
      </RigidBody>
    </>
  );
};
export default Player;
