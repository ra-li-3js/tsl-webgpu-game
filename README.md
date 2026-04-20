# TSL WebGPU Game

A small 3D obstacle-course game built with Three.js (TSL/WebGPU), React Three Fiber (with drei), and Rapier physics.


<img width="1320" height="655" alt="Crown and Player" src="https://github.com/user-attachments/assets/8984d5f7-cc56-418e-aed2-a77c0e5045e2" />


## Overview

The game generates a sort of modular obstacle course with a timed run to the Crown.

- Scene and controls map: `src/Experience.tsx`
- Renderer setup and URL flags: `src/components/WebGPUCanvas.tsx`
- Obstacle blocks and finish area: `src/components/Level.tsx`
- Player movement, jump, camera follow, and phase checks: `src/components/Player.tsx`
- Timer and restart UI: `src/Interface.tsx`
- Global game state and phases: `src/stores/useGame.ts`

## Controls

From `KeyboardControls` in `src/Experience.tsx`:

- `ArrowUp`: move forward
- `ArrowDown`: move backward
- `ArrowLeft`: move left
- `ArrowRight`: move right
- `Space`: jump

Any of these key press starts the run changing the game phase to `ready`.

## Physics
The game's physics are powered by `@react-three/rapier` to handle collisions, moving obstacles, and player interactions.

- Fixed platforms: Safe zones and the base ground (`BlockStart`, `BlockEnd`) use `type={"fixed"}` rigid bodies to provide solid, immovable surfaces.
- Kinematic obstacles: The moving walls and spinners (`BlockSpinner`, `BlockLimbo`, `BlockAxe`) use `type={"kinematicPosition"}`. They push the player but ignore forces like gravity, with their movement animated every frame via `setNextKinematicTranslation` or `setNextKinematicRotation`.
- Friction (Grip): The spinning obstacle in `BlockSpinner` is configured with high friction (`friction={1.2}`) so that when the player makes contact, they are gripped and pulled along with the rotation.
- Restitution (Bounciness): The swinging wall in `BlockAxe` is configured with high restitution (`restitution={2.2}`) so it acts like a spring, aggressively knocking the player back upon impact.
- Complex hitboxes: The finish marker (`Crown`) uses `colliders={"trimesh"}` so the physical boundaries perfectly match the 3D model's vertices instead of using basic primitive shapes.
- Physics debugging: You can toggle the visibility of all colliders on or off by passing the `debug` parameter to the main `<Physics>` component.
-And of course, with the classical gravity, you have to be skillful so that the player doesn't fall in the lava.

## URL Query Flags

Defined in `src/components/WebGPUCanvas.tsx`:

- `?debug=true`: enables `OrbitControls` and `Stats` (PS: disable the camera updates in `Player.tsx` to properly use `OrbitControls`)
- `?webgl=true`: forces WebGL backend instead of WebGPU (useful for testing and inspecting with Spector)

Examples:

- `http://localhost:5173/?debug=true` or `https://ra-li-3js.github.io/tsl-webgpu-game/?debug=true`
- `http://localhost:5173/?webgl=true` or `https://ra-li-3js.github.io/tsl-webgpu-game/?webgl=true`
- `http://localhost:5173/?debug=true&webgl=true` or `https://ra-li-3js.github.io/tsl-webgpu-game/?debug=true&webgl=true`

## Assets (glb)

3D assets are stored under `public/models`:

- Crown model and license: `public/models/crown` 
- Player model and license: `public/models/player`

## Deployment Note

`vite.config.js` sets `base: "tsl-webgpu-game"`.

If you deploy under a different path, update that `base` value to match your target.
