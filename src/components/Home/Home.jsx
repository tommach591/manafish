import "./Home.css";
import { useMana } from "../../utils/ManaContext";
import { useNavigate } from "react-router-dom";
import { useFish } from "../../utils/FishContext";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const { storedMana, handleBalanceLogout, retrieveStoredMana } = useMana();
  const { handleFishLogout } = useFish();
  const [claimedMana, setClaimedMana] = useState(0);

  return (
    <div className="Home">
      <button
        className="LogoutButton"
        onClick={() => {
          handleFishLogout();
          handleBalanceLogout();
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
          className="StoredManaPopup"
          style={
            claimedMana !== 0
              ? {
                  animation: "claimStoredMana 1.5s forwards ease-in-out 1",
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
          Shop
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
          Fishing
        </button>
      </div>
    </div>
  );
}

export default Home;
