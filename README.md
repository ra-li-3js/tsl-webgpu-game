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
