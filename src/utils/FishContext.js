import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMana } from "./ManaContext";
import { getFish, updateFish } from "./Fish";
import fishionary from "../assets/Fishionary.json";

const FishContext = createContext();
export function useFish() {
  return useContext(FishContext);
}

export function FishProvider({ children }) {
  const { userID, setUserID, setUsername } = useMana();

  const [loadedSuccessfully, setLoadedSucessfully] = useState(false);
  const [fishCaught, setFishCaught] = useState({});
  const [aliensCaught, setAliensCaught] = useState(null);

  const updateServerFish = useCallback(() => {
    if (!userID || !loadedSuccessfully) return;
    // console.log("Saving fish to server");
    const updateFields = {
      fish: {
        fishCaught: fishCaught,
        aliensCaught: aliensCaught,
      },
    };
    updateFish(userID, updateFields.fish);
  }, [userID, fishCaught, aliensCaught, loadedSuccessfully]);

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
      // Update to exclude from adding.
      const excluded = [23, 69, 70, 110, 107, 108];

      if (!excluded.includes(fishID))
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
    if (!userID || !loadedSuccessfully) return;
    const timeout = setTimeout(() => updateServerFish(), 500);
    return () => clearTimeout(timeout);
  }, [updateServerFish, userID, loadedSuccessfully]);

  // Load data
  useEffect(() => {
    if (!userID) return;
    else {
      getFish(userID).then((res) => {
        if (res) {
          console.log("Loading server fish data...");
          setFishCaught(res.fishCaught);
          setAliensCaught(res.aliensCaught);
          setLoadedSucessfully(true);
        } else {
          alert("Error in fetching account, logging out...");
          localStorage.removeItem("userID");
          localStorage.removeItem("username");
          setUsername("");
          setUserID("");
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
