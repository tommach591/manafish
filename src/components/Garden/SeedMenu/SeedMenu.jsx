import "./SeedMenu.css";
import { getPlantImage } from "../../../utils/Gardendex";
import gardendex from "../../../assets/Gardendex.json";
import { useGarden } from "../../../utils/GardenContext";

function SeedMenu({ tool, setTool }) {
  const { gardenShop, season } = useGarden();
  const PRICE = 10;

  function convertToHoursAndMinutes(hoursFloat) {
    const hours = Math.floor(hoursFloat);
    const minutes = Math.round((hoursFloat - hours) * 60);
    return `${hours} hour(s) and ${minutes} minute(s)`;
  }

  function getSeason(season) {
    switch (season) {
      case 1:
        return "Summer";
      case 2:
        return "Fall";
      case 3:
        return "Winter";
      default:
        return "Spring";
    }
  }

  return (
    <div className="SeedMenu">
      <h1 className="CurrentSeason">{getSeason(season)}</h1>
      {Object.entries(gardendex)
        .filter(([key]) => gardenShop.includes(key))
        .sort((a, b) => {
          if (a[1].season !== b[1].season) return a[1].season - b[1].season;
          if (a[1].value !== b[1].value) return a[1].value - b[1].value;
          return a[1].name.localeCompare(b[1].name);
        })
        .map(([key, value], i) => {
          return (
            <div
              className="Seed"
              key={i}
              onClick={() => {
                setTool(Number(value.id));
              }}
              style={{
                border:
                  value.season === season
                    ? "1px solid green"
                    : "1px solid black",
                background:
                  value.season === season
                    ? "rgb(200, 255, 225)"
                    : "rgb(255, 255, 255)",
                opacity: tool === Number(value.id) ? 0.3 : 1,
              }}
            >
              <img src={getPlantImage(key)} alt="" />
              <div className="SeedInfo">
                <h1>
                  {value.name}
                  {season === value.season ? " (x2)" : ""}
                </h1>
                <h3>Cost: {Math.floor(value.value / PRICE)} Mana</h3>
                <h3>Growth: {convertToHoursAndMinutes(value.growth)}</h3>
                <h3>Season: {getSeason(value.season)}</h3>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default SeedMenu;
