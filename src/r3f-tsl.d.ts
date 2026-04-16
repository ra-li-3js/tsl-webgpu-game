import type { ThreeElement } from "@react-three/fiber";
import type * as THREE_WEBGPU from "three/webgpu";

declare module "@react-three/fiber" {
  interface ThreeElements {
    // Line Node Materials
    line2NodeMaterial: ThreeElement<typeof THREE_WEBGPU.Line2NodeMaterial>;
    lineBasicNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.LineBasicNodeMaterial
    >;
    lineDashedNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.LineDashedNodeMaterial
    >;

    // Mesh Node Materials
    meshBasicNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshBasicNodeMaterial
    >;
    meshLambertNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshLambertNodeMaterial
    >;
    meshMatcapNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshMatcapNodeMaterial
    >;
    meshNormalNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshNormalNodeMaterial
    >;
    meshPhongNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshPhongNodeMaterial
    >;
    meshPhysicalNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshPhysicalNodeMaterial
    >;
    meshSSSNodeMaterial: ThreeElement<typeof THREE_WEBGPU.MeshSSSNodeMaterial>;
    meshStandardNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshStandardNodeMaterial
    >;
    meshToonNodeMaterial: ThreeElement<
      typeof THREE_WEBGPU.MeshToonNodeMaterial
    >;

    // Other Node Materials
    nodeMaterial: ThreeElement<typeof THREE_WEBGPU.NodeMaterial>;
    pointsNodeMaterial: ThreeElement<typeof THREE_WEBGPU.PointsNodeMaterial>;
    shadowNodeMaterial: ThreeElement<typeof THREE_WEBGPU.ShadowNodeMaterial>;
    spriteNodeMaterial: ThreeElement<typeof THREE_WEBGPU.SpriteNodeMaterial>;
    volumeNodeMaterial: ThreeElement<typeof THREE_WEBGPU.VolumeNodeMaterial>;

    // WebGPU Lights
    iESSpotLight: ThreeElement<typeof THREE_WEBGPU.IESSpotLight>;
    projectorLight: ThreeElement<typeof THREE_WEBGPU.ProjectorLight>;

    // WebGPU Objects
    clippingGroup: ThreeElement<typeof THREE_WEBGPU.ClippingGroup>;
    quadMesh: ThreeElement<typeof THREE_WEBGPU.QuadMesh>;
  }
}
