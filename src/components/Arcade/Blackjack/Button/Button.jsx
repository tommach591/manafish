import "./Button.css";

function Button({ name, active, handleOnClick, params }) {
  return (
    <div
      className="Button"
      onClick={() => {
        if (active) handleOnClick(params);
      }}
      style={active ? { background: "white" } : { background: "gray" }}
    >
      <h1>{name}</h1>
    </div>
  );
}

export default Button;
