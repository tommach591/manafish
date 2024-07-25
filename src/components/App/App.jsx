/* eslint-disable no-unused-vars */
import "./App.css";
import { useMana } from "../../utils/IncomeContext";
import { useState } from "react";
import { createAccount, getAllAccount } from "../../utils/Account";

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

  const [id, setID] = useState("");
  const [pw, setPW] = useState("");

  return (
    <div className="App">
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

      <div className="Credentials">
        <input
          type="text"
          value={id}
          onChange={(event) => setID(event.currentTarget.value)}
        />
        <input
          type="text"
          value={pw}
          onChange={(event) => setPW(event.currentTarget.value)}
        />
        <button
          onClick={() => {
            if (id && pw) createAccount(id, pw);
          }}
        >
          Create Account
        </button>
        <button
          onClick={() => {
            getAllAccount().then((res) => {
              console.log(res);
            });
          }}
        >
          Print Account
        </button>
      </div>
    </div>
  );
}

export default App;

