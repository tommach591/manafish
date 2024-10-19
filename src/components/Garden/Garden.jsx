import { useNavigate } from "react-router-dom";
import "./Garden.css";
import { useState } from "react";
import Plot from "./Plot/Plot";

function Garden() {
  const navigate = useNavigate();
  // Temp Garden Data
  const [gardenPlot, setGardenPlot] = useState(() => {
    const newGardenPlot = {};
    for (let i = 0; i < 9; i++) {
      newGardenPlot[i] = {
        active: i === 4,
        plot: [...Array(3)].fill(
          [...Array(3)].fill([
            {
              seed: 0,
              plantDate: new Date(),
              harvestDate: new Date(),
              watered: false,
              fertilized: false,
            },
          ])
        ),
      };
    }
    return newGardenPlot;
  });

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
      <div className="GardenPlotGrid">
        {Object.entries(gardenPlot).map(([key, value]) => {
          return <Plot plotData={value} key={key} />;
        })}
      </div>
    </div>
  );
}

export default Garden;
