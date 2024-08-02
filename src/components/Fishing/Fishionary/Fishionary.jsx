import { getFishImage } from "../../../utils/Fishionary";
import fishionary from "../../../assets/Fishionary.json";
import "./Fishionary.css";
import { useFish } from "../../../utils/FishContext";

function Fishionary() {
  const { fishCaught } = useFish();
  return (
    <div className="Fishionary">
      {Object.entries(fishionary).map((entries, i) => {
        return (
          <div className="Fish" key={i}>
            <img
              src={
                fishCaught[entries[1].id]
                  ? getFishImage(entries[0])
                  : "https://api.iconify.design/mdi:help.svg?color=%23000000"
              }
              alt=""
            />
            <div className="FishInfo">
              <h1>{fishCaught[entries[1].id] ? entries[1].name : "???"}</h1>
              <h2>{fishCaught[entries[1].id] ? entries[1].info : "???"}</h2>
              <h3>
                Value: {fishCaught[entries[1].id] ? entries[1].value : "???"}
              </h3>
              <h3>
                Caught:{" "}
                {fishCaught[entries[1].id] ? fishCaught[entries[1].id] : 0}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Fishionary;
