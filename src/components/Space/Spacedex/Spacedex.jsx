import { getSpaceImage } from "../../../utils/Spacedex";
import spacedex from "../../../assets/Spacedex.json";
import "./Spacedex.css";
import { useFish } from "../../../utils/FishContext";

function Spacedex() {
  const { fishCaught } = useFish();

  const sortedFish = Object.entries(spacedex).sort((a, b) => {
    const aCaught = !!fishCaught[a[1].id];
    const bCaught = !!fishCaught[b[1].id];

    // Uncaught fish always go to the end
    if (!aCaught && bCaught) return 1;
    if (aCaught && !bCaught) return -1;
    if (!aCaught && !bCaught) return 0;

    // Both are caught — sort by value descending
    return b[1].value - a[1].value;
  });

  return (
    <div className="Spacedex">
      {sortedFish.map(([key, value]) => (
        <div className="Fish" key={key}>
          <img
            src={
              fishCaught[value.id]
                ? getSpaceImage(key)
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
      ))}
    </div>
  );
}

export default Spacedex;
