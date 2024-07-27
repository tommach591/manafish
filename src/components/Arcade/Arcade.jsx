import { useState } from "react";
import { useMana } from "../../utils/AccountContext";
import "./Arcade.css";
import Modal from "../Modal";
import Scratch from "./Scratch";
import Blackjack from "./Blackjack";
import { useNavigate } from "react-router-dom";

function Arcade() {
  const { mana, updateMana } = useMana();
  const MINBET = 5;
  const [bet, setBet] = useState(MINBET);

  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [isBJOpen, setIsBJOpen] = useState(false);

  const openScratch = () => setIsScratchOpen(true);
  const closeScratch = () => setIsScratchOpen(false);

  const openBJ = () => setIsBJOpen(true);
  const closeBJ = () => setIsBJOpen(false);

  const navigate = useNavigate();

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
      <button
        className="ArcadeButton"
        onClick={() => {
          if (bet < MINBET) alert(`Minimum bet is ${MINBET} mana!`);
          else if (mana < bet) alert("Not enough mana!");
          else {
            updateMana(-bet);
            openScratch();
          }
        }}
      >
        Scratch
      </button>
      <button
        className="ArcadeButton"
        onClick={() => {
          if (bet < MINBET) alert(`Minimum bet is ${MINBET} mana!`);
          else if (mana < bet) alert("Not enough mana!");
          else {
            updateMana(-bet);
            openBJ();
          }
        }}
      >
        BlackJack
      </button>

      <button className="ArcadeButton" onClick={() => navigate("/")}>
        Home
      </button>

      <Modal isOpen={isScratchOpen} onClose={closeScratch} title="Scratch">
        <Scratch bet={bet} />
      </Modal>
      <Modal isOpen={isBJOpen} onClose={closeBJ} title="Blackjack">
        <Blackjack bet={bet} />
      </Modal>
    </div>
  );
}

export default Arcade;
