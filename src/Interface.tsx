import { useEffect, useRef } from "react";
import useGame from "./stores/useGame.ts";
import { useKeyboardControls } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";

const Interface = () => {
  const time = useRef<HTMLDivElement | null>(null);

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  const simulateKey = (code: string, type: "keydown" | "keyup") => {
    const event = new KeyboardEvent(type, { code, key: code });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      // console.log("tick");
      const state = useGame.getState();
      // console.log(state);

      let elapsedTime = 0;

      if (state.phase === "playing") elapsedTime = Date.now() - state.startTime;
      else if (state.phase === "ended")
        elapsedTime = state.endTime - state.startTime;

      elapsedTime /= 1000;
      let stringTime = elapsedTime.toFixed(2);
      // console.log(elapsedTime);

      if (time.current) {
        time.current.textContent = stringTime;
      }
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      <div ref={time} className="time">
        0.00
      </div>

      {phase === "ended" && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}

      <div className="controls">
        <div className="key-wrapper">
          <div className="raw">
            <div
              className={`key ${forward ? "active" : ""}`}
              onPointerDown={() => simulateKey("ArrowUp", "keydown")}
              onPointerUp={() => simulateKey("ArrowUp", "keyup")}
              onPointerLeave={() => simulateKey("ArrowUp", "keyup")}
              onContextMenu={(e) => e.preventDefault()}
            >
              <ArrowUpIcon size="100%" color={forward ? "red" : undefined} />
            </div>
          </div>
          <div className="raw">
            <div
              className={`key ${leftward ? "active" : ""}`}
              onPointerDown={() => simulateKey("ArrowLeft", "keydown")}
              onPointerUp={() => simulateKey("ArrowLeft", "keyup")}
              onPointerLeave={() => simulateKey("ArrowLeft", "keyup")}
              onContextMenu={(e) => e.preventDefault()}
            >
              <ArrowLeftIcon size="100%" color={leftward ? "red" : undefined} />
            </div>
            <div
              className={`key ${backward ? "active" : ""}`}
              onPointerDown={() => simulateKey("ArrowDown", "keydown")}
              onPointerUp={() => simulateKey("ArrowDown", "keyup")}
              onPointerLeave={() => simulateKey("ArrowDown", "keyup")}
              onContextMenu={(e) => e.preventDefault()}
            >
              <ArrowDownIcon size="100%" color={backward ? "red" : undefined} />
            </div>
            <div
              className={`key ${rightward ? "active" : ""}`}
              onPointerDown={() => simulateKey("ArrowRight", "keydown")}
              onPointerUp={() => simulateKey("ArrowRight", "keyup")}
              onPointerLeave={() => simulateKey("ArrowRight", "keyup")}
              onContextMenu={(e) => e.preventDefault()}
            >
              <ArrowRightIcon
                size="100%"
                color={rightward ? "red" : undefined}
              />
            </div>
          </div>
          <div className="raw">
            <div
              className={`key ${jump ? "active" : ""} large`}
              onPointerDown={() => simulateKey("Space", "keydown")}
              onPointerUp={() => simulateKey("Space", "keyup")}
              onPointerLeave={() => simulateKey("Space", "keyup")}
              onContextMenu={(e) => e.preventDefault()}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
