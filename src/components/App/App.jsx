import { useEffect, useState } from "react";
import "./App.css";

function App() {
  localStorage.clear();

  const TICK_RATE = 1000;
  const REGEN_RATE = 14000; // subtract 1000

  const [mana, setMana] = useState(() => {
    const savedMana = localStorage.getItem("mana");
    return savedMana ? JSON.parse(savedMana) : 0;
  });

  const [storedMana, setStoredMana] = useState(() => {
    const savedStoredMana = localStorage.getItem("storedMana");
    return savedStoredMana ? JSON.parse(savedStoredMana) : 0;
  });

  const [maxStoredMana, setMaxStoredMana] = useState(() => {
    const savedMaxStoredMana = localStorage.getItem("maxStoredMana");
    return savedMaxStoredMana ? JSON.parse(savedMaxStoredMana) : 480;
  });

  const [lastManaInterval, setLastManaInterval] = useState(() => {
    const savedLastManaInterval = localStorage.getItem("lastManaInterval");
    return savedLastManaInterval
      ? new Date(JSON.parse(savedLastManaInterval))
      : new Date();
  });

  const [nextManaInterval, setNextManaInterval] = useState(() => {
    const savedNextManaInterval = localStorage.getItem("nextManaInterval");
    return savedNextManaInterval
      ? new Date(JSON.parse(savedNextManaInterval))
      : new Date();
  });

  useEffect(() => {
    const manaRegenInterval = setInterval(() => {
      const now = new Date();
      const timeElapsed = nextManaInterval - lastManaInterval;
      if (storedMana >= maxStoredMana) {
        now.setTime(now.getTime() + REGEN_RATE);
        localStorage.setItem("nextManaInterval", JSON.stringify(now));
        setNextManaInterval(new Date(now.getTime()));
      } else if (timeElapsed < 0) {
        setStoredMana((prevStoredMana) => {
          const newStoredMana =
            prevStoredMana +
            Math.abs(Math.floor(timeElapsed / (REGEN_RATE + 1000)));
          localStorage.setItem("storedMana", JSON.stringify(newStoredMana));
          return newStoredMana;
        });
        now.setTime(now.getTime() + REGEN_RATE);
        localStorage.setItem("nextManaInterval", JSON.stringify(now));
        setNextManaInterval(new Date(now.getTime()));
      }

      setLastManaInterval(new Date());
    }, TICK_RATE - (new Date() % TICK_RATE));

    return () => clearInterval(manaRegenInterval);
  }, [lastManaInterval, maxStoredMana, nextManaInterval, storedMana]);

  return (
    <div className="App">
      <h1>{`Mana: ${mana}`}</h1>
      <h1>{`Stored Mana: ${storedMana}/${maxStoredMana}`}</h1>
      <p>{`Last Increment: ${lastManaInterval.toLocaleTimeString()}`}</p>
      <p>
        {`Next Increment:
        ${Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1}s`}
      </p>
      <button
        onClick={() => {
          setMana((prevMana) => prevMana + storedMana);
          setStoredMana(0);
        }}
      >
        Click Me
      </button>
    </div>
  );
}

export default App;

