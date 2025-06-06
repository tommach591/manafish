import { useNavigate } from "react-router-dom";
import "./HomeButton.css";

function HomeButton() {
    const navigate = useNavigate();

    return (
    <button
        className="HomeButton"
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="BubbleReflection" />
        <img
          src="https://api.iconify.design/ic:round-home.svg?color=%2332323c"
          alt=""
        />
    </button>)
}

export default HomeButton;