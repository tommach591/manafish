import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  createBalance,
  getBalance,
  updateBalance,
  updateBalanceOnUnload,
} from "./Balance";

const ManaContext = createContext();
export function useMana() {
  return useContext(ManaContext);
}

export function ManaProvider({ children }) {
  const [userID, setUserID] = useState(() => {
    const savedUserID = JSON.stringify(localStorage.getItem("userID"));
    return savedUserID ? JSON.parse(savedUserID) : "";
  });

  const [username, setUsername] = useState(() => {
    const savedUsername = JSON.stringify(localStorage.getItem("username"));
    return savedUsername ? JSON.parse(savedUsername) : "";
  });

  const [mana, setMana] = useState(0);
  const [storedMana, setStoredMana] = useState(0);
  const [maxStoredMana, setMaxStoredMana] = useState(480);
  const [lastManaInterval, setLastManaInterval] = useState(new Date());
  const [currentProfileIcon, setCurrentProfileIcon] = useState(0);
  const [profileIcons, setProfileIcons] = useState([0]);
  const [refresh, setRefresh] = useState(0);
  const savedOnUnload = useRef(false);

  const TICK_RATE = 1000;
  const REGEN_RATE = 30000;

  const updateMana = useCallback((val) => {
    setMana((prev) => prev + val);
  }, []);

  const retrieveStoredMana = useCallback(() => {
    setMana((prev) => prev + storedMana);
    setStoredMana(0);
  }, [storedMana]);

  const updateServerMana = useCallback(() => {
    if (!userID || refresh === 0) return;
    // console.log("Saving mana to server");
    const updateFields = {
      balance: {
        mana: mana,
        storedMana: storedMana,
        maxStoredMana: maxStoredMana,
        lastManaInterval: lastManaInterval,
        currentProfileIcon: currentProfileIcon,
        profileIcons: profileIcons,
      },
    };
    updateBalance(userID, updateFields.balance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userID,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    currentProfileIcon,
    profileIcons,
  ]);

  const updateServerManaUnload = useCallback(() => {
    if (!userID || refresh === 0 || savedOnUnload.current) return;
    savedOnUnload.current = true;

    // console.log("Saving mana to server on unload");
    const updateFields = {
      balance: {
        mana,
        storedMana,
        maxStoredMana,
        lastManaInterval,
        currentProfileIcon,
        profileIcons,
      },
    };
    updateBalanceOnUnload(userID, updateFields.balance);
  }, [
    userID,
    refresh,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    currentProfileIcon,
    profileIcons,
  ]);

  const handleBalanceLogin = useCallback((id, username) => {
    setUserID(id);
    setUsername(username);
    localStorage.setItem("userID", id);
    localStorage.setItem("username", username);
  }, []);

  const handleBalanceLogout = useCallback(() => {
    updateServerMana();
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    setUsername("");
    setUserID("");
  }, [updateServerMana]);

  // Save to Server
  useEffect(() => {
    if (!userID) return;
    const timeout = setTimeout(() => updateServerMana(), 500);
    return () => clearTimeout(timeout);
  }, [updateServerMana, userID]);

  // Save on unload
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") updateServerMana();
    };
    const handleUnload = () => {
      updateServerManaUnload();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [updateServerMana, updateServerManaUnload]);

  // Load data
  useEffect(() => {
    if (!userID) return;

    const fetchBalance = async () => {
      try {
        const res = await getBalance(userID);
        if (res) {
          const savedState = JSON.parse(localStorage.getItem(userID));
          const hasValidLocal = savedState?.balance?.lastManaInterval;

          const localStorageDataTime = hasValidLocal
            ? new Date(savedState.balance.lastManaInterval).getTime()
            : 0;
          const serverStorageDataTime = new Date(
            res.lastManaInterval
          ).getTime();

          if (hasValidLocal && localStorageDataTime > serverStorageDataTime) {
            console.log("Loading local balance data...");
            setMana(savedState.balance.mana);
            setStoredMana(savedState.balance.storedMana);
            setMaxStoredMana(savedState.balance.maxStoredMana);
            setLastManaInterval(new Date(savedState.balance.lastManaInterval));
            setCurrentProfileIcon(savedState.balance.currentProfileIcon);
            setProfileIcons(savedState.balance.profileIcons);
          } else {
            console.log("Loading server balance data...");
            setMana(res.mana);
            setStoredMana(res.storedMana);
            setMaxStoredMana(res.maxStoredMana);
            setLastManaInterval(new Date(res.lastManaInterval));
            setCurrentProfileIcon(res.currentProfileIcon);
            setProfileIcons(res.profileIcons);
          }
        } else {
          console.log("Creating new account...");
          createBalance(userID);
          setMana(50);
          setStoredMana(0);
          setMaxStoredMana(480);
          setLastManaInterval(new Date());
          setCurrentProfileIcon(0);
          setProfileIcons([0]);
        }
      } catch (err) {
        // console.error("Failed to fetch balance. Logging out user.", err);
        console.log("Creating new account...");
        createBalance(userID);
        setMana(50);
        setStoredMana(0);
        setMaxStoredMana(480);
        setLastManaInterval(new Date());
        setCurrentProfileIcon(0);
        setProfileIcons([0]);
      }
    };

    fetchBalance();
  }, [userID]);

  useEffect(() => {
    if (!userID) return;
    const manaRegenInterval = setInterval(() => {
      const now = Date.now();
      const nextTime = new Date(lastManaInterval).getTime();

      if (storedMana >= maxStoredMana) {
        setLastManaInterval(new Date(now + REGEN_RATE));
      } else {
        const timeElapsed = now - nextTime;
        if (timeElapsed >= 0) {
          const increments = Math.floor(timeElapsed / REGEN_RATE) + 1;
          setStoredMana((prev) => Math.min(prev + increments, maxStoredMana));
          setLastManaInterval(new Date(nextTime + increments * REGEN_RATE));
        }
      }
      setRefresh((prev) => prev + 1);
    }, TICK_RATE);

    return () => clearInterval(manaRegenInterval);
  }, [userID, maxStoredMana, lastManaInterval, storedMana]);

  return (
    <ManaContext.Provider
      value={{
        userID,
        setUserID,
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
