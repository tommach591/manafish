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

  const updateServerFish = useCallback(() => {
    const updateFields = JSON.parse(localStorage.getItem(userID));
    if (userID) updateFish(userID, updateFields.fish);
  }, [userID]);

  const handleFishLogin = useCallback(
    (id) => {
      setFishCaught(initializeState(id, "fishCaught", {}));
    },
    [initializeState]
  );

  const handleFishLogout = useCallback(() => {
    const updateFields = {
      fish: {
        fishCaught: fishCaught,
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
    localStorage.setItem(userID, JSON.stringify(mergedData));
    updateServerFish();
  }, [userID, fishCaught, updateServerFish]);

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

  // Save Locally.
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const updateFields = {
        fish: {
          fishCaught: fishCaught,
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
      localStorage.setItem(userID, JSON.stringify(mergedData));
    }, 1000);

    return () => clearInterval(saveInterval);
  }, [userID, fishCaught]);

  // Save to Server
  useEffect(() => {
    const saveInterval = setInterval(() => {
      updateServerFish();
    }, 1000 * 60 * 30);

    return () => {
      clearInterval(saveInterval);
    };
  }, [updateServerFish]);

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

            localStorage.setItem(userID, JSON.stringify(mergedData));
          } else {
            console.log("Using local fish data...");
          }
        } else {
          createFish(userID);
          setFishCaught({});

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

          localStorage.setItem(userID, JSON.stringify(mergedData));
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
      }}
    >
      {children}
    </FishContext.Provider>
  );
}
