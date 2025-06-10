import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMana } from "./ManaContext";
import { createFish, getFish, updateFish } from "./Fish";
import fishionary from "../assets/Fishionary.json";

const FishContext = createContext();
export function useFish() {
  return useContext(FishContext);
}

export function FishProvider({ children }) {
  const { userID, lastManaInterval } = useMana();

  const [fishCaught, setFishCaught] = useState({});
  const [aliensCaught, setAliensCaught] = useState(null);

  const updateServerFish = useCallback(() => {
    if (!userID) return;
    // console.log("Saving fish to server");
    const updateFields = {
      fish: {
        fishCaught: fishCaught,
        aliensCaught: aliensCaught,
      },
    };
    updateFish(userID, updateFields.fish);
  }, [userID, fishCaught, aliensCaught]);

  const addFish = useCallback(
    (fishID) => {
      const newFishCaught = { ...fishCaught };

      if (newFishCaught[fishID]) {
        newFishCaught[fishID] += 1;
        setFishCaught(newFishCaught);
      } else {
        newFishCaught[fishID] = 1;

        const sortedFishCaught = {};
        Object.keys(newFishCaught)
          .sort()
          .forEach((key) => {
            sortedFishCaught[key] = newFishCaught[key];
          });

        setFishCaught(sortedFishCaught);
      }
    },
    [fishCaught]
  );

  const addAllFish = useCallback(() => {
    const newFishCaught = { ...fishCaught };
    Object.keys(fishionary).forEach((key) => {
      const fishID = Number(key);
      if (newFishCaught[fishID]) {
        newFishCaught[fishID] += 1;
      } else newFishCaught[fishID] = 1;
    });

    const sortedFishCaught = {};
    Object.keys(newFishCaught)
      .sort()
      .forEach((key) => {
        sortedFishCaught[key] = newFishCaught[key];
      });
    setFishCaught(sortedFishCaught);
  }, [fishCaught]);

  const unlockAliens = useCallback(() => {
    setAliensCaught({});
  }, []);

  const addAlien = useCallback(
    (alienID) => {
      const newAlienCaught = { ...aliensCaught };

      if (newAlienCaught[alienID]) {
        newAlienCaught[alienID] += 1;
        setAliensCaught(newAlienCaught);
      } else {
        newAlienCaught[alienID] = 1;

        const sortedAlienCaught = {};
        Object.keys(newAlienCaught)
          .sort()
          .forEach((key) => {
            sortedAlienCaught[key] = newAlienCaught[key];
          });

        setAliensCaught(sortedAlienCaught);
      }
    },
    [aliensCaught]
  );

  // Save to Server
  useEffect(() => {
    if (!userID) return;
    const timeout = setTimeout(() => updateServerFish(), 500);
    return () => clearTimeout(timeout);
  }, [updateServerFish, userID]);

  // Load data
  useEffect(() => {
    if (!userID) return;
    else {
      getFish(userID).then((res) => {
        if (res) {
          const savedState = JSON.parse(localStorage.getItem(userID));
          const hasValidLocal = savedState?.balance?.lastManaInterval;

          const localStorageDataTime = hasValidLocal
            ? new Date(savedState.balance.lastManaInterval).getTime()
            : 0;
          const serverStorageDataTime = new Date(lastManaInterval).getTime();
          if (hasValidLocal && localStorageDataTime > serverStorageDataTime) {
            console.log("Loading local fish data...");
            setFishCaught(savedState.fish.fishCaught);
            setAliensCaught(savedState.fish.aliensCaught);
          } else {
            // Everything above, will be deleted later once localstorage is no longer used.
            console.log("Loading server fish data...");
            setFishCaught(res.fishCaught);
            setAliensCaught(res.aliensCaught);
          }
        } else {
          console.log("Creating new account...");
          createFish(userID);
          setFishCaught({});
          setAliensCaught(null);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  return (
    <FishContext.Provider
      value={{
        fishCaught,
        addFish,
        addAllFish,
        unlockAliens,
        aliensCaught,
        addAlien,
      }}
    >
      {children}
    </FishContext.Provider>
  );
}
