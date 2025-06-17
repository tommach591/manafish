import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getBalance, updateBalance } from "./Balance";

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

  const [loadedSuccessfully, setLoadedSucessfully] = useState(false);

  const [mana, setMana] = useState(0);
  const [storedMana, setStoredMana] = useState(0);
  const [maxStoredMana, setMaxStoredMana] = useState(480);
  const [lastManaInterval, setLastManaInterval] = useState(new Date());
  const [currentProfileIcon, setCurrentProfileIcon] = useState(0);
  const [profileIcons, setProfileIcons] = useState([0]);
  const [refresh, setRefresh] = useState(0);
  const [isManaBubbleOn, setIsManaBubbleOn] = useState(false);

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
    if (!userID || !loadedSuccessfully || refresh === 0) return;
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
    loadedSuccessfully,
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
    if (!userID || !loadedSuccessfully) return;
    const timeout = setTimeout(() => updateServerMana(), 500);
    return () => clearTimeout(timeout);
  }, [updateServerMana, userID, loadedSuccessfully]);

  // Load data
  useEffect(() => {
    if (!userID) return;

    const fetchBalance = async () => {
      try {
        const res = await getBalance(userID);
        if (res) {
          console.log("Loading server balance data...");
          setMana(res.mana);
          setStoredMana(res.storedMana);
          setMaxStoredMana(res.maxStoredMana);
          setLastManaInterval(new Date(res.lastManaInterval));
          setCurrentProfileIcon(res.currentProfileIcon);
          setProfileIcons(res.profileIcons);
          setLoadedSucessfully(true);
        }
      } catch (err) {
        alert("Error in fetching account, logging out...");
        localStorage.removeItem("userID");
        localStorage.removeItem("username");
        setUsername("");
        setUserID("");
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
          if (!isManaBubbleOn) setIsManaBubbleOn(Math.random() < 0.05);
        }
      }
      setRefresh((prev) => prev + 1);
    }, TICK_RATE);

    return () => clearInterval(manaRegenInterval);
  }, [userID, maxStoredMana, lastManaInterval, storedMana, isManaBubbleOn]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userID) {
        const fetchBalance = async () => {
          try {
            const res = await getBalance(userID);
            if (res) {
              console.log("Loading server balance data...");
              setMana(res.mana);
              setStoredMana(res.storedMana);
              setMaxStoredMana(res.maxStoredMana);
              setLastManaInterval(new Date(res.lastManaInterval));
              setCurrentProfileIcon(res.currentProfileIcon);
              setProfileIcons(res.profileIcons);
              setLoadedSucessfully(true);
            }
          } catch (err) {
            alert("Error in fetching account, logging out...");
            localStorage.removeItem("userID");
            localStorage.removeItem("username");
            setUsername("");
            setUserID("");
          }
        };

        fetchBalance();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userID]);

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
        isManaBubbleOn,
        setIsManaBubbleOn,
      }}
    >
      {children}
    </ManaContext.Provider>
  );
}
