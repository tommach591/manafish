import "./Home.css";
import { useMana } from "../../utils/ManaContext";
import { useNavigate } from "react-router-dom";
import { useFish } from "../../utils/FishContext";
import { useState } from "react";
// import { useGarden } from "../../utils/GardenContext";

function Home() {
  const navigate = useNavigate();
  const { storedMana, handleBalanceLogout, retrieveStoredMana } = useMana();
  const { handleFishLogout } = useFish();
  // const { isAnyPlantFullyGrown } = useGarden();
  const [claimedMana, setClaimedMana] = useState(0);

  return (
    <div className="Home">
      <button
        className="LogoutButton"
        onClick={() => {
          handleFishLogout();
          handleBalanceLogout();
          localStorage.clear();
        }}
      >
        <div className="BubbleReflection" />
        Logout
      </button>
      <button
        className="ClaimButton"
        onClick={() => {
          const oldStoredMana = storedMana;
          setClaimedMana(oldStoredMana);
          retrieveStoredMana();
        }}
      >
        <div className="BubbleReflection" />
        <h1
          className="TextPopUp"
          style={
            claimedMana !== 0
              ? {
                  animation: "textPopUp 1.5s forwards ease-in-out 1",
                }
              : {}
          }
          onAnimationEnd={() => setClaimedMana(0)}
        >
          +{claimedMana}
        </h1>
        Claim Mana
      </button>
      <div className="NavigationButtons">
        <button
          onClick={() => {
            navigate("/shop");
          }}
        >
          <div className="BubbleReflection" />
          Aivy's Shop
        </button>
        <button
          onClick={() => {
            navigate("/leaderboard");
          }}
        >
          <div className="BubbleReflection" />
          Hall of Legends
        </button>
        <button
          onClick={() => {
            navigate("/arcade");
          }}
        >
          <div className="BubbleReflection" />
          Arcade
        </button>
        <button
          onClick={() => {
            navigate("/fishing");
          }}
        >
          <div className="BubbleReflection" />
          Mana's Beach
        </button>        
      </div>
    </div>
  );
}

export default Home;
