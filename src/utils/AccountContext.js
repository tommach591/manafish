import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createBalance, getBalance, updateBalance } from "./Balance";

const ManaContext = createContext();
export function useMana() {
  return useContext(ManaContext);
}

export function IncomeProvider({ children }) {
  // localStorage.clear();

  const TICK_RATE = 1000;
  const REGEN_RATE = 14000; // subtract 1000

  const [userID, setUserID] = useState(() => {
    const savedUserID = localStorage.getItem("userID");
    return savedUserID ? JSON.parse(savedUserID) : "";
  });

  const handleLogin = useCallback((id) => {
    localStorage.setItem("userID", JSON.stringify(id));
    setUserID(id);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.setItem("userID", JSON.stringify(""));
    setUserID("");
  }, []);

  const [mana, setMana] = useState(0);
  const [storedMana, setStoredMana] = useState(0);
  const [maxStoredMana, setMaxStoredMana] = useState(480);
  const [lastManaInterval, setLastManaInterval] = useState(new Date());
  const [nextManaInterval, setNextManaInterval] = useState(new Date());

  const retrieveStoredMana = useCallback(() => {
    const updateFields = {};
    updateFields.mana = mana + storedMana;
    updateFields.storedMana = 0;

    setMana(updateFields.mana);
    setStoredMana(0);
    updateBalance(userID, updateFields);
  }, [userID, mana, storedMana]);

  useEffect(() => {
    if (!userID) return;
    else {
      getBalance(userID).then((res) => {
        if (res) {
          setMana(res.mana);
          setStoredMana(res.storedMana);
          setMaxStoredMana(res.maxStoredMana);
          setLastManaInterval(new Date(res.lastManaInterval));
          setNextManaInterval(new Date(res.nextManaInterval));
        } else {
          createBalance(userID);
          setMana(50);
          setStoredMana(0);
          setMaxStoredMana(480);
          setLastManaInterval(new Date());
          setNextManaInterval(new Date());
        }
      });
    }
  }, [userID]);

  useEffect(() => {
    if (!userID) return;
    const manaRegenInterval = setInterval(() => {
      const updateFields = {};
      const now = new Date();
      const timeElapsed = nextManaInterval - lastManaInterval;
      if (storedMana >= maxStoredMana) {
        now.setTime(now.getTime() + REGEN_RATE);
        setNextManaInterval(new Date(now.getTime()));
        updateFields.nextManaInterval = now;
      } else if (timeElapsed < 0) {
        const newStoredMana =
          storedMana + Math.abs(Math.floor(timeElapsed / (REGEN_RATE + 1000)));
        setStoredMana(newStoredMana);
        updateFields.storedMana = newStoredMana;

        now.setTime(now.getTime() + REGEN_RATE);
        setNextManaInterval(new Date(now.getTime()));
        updateFields.nextManaInterval = now;
      }

      setLastManaInterval(new Date());
      updateFields.lastManaInterval = new Date();
      updateBalance(userID, updateFields);
    }, TICK_RATE - (new Date() % TICK_RATE));

    return () => clearInterval(manaRegenInterval);
  }, [userID, lastManaInterval, maxStoredMana, nextManaInterval, storedMana]);

  return (
    <ManaContext.Provider
      value={{
        userID,
        handleLogin,
        handleLogout,
        mana,
        retrieveStoredMana,
        storedMana,
        maxStoredMana,
        setMaxStoredMana,
        lastManaInterval,
        nextManaInterval,
      }}
    >
      {children}
    </ManaContext.Provider>
  );
}
