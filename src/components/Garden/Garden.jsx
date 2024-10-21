import { useNavigate } from "react-router-dom";
import "./Garden.css";
import { useState } from "react";
import Modal from "../Modal";
import Plot from "./Plot";
import gardendex from "../../assets/Gardendex.json";
import Gardendex from "./Gardendex";
import { useGarden } from "../../utils/GardenContext";
import SeedMenu from "./SeedMenu";
import { formatNumberWithCommas } from "../../utils/Helper";
import { useMana } from "../../utils/ManaContext";

function Garden() {
  const navigate = useNavigate();
  const { mana, updateMana } = useMana();
  const { gardenPlot, updatePlot, updatePlantInPlot, plantGrown } = useGarden();

  const PLOT_PRICE = 100000;
  const [HARVEST, WATER, FERTILIZE] = [-1, -2, -3];
  const [tool, setTool] = useState(HARVEST);

  const [isBrokeOpen, setIsBrokeOpen] = useState(false);
  const openBroke = () => setIsBrokeOpen(true);
  const closeBroke = () => setIsBrokeOpen(false);

  const [isGardendexOpen, setIsGardendexOpen] = useState(false);
  const openGardendex = () => setIsGardendexOpen(true);
  const closeGardendex = () => setIsGardendexOpen(false);

  const [isBuyPlotOpen, setIsBuyPlotOpen] = useState(0);
  const openBuyPlot = (plot) => setIsBuyPlotOpen(plot);
  const closeBuyPlot = () => setIsBuyPlotOpen(0);

  const [isSeedMenuOpen, setIsSeedMenuOpen] = useState(false);
  const openSeedMenu = () => setIsSeedMenuOpen(true);
  const closeSeedMenu = () => setIsSeedMenuOpen(false);

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
        <button onClick={openGardendex}>
          <div className="BubbleReflection" />
          Gardendex
          <h1>
            {Object.keys(plantGrown).length}/{Object.keys(gardendex).length}
          </h1>
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
        <button onClick={openSeedMenu}>
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
              openBuyPlot={openBuyPlot}
              openBroke={openBroke}
            />
          );
        })}
      </div>
      <Modal
        isOpen={isBuyPlotOpen !== 0}
        onClose={closeBuyPlot}
        title="Buy Plot"
      >
        <h1>{`Buy new plot for ${formatNumberWithCommas(
          PLOT_PRICE *
            Object.values(gardenPlot).filter((plot) => plot.active).length
        )} mana?`}</h1>
        <div className="ShopDecision">
          <button
            onClick={() => {
              const plotsOwned = Object.values(gardenPlot).filter(
                (plot) => plot.active
              ).length;
              if (mana <= PLOT_PRICE * plotsOwned) {
                openBroke();
              } else {
                updateMana(-PLOT_PRICE * plotsOwned);
                const updatedPlot = { ...gardenPlot[isBuyPlotOpen] };
                updatedPlot.active = true;
                updatePlot(isBuyPlotOpen, updatedPlot);
                closeBuyPlot();
              }
            }}
          >
            Yes
          </button>
          <button onClick={closeBuyPlot}>No</button>
        </div>
      </Modal>
      <Modal
        isOpen={isGardendexOpen}
        onClose={closeGardendex}
        title="Gardendex"
      >
        <Gardendex />
      </Modal>
      <Modal isOpen={isSeedMenuOpen} onClose={closeSeedMenu} title="Seed Menu">
        <SeedMenu tool={tool} setTool={setTool} />
      </Modal>
      <Modal isOpen={isBrokeOpen} onClose={closeBroke} title="Not Enough Mana">
        Gardening is for the rich.
      </Modal>
    </div>
  );
}

export default Garden;
