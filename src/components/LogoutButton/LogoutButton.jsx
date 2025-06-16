import { useMana } from "../../utils/ManaContext";
import { useAudio } from "../../utils/AudioContext";
import "./LogoutButton.css";
import { useSocket } from "../../utils/SocketContext";

function LogoutButton() {
  const { userID, handleBalanceLogout } = useMana();
  const { setRoom } = useSocket();
  const { playAudio } = useAudio();

  return (
    <button
      className="LogoutButton"
      onClick={() => {
        handleBalanceLogout();
        setRoom("");
        localStorage.removeItem(userID);
      }}
      onMouseEnter={() => playAudio("bubble")}
    >
      <div className="BubbleReflection" />
      Save & Logout
    </button>
  );
}

export default LogoutButton;
