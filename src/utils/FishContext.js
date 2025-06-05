import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMana } from "./ManaContext";
import { createFish, getFish, updateFish } from "./Fish";

const FishContext = createContext();
export function useFish() {
  return useContext(FishContext);
}

export function FishProvider({ children }) {
  const { userID } = useMana();

  const initializeState = useCallback((id, key, defaultValue) => {
    const savedState = localStorage.getItem(id);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState["fish"])
        return parsedState["fish"][key] !== undefined
          ? parsedState["fish"][key]
          : defaultValue;
      else return defaultValue;
    }
    return defaultValue;
  }, []);

  const [fishCaught, setFishCaught] = useState(() =>
    initializeState(userID, "fishCaught", {})
  );

  const [aliensCaught, setAliensCaught] = useState(() =>
    initializeState(userID, "aliensCaught", null)
  );

  const updateServerFish = useCallback(() => {
    const updateFields = JSON.parse(localStorage.getItem(userID));
    if (userID) updateFish(userID, updateFields.fish);
  }, [userID]);

  const handleFishLogin = useCallback(
    (id) => {
      setFishCaught(initializeState(id, "fishCaught", {}));
      setAliensCaught(initializeState(id, "aliensCaught", null));
    },
    [initializeState]
  );

  const handleFishLogout = useCallback(async () => {
    const updateFields = {
      fish: {
        fishCaught: fishCaught,
        aliensCaught: aliensCaught,
      },
    };
    const existingData = JSON.parse(localStorage.getItem(userID)) || {};

    const mergedData = {
      ...existingData,
      fish: {
        ...updateFields.fish,
      },
    };
    if (userID) localStorage.setItem(userID, JSON.stringify(mergedData));
    updateServerFish();
  }, [userID, fishCaught, aliensCaught, updateServerFish]);

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

  const unlockAliens = useCallback(() => {
    setAliensCaught({});
  }, [])

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

  // Save Locally.
  useEffect(() => {
    if (!userID) return;
    const saveInterval = setInterval(() => {
      const updateFields = {
        fish: {
          fishCaught: fishCaught,
          aliensCaught: aliensCaught,
        },
      };
      const existingData = JSON.parse(localStorage.getItem(userID)) || {};

      const mergedData = {
        ...existingData,
        fish: {
          ...existingData.fish,
          ...updateFields.fish,
        },
      };
      if (userID) localStorage.setItem(userID, JSON.stringify(mergedData));
    }, 1000);

    return () => clearInterval(saveInterval);
  }, [userID, fishCaught, aliensCaught]);

  // Save to Server
  useEffect(() => {
    if (!userID) return;
    const saveInterval = setInterval(() => {
      updateServerFish();
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(saveInterval);
    };
  }, [updateServerFish, userID]);

  useEffect(() => {
    if (!userID) return;
    else {
      getFish(userID).then((res) => {
        if (res) {
          const savedData = localStorage.getItem(userID)
            ? JSON.parse(localStorage.getItem(userID))
            : null;
          if (!savedData?.fish) {
            console.log("Loading server fish data...");
            setFishCaught(res.fishCaught);

            const updateFields = {
              fish: {
                fishCaught: res.fishCaught,
                aliensCaught: res.aliensCaught
              },
            };
            const existingData = JSON.parse(localStorage.getItem(userID)) || {};
            const mergedData = {
              ...existingData,
              fish: {
                ...existingData.fish,
                ...updateFields.fish,
              },
            };

            if (userID)
              localStorage.setItem(userID, JSON.stringify(mergedData));
          } else {
            console.log("Using local fish data...");
          }
        } else {
          createFish(userID);
          setFishCaught({});
          setAliensCaught(null);

          const updateFields = {
            fish: {
              fishCaught: {},
            },
          };

          const existingData = JSON.parse(localStorage.getItem(userID)) || {};
          const mergedData = {
            ...existingData,
            fish: {
              ...existingData.fish,
              ...updateFields.fish,
            },
          };

          if (userID) localStorage.setItem(userID, JSON.stringify(mergedData));
        }
      });
    }
  }, [userID]);

  return (
    <FishContext.Provider
      value={{
        fishCaught,
        handleFishLogin,
        handleFishLogout,
        addFish,
        unlockAliens,
        aliensCaught,
        addAlien
      }}
    >
      {children}
    </FishContext.Provider>
  );
}
