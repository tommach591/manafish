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

export function ManaProvider({ children }) {
  const TICK_RATE = 1000;
  const REGEN_RATE = 30000 - 1000;

  const [userID, setUserID] = useState(() => {
    const savedUserID = JSON.stringify(localStorage.getItem("userID"));
    return savedUserID ? JSON.parse(savedUserID) : "";
  });

  const [username, setUsername] = useState(() => {
    const savedUsername = JSON.stringify(localStorage.getItem("username"));
    return savedUsername ? JSON.parse(savedUsername) : "";
  });

  const initializeState = useCallback((id, key, defaultValue) => {
    const savedState = localStorage.getItem(id);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState["balance"])
        return parsedState["balance"][key] !== undefined
          ? parsedState["balance"][key]
          : defaultValue;
      else return defaultValue;
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
  const [currentProfileIcon, setCurrentProfileIcon] = useState(() =>
    initializeState(userID, "currentProfileIcon", 0)
  );
  const [profileIcons, setProfileIcons] = useState(() =>
    initializeState(userID, "profileIcons", [0])
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
    if (userID) updateBalance(userID, updateFields.balance);
  }, [userID]);

  const handleBalanceLogin = useCallback(
    (id, username) => {
      setMana(initializeState(id, "mana", 0));
      setStoredMana(initializeState(id, "storedMana", 0));
      setMaxStoredMana(initializeState(id, "maxStoredMana", 480));
      setLastManaInterval(
        new Date(initializeState(id, "lastManaInterval", new Date()))
      );
      setNextManaInterval(
        new Date(initializeState(id, "nextManaInterval", new Date()))
      );
      setCurrentProfileIcon(initializeState(id, "currentProfileIcon", 0));
      setProfileIcons(initializeState(id, "profileIcons", [0]));

      setUserID(id);
      setUsername(username);
      localStorage.setItem("userID", id);
      localStorage.setItem("username", username);
    },
    [initializeState]
  );

  const handleBalanceLogout = useCallback(() => {
    const updateFields = {
      balance: {
        mana: mana,
        storedMana: storedMana,
        maxStoredMana: maxStoredMana,
        lastManaInterval: lastManaInterval,
        nextManaInterval: nextManaInterval,
        currentProfileIcon: currentProfileIcon,
        profileIcons: profileIcons,
      },
    };
    const existingData = JSON.parse(localStorage.getItem(userID)) || {};

    const mergedData = {
      ...existingData,
      balance: {
        ...updateFields.balance,
      },
    };
    localStorage.setItem(userID, JSON.stringify(mergedData));
    updateServerMana();
    
    localStorage.removeItem("userID");
    localStorage.removeItem("username");

    setUsername("");
    setUserID("");
  }, [
    userID,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    nextManaInterval,
    currentProfileIcon,
    profileIcons,
    updateServerMana,
  ]);

  // Save Locally.
  useEffect(() => {
    if (!userID) return; 
    const saveInterval = setInterval(() => {
      const updateFields = {
        balance: {
          mana: mana,
          storedMana: storedMana,
          maxStoredMana: maxStoredMana,
          lastManaInterval: lastManaInterval,
          nextManaInterval: nextManaInterval,
          currentProfileIcon: currentProfileIcon,
          profileIcons: profileIcons,
        },
      };
      const existingData = JSON.parse(localStorage.getItem(userID)) || {};

      const mergedData = {
        ...existingData,
        balance: {
          ...existingData.balance,
          ...updateFields.balance,
        },
      };

      localStorage.setItem(userID, JSON.stringify(mergedData));
    }, 1000);

    return () => clearInterval(saveInterval);
  }, [
    userID,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    nextManaInterval,
    currentProfileIcon,
    profileIcons,
  ]);

  // Save to Server
  useEffect(() => {
    if (!userID) return;
    const saveInterval = setInterval(() => {
      updateServerMana();
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(saveInterval);
    };
  }, [updateServerMana, userID]);

  useEffect(() => {
    if (!userID) return;
    else {
      getBalance(userID).then((res) => {
        if (res) {
          const savedData = localStorage.getItem(userID)
            ? JSON.parse(localStorage.getItem(userID))
            : null;
          if (!savedData?.balance) {
            console.log("Loading server balance data...");
            setMana(res.mana);
            setStoredMana(res.storedMana);
            setMaxStoredMana(res.maxStoredMana);
            setLastManaInterval(new Date(res.lastManaInterval));
            setNextManaInterval(new Date(res.nextManaInterval));
            setCurrentProfileIcon(res.currentProfileIcon);
            setProfileIcons(res.profileIcons);

            const updateFields = {
              balance: {
                mana: res.mana,
                storedMana: res.storedMana,
                maxStoredMana: res.maxStoredMana,
                lastManaInterval: new Date(res.lastManaInterval),
                nextManaInterval: new Date(res.nextManaInterval),
                currentProfileIcon: res.currentProfileIcon,
                profileIcons: res.profileIcons,
              },
            };
            const existingData = JSON.parse(localStorage.getItem(userID)) || {};
            const mergedData = {
              ...existingData,
              balance: {
                ...existingData.balance,
                ...updateFields.balance,
              },
            };

            localStorage.setItem(userID, JSON.stringify(mergedData));
          } else {
            console.log("Using local balance data...");
          }
        } else {
          createBalance(userID);

          setMana(50);
          setStoredMana(0);
          setMaxStoredMana(480);
          setLastManaInterval(new Date());
          setNextManaInterval(new Date());
          setCurrentProfileIcon(0);
          setProfileIcons([0]);

          const updateFields = {
            balance: {
              mana: 50,
              storedMana: 0,
              maxStoredMana: 480,
              lastManaInterval: new Date(),
              nextManaInterval: new Date(),
              currentProfileIcon: 0,
              profileIcons: [0],
            },
          };

          const existingData = JSON.parse(localStorage.getItem(userID)) || {};
          const mergedData = {
            ...existingData,
            balance: {
              ...existingData.balance,
              ...updateFields.balance,
            },
          };

          localStorage.setItem(userID, JSON.stringify(mergedData));
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
          storedMana + Math.abs(Math.floor(timeElapsed / REGEN_RATE)) >
          maxStoredMana
            ? maxStoredMana
            : storedMana + Math.abs(Math.floor(timeElapsed / REGEN_RATE));
        setStoredMana(newStoredMana);

        now.setTime(now.getTime() + REGEN_RATE);
        setNextManaInterval(new Date(now.getTime()));
      }

      setLastManaInterval(new Date());
    }, TICK_RATE - (new Date() % TICK_RATE));

    return () => clearInterval(manaRegenInterval);
  }, [
    REGEN_RATE,
    userID,
    lastManaInterval,
    maxStoredMana,
    nextManaInterval,
    storedMana,
  ]);

  return (
    <ManaContext.Provider
      value={{
        userID,
        username,
        handleBalanceLogin,
        handleBalanceLogout,
        mana,
        updateMana,
        retrieveStoredMana,
        storedMana,
        maxStoredMana,
        setMaxStoredMana,
        lastManaInterval,
        nextManaInterval,
        currentProfileIcon,
        setCurrentProfileIcon,
        profileIcons,
        setProfileIcons,
      }}
    >
      {children}
    </ManaContext.Provider>
  );
}
