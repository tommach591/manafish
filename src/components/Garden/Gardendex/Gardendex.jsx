import { getPlantImage } from "../../../utils/Gardendex";
import gardendex from "../../../assets/Gardendex.json";
import "./Gardendex.css";
import { useGarden } from "../../../utils/GardenContext";

function Gardendex() {
  const { plantGrown } = useGarden();

  return (
    <div className="Gardendex">
      {Object.entries(gardendex).map(([key, value], i) => {
        return (
          <div className="GardendexPlant" key={i}>
            <img
              src={
                plantGrown[value.id]
                  ? getPlantImage(key)
                  : "https://api.iconify.design/mdi:help.svg?color=%23000000"
              }
              alt=""
            />
            <div className="PlantInfo">
              <h1>{plantGrown[value.id] ? value.name : "???"}</h1>
              <h2>{plantGrown[value.id] ? value.info : "???"}</h2>
              <h3>Value: {plantGrown[value.id] ? value.value : "???"}</h3>
              <h3>Caught: {plantGrown[value.id] ? plantGrown[value.id] : 0}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Gardendex;
