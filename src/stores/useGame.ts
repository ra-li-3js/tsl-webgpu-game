import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
  blocksCount: number;
  blockSeed: number;
  playerName: string;
  startTime: number;
  endTime: number;
  phase: "ready" | "playing" | "ended";

  start: () => void;
  restart: () => void;
  setPlayerName: (name: string) => void;
  end: () => void;
}

const useGame = create<GameState>()(
  subscribeWithSelector((set) => {
    return {
      blocksCount: 25,
      blockSeed: 0,
      playerName: "",
      startTime: 0,
      endTime: 0,
      phase: "ready",

      start: () => {
        set((state) => {
          if (state.phase === "ready")
            return { phase: "playing", startTime: Date.now() };

          return {};
        });
      },
      restart: () => {
        set((state) => {
          if (state.phase === "playing" || state.phase === "ended")
            return { phase: "ready", blockSeed: Math.random() };

          return {};
        });
      },
      setPlayerName: (name: string) => {
        set(() => ({ playerName: name }));
      },
      end: () => {
        set((state) => {
          if (state.phase === "playing")
            return { phase: "ended", endTime: Date.now() };

          return {};
        });
      },
    };
  }),
);

export default useGame;
