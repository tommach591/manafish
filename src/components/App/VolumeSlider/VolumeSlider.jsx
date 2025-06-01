import { useEffect, useRef } from "react";
import { useUtil } from "../../../utils/UtilContext";
import "./VolumeSlider.css";
import bgm from "../../../assets/audio/aivyWanderOST.mp3";

function VolumeSlider() {
    const {volume, setVolume} = useUtil();
    const bgmAudioRef = useRef(null);

    const handleChange = (event) => {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
    };

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
        <img src="https://api.iconify.design/material-symbols:volume-up-rounded.svg" alt=""/>
        <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleChange}
            className="w-32"
        />
    </div>);
}

export default VolumeSlider;