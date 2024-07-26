/* eslint-disable no-unused-vars */
import "./Home.css";
import { useMana } from "../../utils/AccountContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const {
    userID,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    nextManaInterval,
    retrieveStoredMana,
  } = useMana();
  const TICK_RATE = 1000;

  useEffect(() => {
    if (!userID) {
      navigate("/login");
    }
  }, [userID, navigate]);

  return (
    <div className="Home">
      <div className="Mana">
        <h1>{`Mana: ${mana}`}</h1>
      </div>
      <div className="StoredMana">
        <h1>{`Stored Mana: ${storedMana}/${maxStoredMana}`}</h1>
        <h1>
          {`Next Increment:
        ${Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1}s`}
        </h1>
      </div>

      <button className="ClaimMana" onClick={retrieveStoredMana}>
        Claim Stored Mana
      </button>
    </div>
  );
}

export default Home;
