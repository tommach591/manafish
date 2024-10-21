import "./Plant.css";
import gardendex from "../../../../assets/Gardendex.json";
import { useCallback, useEffect, useState } from "react";
import { getPlantImage } from "../../../../utils/Gardendex";
import { useMana } from "../../../../utils/ManaContext";
import { useGarden } from "../../../../utils/GardenContext";

function Plant({
  plotData,
  plotKey,
  updatePlantInPlot,
  tool,
  plant,
  row,
  col,
  openBroke,
}) {
  const { mana, updateMana } = useMana();
  const { season, addPlant } = useGarden();
  const [progress, setProgress] = useState(0);
  const [claimedMana, setClaimedMana] = useState(0);

  useEffect(() => {
    const harvestProgress = () => {
      const currentTime = new Date();
      const totalDuration = plant.harvestDate - plant.plantDate;
      const timePassed = currentTime - plant.plantDate;

      if (currentTime >= plant.harvestDate) setProgress(100);
      else {
        const percentage = (timePassed / totalDuration) * 100;
        setProgress(Math.min(percentage, 100));
      }
    };

    harvestProgress();
    const harvestProgressInterval = setInterval(harvestProgress, 1000);

    return () => clearInterval(harvestProgressInterval);
  }, [plant]);

  const handleClick = useCallback(
    (row, col, plant) => {
      const handleHarvest = () => {
        const updatedPlant = { ...plant };
        const currentTime = new Date();
        if (updatedPlant.harvestDate > currentTime || updatedPlant.seed < 0)
          return;

        let count = 1;
        if (updatedPlant.watered) count += Math.random();
        if (updatedPlant.fertilized) count += Math.random();
        if (Number(gardendex[updatedPlant.seed].season) === season) count *= 2;
        const earned = Math.floor(gardendex[updatedPlant.seed].value * count);
        setClaimedMana(earned);
        updateMana(earned);

        addPlant(updatedPlant.seed);
        updatedPlant.fertilized = false;
        updatedPlant.watered = false;
        updatedPlant.seed = -1;
        updatePlantInPlot(plotKey, row, col, updatedPlant);
      };

      const handleFertilize = () => {
        const updatedPlant = { ...plant };
        const currentTime = new Date();
        if (updatedPlant.seed < 0 || updatedPlant.harvestDate <= currentTime)
          return;
        updatedPlant.fertilized = true;
        updatePlantInPlot(plotKey, row, col, updatedPlant);
      };

      const handleWater = () => {
        const updatedPlant = { ...plant };
        const currentTime = new Date();
        if (updatedPlant.seed < 0 || updatedPlant.harvestDate <= currentTime)
          return;
        updatedPlant.watered = true;
        setProgress(0);
        updatePlantInPlot(plotKey, row, col, updatedPlant);
      };

      const handlePlant = () => {
        const updatedPlant = { ...plant };
        const PRICE = 10;
        const cost = Math.floor(gardendex[tool].value / PRICE);
        if (updatedPlant.seed !== -1) return;
        if (mana < cost) openBroke();
        else {
          updateMana(-cost);
          setProgress(0);
          updatedPlant.seed = tool;
          updatedPlant.plantDate = new Date();
          updatedPlant.harvestDate = new Date();
          updatedPlant.harvestDate.setTime(
            updatedPlant.harvestDate.getTime() +
              gardendex[tool].growth * 1000 * 60
          );
          updatePlantInPlot(plotKey, row, col, updatedPlant);
        }
      };

      const [HARVEST, WATER, FERTILIZE] = [-1, -2, -3];
      switch (tool) {
        case HARVEST: {
          handleHarvest();
          break;
        }
        case WATER: {
          handleWater();
          break;
        }
        case FERTILIZE: {
          handleFertilize();
          break;
        }
        default: {
          handlePlant();
          break;
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mana, updateMana, plotKey, updatePlantInPlot, tool]
  );

  return (
    <div
      className="Plant"
      key={row + col}
      onClick={() => {
        handleClick(row, col, plant);
      }}
    >
      <h1
        className="TextPopUp"
        style={
          claimedMana !== 0
            ? {
                animation: "textPopUp 1.5s forwards ease-in-out 1",
              }
            : {}
        }
        onAnimationEnd={() => setClaimedMana(0)}
      >
        +{claimedMana}
      </h1>
      {plant.seed >= 0 ? (
        <div className="PlantProgress">
          <div
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      ) : (
        <div />
      )}
      <div className="PlantStatus">
        {plant.watered ? (
          <img
            src="https://api.iconify.design/material-symbols:water-drop.svg?color=%23187fec"
            alt=""
          />
        ) : (
          <div />
        )}
        {plant.fertilized ? (
          <img
            src="https://api.iconify.design/fa6-solid:poop.svg?color=%23190900"
            alt=""
          />
        ) : (
          <div />
        )}
      </div>
      <img
        src={
          progress === 0
            ? ""
            : progress <= 50
            ? "https://api.iconify.design/mdi:seed.svg?color=%23180c01"
            : progress < 100
            ? "https://api.iconify.design/ph:plant-fill.svg?color=%23329924"
            : getPlantImage(plant.seed)
        }
        alt=""
        style={progress < 100 ? {} : { width: "1.5rem" }}
      />
    </div>
  );
}

export default Plant;
