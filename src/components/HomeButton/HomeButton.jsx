import { useNavigate } from "react-router-dom";
import "./HomeButton.css";
import { useUtil } from "../../utils/UtilContext";

function HomeButton() {
    const navigate = useNavigate();
    const { playAudio } = useUtil(); 

    return (
    <button
        className="HomeButton"
        onClick={() => {
          navigate("/");
        }}
        onMouseEnter={() => playAudio("bubble")}
      >
        <div className="BubbleReflection" />
        <img
          src="https://api.iconify.design/ic:round-home.svg?color=%2332323c"
          alt=""
        />
    </button>)
}

export default HomeButton;