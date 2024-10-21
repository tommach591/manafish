import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMana } from "./ManaContext";
import gardendex from "../assets/Gardendex.json";

const GardenContext = createContext();
export function useGarden() {
  return useContext(GardenContext);
}

export function GardenProvider({ children }) {
  const { userID } = useMana();

  // Temp Garden Data
  const [gardenPlot, setGardenPlot] = useState(() => {
    const newGardenPlot = {};
    for (let i = 0; i < 4; i++) {
      newGardenPlot[i] = {
        active: i === 0,
        plot: [...Array(3)].fill(
          [...Array(3)].fill({
            seed: -1,
            plantDate: new Date(),
            harvestDate: new Date(),
            watered: false,
            fertilized: false,
          })
        ),
      };
    }
    return newGardenPlot;
  });

  const [plantGrown, setPlantGrown] = useState({});
  const [gardenShop, setGardenShop] = useState([]);
  const [season, setSeason] = useState(0);

  const updatePlot = (plotKey, newPlotData) => {
    setGardenPlot((prevGardenPlot) => ({
      ...prevGardenPlot,
      [plotKey]: {
        ...newPlotData,
      },
    }));
  };

  const updatePlantInPlot = (plotKey, row, col, newPlantData) => {
    setGardenPlot((prevGardenPlot) => {
      const updatedPlot = { ...prevGardenPlot[plotKey] };
      const updatedRow = [...updatedPlot.plot[row]];
      const updatedPlant = { ...updatedRow[col], ...newPlantData };

      updatedRow[col] = updatedPlant;
      updatedPlot.plot[row] = updatedRow;

      return {
        ...prevGardenPlot,
        [plotKey]: updatedPlot,
      };
    });
  };

  useEffect(() => {
    const updateGardenShop = () => {
      const count = 6;
      const ids = Object.keys(gardendex);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      setGardenShop(ids.slice(0, count));
    };

    // Change Daily Shop and Season
    updateGardenShop();
  }, []);

  const addPlant = useCallback(
    (plantID) => {
      const newPlantGrown = { ...plantGrown };

      if (newPlantGrown[plantID]) {
        newPlantGrown[plantID] += 1;
        setPlantGrown(newPlantGrown);
      } else {
        newPlantGrown[plantID] = 1;

        const sortedFishCaught = {};
        Object.keys(newPlantGrown)
          .sort()
          .forEach((key) => {
            sortedFishCaught[key] = newPlantGrown[key];
          });

        setPlantGrown(sortedFishCaught);
      }
    },
    [plantGrown]
  );

  const isAnyPlantFullyGrown = useCallback(() => {
    const currentTime = new Date().getTime();
    return Object.values(gardenPlot).some((plot) =>
      plot.plot.some((row) =>
        row.some(
          (plant) => plant.seed !== -1 && plant.harvestDate <= currentTime
        )
      )
    );
  }, [gardenPlot]);

  return (
    <GardenContext.Provider
      value={{
        gardenPlot,
        updatePlot,
        updatePlantInPlot,
        gardenShop,
        season,
        plantGrown,
        addPlant,
        isAnyPlantFullyGrown,
      }}
    >
      {children}
    </GardenContext.Provider>
  );
}
