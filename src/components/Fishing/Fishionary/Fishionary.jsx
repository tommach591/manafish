import { getFishImage } from "../../../utils/Fishionary";
import fishionary from "../../../assets/Fishionary.json";
import "./Fishionary.css";
import { useFish } from "../../../utils/FishContext";

function Fishionary() {
  const { fishCaught } = useFish();

  return (
    <div className="Fishionary">
      {Object.entries(fishionary).map(([key, value], i) => {
        return (
          <div className="Fish" key={i}>
            <img
              src={
                fishCaught[value.id]
                  ? getFishImage(key)
                  : "https://api.iconify.design/mdi:help.svg?color=%23000000"
              }
              alt=""
            />
            <div className="FishInfo">
              <h1>{fishCaught[value.id] ? value.name : "???"}</h1>
              <h2>{fishCaught[value.id] ? value.info : "???"}</h2>
              <h3>Value: {fishCaught[value.id] ? value.value : "???"}</h3>
              <h3>Caught: {fishCaught[value.id] ? fishCaught[value.id] : 0}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Fishionary;
