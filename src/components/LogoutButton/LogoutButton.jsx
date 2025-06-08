import { useMana } from "../../utils/ManaContext";
import { useAudio } from "../../utils/AudioContext";
import "./LogoutButton.css";

function LogoutButton() {
  const { userID, handleBalanceLogout } = useMana();
  const { playAudio } = useAudio();

  return (
    <button
      className="LogoutButton"
      onClick={() => {
        handleBalanceLogout();
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
