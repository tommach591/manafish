import { useNavigate } from "react-router-dom";
import "./Garden.css";

function Garden() {
  const navigate = useNavigate();

  return (
    <div className="Garden">
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
      </button>
    </div>
  );
}

export default Garden;
