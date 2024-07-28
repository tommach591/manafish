import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "../Login";
import Home from "../Home";
import Fishing from "../Fishing";
import Arcade from "../Arcade";
import { useMana } from "../../utils/AccountContext";

function App() {
  const { mana } = useMana();
  return (
    <div className="App">
      <div className="Mana">
        <h1>{`Mana: ${mana}`}</h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fishing" element={<Fishing />} />
        <Route path="/arcade" element={<Arcade />} />
      </Routes>
    </div>
  );
}

export default App;

