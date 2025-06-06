import { getSpaceImage } from "../../../utils/Spacedex";
import spacedex from "../../../assets/Spacedex.json";
import "./Spacedex.css";
import { useFish } from "../../../utils/FishContext";

function Spacedex() {
  const { aliensCaught } = useFish();

  const sortedAliens = Object.entries(spacedex).sort((a, b) => {
    const aCaught = !!aliensCaught[a[1].id];
    const bCaught = !!aliensCaught[b[1].id];

    // Uncaught fish always go to the end
    if (!aCaught && bCaught) return 1;
    if (aCaught && !bCaught) return -1;
    if (!aCaught && !bCaught) return 0;

    // Both are caught — sort by value descending
    return b[1].value - a[1].value;
  });

  return (
    <div className="Spacedex">
      {sortedAliens.map(([key, value]) => (
        <div className="Alien" key={key}>
          <img
            src={
              aliensCaught[value.id]
                ? getSpaceImage(key)
                : "https://api.iconify.design/mdi:help.svg?color=%23000000"
            }
            alt=""
          />
          <div className="AlienInfo">
            <h1>{aliensCaught[value.id] ? value.name : "???"}</h1>
            <h2>{aliensCaught[value.id] ? value.info : "???"}</h2>
            <h3>Value: {aliensCaught[value.id] ? value.value : "???"}</h3>
            <h3>Caught: {aliensCaught[value.id] ? aliensCaught[value.id] : 0}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Spacedex;
