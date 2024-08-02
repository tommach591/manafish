import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Login";
import Home from "../Home";
import Fishing from "../Fishing";
import Arcade from "../Arcade";
import { useMana } from "../../utils/ManaContext";
import { useEffect } from "react";

function App() {
  const { userID, mana } = useMana();
  const navigate = useNavigate();

  function formatNumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    if (!userID) {
      navigate("/login");
    }
  }, [userID, navigate]);

  return (
    <div className="App">
      {userID ? (
        <div className="Mana">
          <h1>{`Mana: ${formatNumberWithCommas(mana)}`}</h1>
        </div>
      ) : (
        <div />
      )}
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

