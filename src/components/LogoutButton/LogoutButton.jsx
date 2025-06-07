import { useFish } from "../../utils/FishContext";
import { useMana } from "../../utils/ManaContext";
import { useUtil } from "../../utils/UtilContext";
import "./LogoutButton.css";

function LogoutButton() {
    const { userID, handleBalanceLogout } = useMana();
    const { handleFishLogout } = useFish();
    const { playAudio } = useUtil();

    return (
    <button
        className="LogoutButton"
        onClick={async () => {
            await handleFishLogout();
            await handleBalanceLogout();
            localStorage.removeItem(userID);
        }}
        onMouseEnter={() => playAudio("bubble")}
    >
        <div className="BubbleReflection" />
        Save & Logout
    </button>)
}

export default LogoutButton;