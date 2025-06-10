import { useEffect, useState } from "react";
import "./ManaBubble.css";
import manaDumbImg from "../../../assets/miscImage/manaDumb.png";
import { useAudio } from "../../../utils/AudioContext";
import { useMana } from "../../../utils/ManaContext";

function ManaBubble() {
  const [bonusMana, setBonusMana] = useState(
    Math.floor(Math.random() * 91) + 10
  );
  const { updateMana, isManaBubbleOn, setIsManaBubbleOn } = useMana();
  const { playAudio } = useAudio();
  const [x, setX] = useState(window.innerWidth / 2);
  const [y, setY] = useState(window.innerHeight / 2);

  // Velocity: how many pixels per step in x and y direction
  const [vx, setVx] = useState(() => Math.random() * 2 - 1); // -1 to 1
  const [vy, setVy] = useState(() => Math.random() * 2 - 1);
  const VELOCITY = 2;

  const [isPlayPopup, setIsPlayPopup] = useState(false);
  const [animationLocked, setAnimationLocked] = useState(false);

  useEffect(() => {
    if (isManaBubbleOn) setBonusMana(Math.floor(Math.random() * 91) + 10);
  }, [isManaBubbleOn]);

  useEffect(() => {
    const padding = 56;

    const interval = setInterval(() => {
      setX((prevX) => {
        const nextX = prevX + vx * VELOCITY;
        if (nextX < 0 || nextX > window.innerWidth - padding) {
          setVx((v) => -v); // bounce
          return Math.max(0, Math.min(window.innerWidth - padding, nextX));
        }
        return nextX;
      });

      setY((prevY) => {
        const nextY = prevY + vy * VELOCITY;
        if (nextY < 0 || nextY > window.innerHeight - padding) {
          setVy((v) => -v); // bounce
          return Math.max(0, Math.min(window.innerHeight - padding, nextY));
        }
        return nextY;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [vx, vy]);

  return (
    <button
      className={`ManaBubble ${
        (isManaBubbleOn || isPlayPopup) && !animationLocked
          ? "ShowBubble"
          : "HideBubble"
      }`}
      onClick={() => {
        updateMana(bonusMana);
        setIsPlayPopup(true);
        setAnimationLocked(true);
      }}
      onMouseEnter={() => {
        playAudio("bubble");
      }}
      style={
        !isManaBubbleOn && !isPlayPopup
          ? {
              animation: "none",
              opacity: 0,
            }
          : {
              left: `${x}px`,
              top: `${y}px`,
            }
      }
      disabled={!isManaBubbleOn}
    >
      <div className="BubbleReflection" />
      <h1
        className="TextPopUp"
        style={
          isPlayPopup
            ? {
                animation: "textPopUp 1.5s forwards ease-in-out 1",
              }
            : {}
        }
        onAnimationEnd={() => {
          setIsPlayPopup(false);
          setIsManaBubbleOn(false);
          setAnimationLocked(false);
        }}
      >
        +{bonusMana}
      </h1>
      <img src={manaDumbImg} alt="" />
    </button>
  );
}

export default ManaBubble;
