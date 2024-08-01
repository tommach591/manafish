import "./Home.css";
import { useMana } from "../../utils/ManaContext";
import { useNavigate } from "react-router-dom";
import { getAllBalance } from "../../utils/Balance";

function Home() {
  const navigate = useNavigate();
  const {
    handleLogout,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    nextManaInterval,
    retrieveStoredMana,
  } = useMana();
  const TICK_RATE = 1000;

  return (
    <div className="Home">
      <div className="StoredMana">
        <h1>{`Stored Mana: ${storedMana}/${maxStoredMana}`}</h1>
        <h1>
          {`Next Increment:
        ${
          Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1 < 0
            ? 15
            : Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1
        }s`}
        </h1>
      </div>
      <button onClick={retrieveStoredMana}>Claim Stored Mana</button>
      <button onClick={handleLogout}>Logout</button>
      <button
        onClick={() => {
          getAllBalance().then((res) => console.log(res));
        }}
      >
        Print Balances
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
          navigate("/arcade");
        }}
      >
        Arcade
      </button>
    </div>
  );
}

export default Home;
