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
      <button onClick={retrieveStoredMana}>Claim Stored Mana</button>
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
      <button
        onClick={() => {
          handleFishLogout();
          handleBalanceLogout();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
