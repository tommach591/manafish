import { useState } from "react";
import { useMana } from "../../utils/AccountContext";
import "./Arcade.css";
import Modal from "../Modal";

function Arcade() {
  const { mana } = useMana();
  const MINBET = 50;
  const [bet, setBet] = useState(MINBET);
  const [winnings, setWinnings] = useState(0);

  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [isBJOpen, setIsBJOpen] = useState(false);

  const openScratch = () => setIsScratchOpen(true);
  const closeScratch = () => setIsScratchOpen(false);

  const openBJ = () => setIsBJOpen(true);
  const closeBJ = () => setIsBJOpen(false);

  return (
    <div className="Arcade">
      <div className="Mana">
        <h1>{`Mana: ${mana}`}</h1>
      </div>
      <div className="Bet">
        <h1>Bet</h1>
        <input
          type="number"
          step={1}
          min={MINBET}
          value={bet}
          onChange={(event) => {
            setBet(event.currentTarget.value);
          }}
        />
      </div>
      <button className="ArcadeButton" onClick={openScratch}>
        Scratch
      </button>
      <button className="ArcadeButton" onClick={openBJ}>
        BlackJack
      </button>

      <Modal
        isOpen={isScratchOpen}
        onClose={closeScratch}
        title="Scratch Cards"
      >
        <div>Scratch</div>
      </Modal>
      <Modal isOpen={isBJOpen} onClose={closeBJ} title="Black Jack">
        <div>BlackJack</div>
      </Modal>
    </div>
  );
}

export default Arcade;
