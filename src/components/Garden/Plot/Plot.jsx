import Plant from "./Plant";
import "./Plot.css";

function Plot({
  plotData,
  plotKey,
  updatePlantInPlot,
  tool,
  openBuyPlot,
  openBroke,
}) {
  return (
    <div
      className="Plot"
      style={plotData.active ? { opacity: 1 } : { opacity: 0.3 }}
      onClick={() => {
        if (!plotData.active) openBuyPlot(plotKey);
      }}
    >
      {plotData.plot.map((row, i) => {
        return row.map((plant, j) => {
          return (
            <Plant
              plotData={plotData}
              plotKey={plotKey}
              updatePlantInPlot={updatePlantInPlot}
              tool={tool}
              plant={plant}
              row={i}
              col={j}
              openBroke={openBroke}
              key={i + j}
            />
          );
        });
      })}
    </div>
  );
}

export default Plot;
