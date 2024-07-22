import "./App.css";
import { useMana } from "../../utils/IncomeContext";

function App() {
  const {
    mana,
    storedMana,
    maxStoredMana,
    setMaxStoredMana,
    lastManaInterval,
    nextManaInterval,
    retrieveStoredMana,
  } = useMana();
  const TICK_RATE = 1000;

  return (
    <div className="App">
      <h1>{`Mana: ${mana}`}</h1>
      <h1>{`Stored Mana: ${storedMana}/${maxStoredMana}`}</h1>
      <p>{`Last Increment: ${lastManaInterval.toLocaleTimeString()}`}</p>
      <p>
        {`Next Increment:
        ${Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1}s`}
      </p>
      <button onClick={retrieveStoredMana}>Click Me</button>
      <br />
      <input
        type="number"
        value={maxStoredMana}
        onChange={(event) => setMaxStoredMana(event.target.value)}
      />
    </div>
  );
}

export default App;

