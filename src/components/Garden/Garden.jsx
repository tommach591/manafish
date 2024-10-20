import { useNavigate } from "react-router-dom";
import "./Garden.css";
import { useState } from "react";
import Plot from "./Plot/Plot";

function Garden() {
  const navigate = useNavigate();
  const [HARVEST, WATER, FERTILIZE] = [-1, -2, -3];
  const [tool, setTool] = useState(HARVEST);

  // Temp Garden Data
  const [gardenPlot, setGardenPlot] = useState(() => {
    const newGardenPlot = {};
    for (let i = 0; i < 4; i++) {
      newGardenPlot[i] = {
        active: i === 0,
        plot: [...Array(3)].fill(
          [...Array(3)].fill({
            seed: 0,
            harvestDate: new Date(),
            watered: false,
            fertilized: false,
          })
        ),
      };
    }
    return newGardenPlot;
  });

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

  return (
    <div className="Garden">
      <button
        className="HomeButton"
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="BubbleReflection" />
        <img
          src="https://api.iconify.design/ic:round-home.svg?color=%2332323c"
          alt=""
        />
      </button>
      <div className="GardenButtons">
        <button onClick={() => {}}>
          <div className="BubbleReflection" />
          Gardendex
        </button>
      </div>
      <div className="GardenTools">
        <button
          onClick={() => {
            setTool(HARVEST);
          }}
          style={tool === HARVEST ? { opacity: 0.3 } : { opacity: 1 }}
        >
          <div className="BubbleReflection" />
          Harvest
        </button>
        <button
          onClick={() => {
            setTool(WATER);
          }}
          style={tool === WATER ? { opacity: 0.3 } : { opacity: 1 }}
        >
          <div className="BubbleReflection" />
          Water
        </button>
        <button
          onClick={() => {
            setTool(FERTILIZE);
          }}
          style={tool === FERTILIZE ? { opacity: 0.3 } : { opacity: 1 }}
        >
          <div className="BubbleReflection" />
          Fertilize
        </button>
        <button onClick={() => {}}>
          <div className="BubbleReflection" />
          Plant
        </button>
      </div>
      <div className="GardenPlotGrid">
        {Object.entries(gardenPlot).map(([key, value]) => {
          return (
            <Plot
              plotData={value}
              key={key}
              plotKey={key}
              updatePlantInPlot={updatePlantInPlot}
              tool={tool}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Garden;
