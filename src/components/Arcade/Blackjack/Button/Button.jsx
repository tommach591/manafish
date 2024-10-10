import "./Button.css";

function Button({ name, active, handleOnClick, params }) {
  return (
    <div
      className="Button"
      onClick={() => {
        if (active) handleOnClick(params);
      }}
      style={active ? { opacity: 1 } : { opacity: 0.2 }}
    >
      <h1>{name}</h1>
    </div>
  );
}

export default Button;
