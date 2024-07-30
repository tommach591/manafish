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
    const savedUserID = JSON.stringify(localStorage.getItem("userID"));
    return savedUserID ? JSON.parse(savedUserID) : "";
  });

  const initializeState = useCallback((id, key, defaultValue) => {
    const savedState = localStorage.getItem(id);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return parsedState[key] !== undefined ? parsedState[key] : defaultValue;
    }
    return defaultValue;
  }, []);

  const [mana, setMana] = useState(() => initializeState(userID, "mana", 0));
  const [storedMana, setStoredMana] = useState(() =>
    initializeState(userID, "storedMana", 0)
  );
  const [maxStoredMana, setMaxStoredMana] = useState(() =>
    initializeState(userID, "maxStoredMana", 480)
  );
  const [lastManaInterval, setLastManaInterval] = useState(
    () => new Date(initializeState(userID, "lastManaInterval", new Date()))
  );
  const [nextManaInterval, setNextManaInterval] = useState(
    () => new Date(initializeState(userID, "nextManaInterval", new Date()))
  );

  const updateMana = useCallback((val) => {
    setMana((prev) => prev + val);
  }, []);

  const retrieveStoredMana = useCallback(() => {
    setMana((prev) => prev + storedMana);
    setStoredMana(0);
  }, [storedMana]);

  const updateServerMana = useCallback(() => {
    const updateFields = JSON.parse(localStorage.getItem(userID));
    if (userID) updateBalance(userID, updateFields);
  }, [userID]);

  const handleLogin = useCallback(
    (id) => {
      setMana(initializeState(id, "mana", 0));
      setStoredMana(initializeState(id, "storedMana", 0));
      setMaxStoredMana(initializeState(id, "maxStoredMana", 480));
      setLastManaInterval(
        new Date(initializeState(id, "lastManaInterval", new Date()))
      );
      setNextManaInterval(
        new Date(initializeState(id, "nextManaInterval", new Date()))
      );
      setUserID(id);
      localStorage.setItem("userID", id);
    },
    [initializeState]
  );

  const handleLogout = useCallback(() => {
    const updateFields = {
      mana: mana,
      storedMana: storedMana,
      maxStoredMana: maxStoredMana,
      lastManaInterval: lastManaInterval,
      nextManaInterval: nextManaInterval,
    };
    localStorage.setItem(userID, JSON.stringify(updateFields));
    updateServerMana();

    localStorage.setItem("userID", "");
    setUserID("");
  }, [
    userID,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    nextManaInterval,
    updateServerMana,
  ]);

  // Save Locally.
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const updateFields = {
        mana: mana,
        storedMana: storedMana,
        maxStoredMana: maxStoredMana,
        lastManaInterval: lastManaInterval,
        nextManaInterval: nextManaInterval,
      };
      localStorage.setItem(userID, JSON.stringify(updateFields));
    }, 1000);

    return () => clearInterval(saveInterval);
  }, [
    userID,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    nextManaInterval,
  ]);

  // Save to Server
  useEffect(() => {
    const saveInterval = setInterval(() => {
      updateServerMana();
    }, 1000 * 60 * 30);

    return () => {
      clearInterval(saveInterval);
    };
  }, [updateServerMana]);

  useEffect(() => {
    if (!userID) return;
    else {
      getBalance(userID).then((res) => {
        if (res) {
          if (!localStorage.getItem(userID)) {
            console.log("Loading server data...");
            setMana(res.mana);
            setStoredMana(res.storedMana);
            setMaxStoredMana(res.maxStoredMana);
            setLastManaInterval(new Date(res.lastManaInterval));
            setNextManaInterval(new Date(res.nextManaInterval));

            const updateFields = {
              mana: res.mana,
              storedMana: res.storedMana,
              maxStoredMana: res.maxStoredMana,
              lastManaInterval: new Date(res.lastManaInterval),
              nextManaInterval: new Date(res.nextManaInterval),
            };
            localStorage.setItem(userID, JSON.stringify(updateFields));
          } else {
            console.log("Using local data...");
          }
        } else {
          createBalance(userID);

          setMana(50);
          setStoredMana(0);
          setMaxStoredMana(480);
          setLastManaInterval(new Date());
          setNextManaInterval(new Date());

          const updateFields = {
            mana: 50,
            storedMana: 0,
            maxStoredMana: 480,
            lastManaInterval: new Date(),
            nextManaInterval: new Date(),
          };
          localStorage.setItem(userID, JSON.stringify(updateFields));
        }
      });
    }
  }, [userID]);

  useEffect(() => {
    if (!userID) return;

    const manaRegenInterval = setInterval(() => {
      const now = new Date();
      const timeElapsed = nextManaInterval - lastManaInterval;
      if (storedMana >= maxStoredMana) {
        now.setTime(now.getTime() + REGEN_RATE);
        setNextManaInterval(new Date(now.getTime()));
      } else if (timeElapsed < 0) {
        const newStoredMana =
          storedMana + Math.abs(Math.floor(timeElapsed / (REGEN_RATE + 1000))) >
          maxStoredMana
            ? maxStoredMana
            : storedMana +
              Math.abs(Math.floor(timeElapsed / (REGEN_RATE + 1000)));
        setStoredMana(newStoredMana);

        now.setTime(now.getTime() + REGEN_RATE);
        setNextManaInterval(new Date(now.getTime()));
      }

      setLastManaInterval(new Date());
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
        updateMana: updateMana,
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
