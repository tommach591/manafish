import { useFish } from "../../utils/FishContext";
import { useMana } from "../../utils/ManaContext";
import "./LogoutButton.css";

function LogoutButton() {
    const { userID, handleBalanceLogout } = useMana();
    const { handleFishLogout } = useFish();

    return (
    <button
        className="LogoutButton"
        onClick={async () => {
            await handleFishLogout();
            await handleBalanceLogout();
            localStorage.removeItem(userID);
            const timeout = setTimeout(() => {
                window.location.reload(true); 
            }, 300);
            return () => {
                clearTimeout(timeout);
            }
        }}
    >
        <div className="BubbleReflection" />
        Save & Logout
    </button>)
}

export default LogoutButton;