import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
// const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
// const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
// const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

interface BlockProps {
  position?: [number, number, number];
}

function BlockStart({ position = [0, 0, 0] }: BlockProps) {
  return (
    <group position={position}>
      <RigidBody type={"fixed"} restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={floor1Material}
          position={[0, -0.1, 0]}
          scale={[10, 0.2, 10]}
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

const Level = () => {
  return (
    <>
      <BlockStart position={[0, 0, 4]} />
    </>
  );
};
export default Level;
