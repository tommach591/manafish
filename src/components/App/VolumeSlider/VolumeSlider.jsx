import { useEffect, useRef } from "react";
import { useUtil } from "../../../utils/UtilContext";
import "./VolumeSlider.css";
import bgm from "../../../assets/audio/aivyWanderOST.mp3";

function VolumeSlider() {
    const {volume, setVolume, notif, setNotif} = useUtil();
    const bgmAudioRef = useRef(null);

    const handleChange = (event) => {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
    };

    useEffect(() => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.volume = volume;
        bgmAudioRef.current.muted = volume === 0;
      }

    }, [volume])

    useEffect(() => {
      // Clean up existing audio if present
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current.currentTime = 0;
        bgmAudioRef.current.removeAttribute("src"); // optional: unload the audio
        bgmAudioRef.current.load(); // release the resource
      }
    
      // Create new audio
      bgmAudioRef.current = new Audio(bgm);
      bgmAudioRef.current.volume = volume;
    
      // Loop when audio ends
      const handleEnded = () => {
        bgmAudioRef.current.currentTime = 0;
        bgmAudioRef.current.play();
      };
      bgmAudioRef.current.addEventListener("ended", handleEnded);
    
      // Play on first user interaction
      const onClick = () => {
        bgmAudioRef.current.play();
        window.removeEventListener("click", onClick);
      };
      window.addEventListener("click", onClick);
    
      return () => {
        window.removeEventListener("click", onClick);
        if (bgmAudioRef.current) {
          bgmAudioRef.current.pause();
          bgmAudioRef.current.removeEventListener("ended", handleEnded);
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="VolumeSlider">
        <img src={notif ? 
            "https://api.iconify.design/material-symbols:notifications-active-rounded.svg" :
           "https://api.iconify.design/material-symbols:notifications-off-rounded.svg"} alt=""
           className="NotificationsIcon"
           onClick={() => setNotif(prev => !prev)}
        />
        <img src={bgmAudioRef.current?.muted ? 
            "https://api.iconify.design/fluent:music-note-off-2-20-filled.svg" :
           "https://api.iconify.design/ion:musical-notes.svg"} alt=""
           className="BGMIcon"/>
        <input
          type="range"
          min="0"
          max="0.2"
          step="0.001"
          value={volume}
          onChange={handleChange}
          className="w-32"
        />
      </div>
    );
}

export default VolumeSlider;