import { getFishImage } from "../../../utils/Fishdex";
import fishionary from "../../../assets/Fishionary.json";
import "./Fishionary.css";

function Fishionary() {
  return (
    <div className="Fishionary">
      {Object.entries(fishionary).map((entries, i) => {
        return (
          <div className="Fish" key={i}>
            <img src={getFishImage(entries[0])} alt="" />
            <div className="FishInfo">
              <h1>Name: {entries[1].name}</h1>
              <h1>Info: {entries[1].info}</h1>
              <h1>Value: {entries[1].value}</h1>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Fishionary;
