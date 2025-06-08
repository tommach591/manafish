import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import bubbleMP3 from "../assets/audio/bubble.mp3";
import slotMP3 from "../assets/audio/slot.mp3";
import coinMP3 from "../assets/audio/coin.mp3";
import yippeeMP3 from "../assets/audio/yippee.mp3";
import amazingMP3 from "../assets/audio/amazing.mp3";
import greatMP3 from "../assets/audio/great.mp3";
import luckyMP3 from "../assets/audio/lucky.mp3";
import niceCatchMP3 from "../assets/audio/niceCatch.mp3";
import niceHitMP3 from "../assets/audio/niceHit.mp3";
import ohMyGoshMP3 from "../assets/audio/ohMyGosh.mp3";
import uhohMP3 from "../assets/audio/uhoh.mp3";
import wooowMP3 from "../assets/audio/wooow.mp3";
import wowMP3 from "../assets/audio/wow.mp3";
import yayMP3 from "../assets/audio/yay.mp3";

const AudioContext = createContext();
export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem("bgmVolume");
    return stored !== null ? parseFloat(stored) : 0.1;
  });

  const [notif, setNotif] = useState(() => {
    const stored = localStorage.getItem("notifOn");
    return stored !== null ? stored === "true" : true;
  });

  const playAudio = useCallback(
    (audioChoice) => {
      if (notif) {
        const voiceVolume = 0.2;
        const soundMP3 = {
          bubble: [bubbleMP3, 0.025],
          slots: [slotMP3, 0.5],
          coin: [coinMP3, 0.25],
          yippee: [yippeeMP3, 0.1],
          amazing: [amazingMP3, voiceVolume],
          great: [greatMP3, voiceVolume],
          lucky: [luckyMP3, voiceVolume],
          niceCatch: [niceCatchMP3, voiceVolume],
          niceHit: [niceHitMP3, voiceVolume],
          ohMyGosh: [ohMyGoshMP3, voiceVolume],
          uhoh: [uhohMP3, voiceVolume],
          wooow: [wooowMP3, voiceVolume],
          wow: [wowMP3, voiceVolume],
          yay: [yayMP3, voiceVolume],
        };
        const soundToPlay = new Audio(soundMP3[audioChoice][0]);
        soundToPlay.volume = soundMP3[audioChoice][1];
        soundToPlay.play();

        return () => {
          soundToPlay.pause();
          soundToPlay.currentTime = 0;
        };
      }
    },
    [notif]
  );

  useEffect(() => {
    localStorage.setItem("bgmVolume", volume);
    localStorage.setItem("notifOn", notif);
  }, [volume, notif]);

  return (
    <AudioContext.Provider
      value={{
        volume,
        setVolume,
        notif,
        setNotif,
        playAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
