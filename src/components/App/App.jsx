import "./App.css";
import {
  useLastManaInterval,
  useMana,
  useMaxStoredMana,
  useNextManaInterval,
  useRetrieveStoredMana,
  useStoredMana,
} from "../../utils/IncomeContext";

function App() {
  const mana = useMana();
  const storedMana = useStoredMana();
  const maxStoredMana = useMaxStoredMana();
  const lastManaInterval = useLastManaInterval();
  const nextManaInterval = useNextManaInterval();
  const retrieveStoredMana = useRetrieveStoredMana();
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
    </div>
  );
}

export default App;

