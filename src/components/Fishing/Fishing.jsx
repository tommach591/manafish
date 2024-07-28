import { useState } from "react";
import "./Fishing.css";
import Modal from "../Modal";
import Fishionary from "./Fishionary";
import { useNavigate } from "react-router-dom";

function Fishing() {
  const [isFishionaryOpen, setIsFishionaryOpen] = useState(false);
  const openFishionary = () => setIsFishionaryOpen(true);
  const closeFishionary = () => setIsFishionaryOpen(false);
  const navigate = useNavigate();
  return (
    <div className="Fishing">
      <button
        onClick={() => {
          openFishionary();
        }}
      >
        Fishionary
      </button>
      <button onClick={() => navigate("/")}>Home</button>
      <Modal
        isOpen={isFishionaryOpen}
        onClose={closeFishionary}
        title="Fishionary"
      >
        <Fishionary />
      </Modal>
    </div>
  );
}

export default Fishing;
