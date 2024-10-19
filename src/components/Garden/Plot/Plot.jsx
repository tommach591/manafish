import "./Plot.css";

function Plot({ plotData }) {
  return (
    <div
      className="Plot"
      style={plotData.active ? { opacity: 1 } : { opacity: 0.3 }}
    >
      {plotData.plot.map((row, i) => {
        return row.map((plot, j) => {
          return <div className="Plant" key={i + j} />;
        });
      })}
    </div>
  );
}

export default Plot;
