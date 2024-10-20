import { useCallback } from "react";
import "./Plot.css";

function Plot({ plotData, plotKey, updatePlantInPlot, tool }) {
  const handleClick = useCallback(
    (row, col, plant) => {
      const handleHarvest = () => {
        const updatedPlant = { ...plant };
        updatedPlant.seed = -1;
        updatePlantInPlot(plotKey, row, col, updatedPlant);
      };

      const handleFertilize = () => {
        const updatedPlant = { ...plant };
        updatedPlant.fertilized = true;
        updatePlantInPlot(plotKey, row, col, updatedPlant);
      };

      const handleWater = () => {
        const updatedPlant = { ...plant };
        updatedPlant.watered = true;
        updatePlantInPlot(plotKey, row, col, updatedPlant);
      };

      const handlePlant = () => {
        const updatedPlant = { ...plant };
        updatedPlant.fertilized = false;
        updatedPlant.watered = false;
        updatedPlant.seed = tool;
        updatePlantInPlot(plotKey, row, col, updatedPlant);
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
    [plotKey, updatePlantInPlot, tool]
  );

  const getPlantStatus = (plant, row, col) => {
    const currentDate = new Date();
    if (!plotData.active || plant.seed < 0)
      return <div className="Plant" key={row + col} />;
    else {
      if (plant.harvestDate < currentDate) {
        return (
          <div
            className="Plant"
            key={row + col}
            onClick={() => {
              handleClick(row, col, plant);
            }}
          >
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
              src="https://api.iconify.design/ph:plant-fill.svg?color=%23329924"
              alt=""
            />
          </div>
        );
      } else
        return (
          <div
            className="Plant"
            key={row + col}
            onClick={() => {
              handleClick(row, col, plant);
            }}
          >
            <img
              src="https://api.iconify.design/mdi:seed.svg?color=%233a2c2c"
              alt=""
            />
          </div>
        );
    }
  };

  return (
    <div
      className="Plot"
      style={plotData.active ? { opacity: 1 } : { opacity: 0.3 }}
    >
      {plotData.plot.map((row, i) => {
        return row.map((plant, j) => {
          return getPlantStatus(plant, i, j);
        });
      })}
    </div>
  );
}

export default Plot;
