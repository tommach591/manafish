import "./Home.css";
import { useMana } from "../../utils/ManaContext";
import { useNavigate } from "react-router-dom";
import { useFish } from "../../utils/FishContext";

function Home() {
  const navigate = useNavigate();
  const { handleBalanceLogout, retrieveStoredMana } = useMana();
  const { handleFishLogout } = useFish();

  return (
    <div className="Home">
      <button
        className="LogoutButton"
        onClick={() => {
          handleFishLogout();
          handleBalanceLogout();
        }}
      >
        Logout
      </button>
      <button onClick={retrieveStoredMana}>Claim Stored Mana</button>
      <div className="NavigationButtons">
        <button
          onClick={() => {
            navigate("/shop");
          }}
        >
          Shop
        </button>
        <button
          onClick={() => {
            navigate("/arcade");
          }}
        >
          Arcade
        </button>
        <button
          onClick={() => {
            navigate("/fishing");
          }}
        >
          Fishing
        </button>
      </div>
    </div>
  );
}

export default Home;
