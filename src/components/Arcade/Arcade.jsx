import { useState } from "react";
import { useMana } from "../../utils/ManaContext";
import "./Arcade.css";
import Modal from "../Modal";
import Scratch from "./Scratch";
import Blackjack from "./Blackjack";
import { useNavigate } from "react-router-dom";
import Slots from "./Slots";

function Arcade() {
  const { mana, updateMana } = useMana();
  const MINBET = 5;
  const [bet, setBet] = useState(MINBET);

  const [closeIsDisabled, setCloseIsDisabled] = useState(false);

  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [isBJOpen, setIsBJOpen] = useState(false);
  const [isSlotsOpen, setIsSlotsOpen] = useState(false);

  const openScratch = () => setIsScratchOpen(true);
  const closeScratch = () => setIsScratchOpen(false);

  const openBJ = () => setIsBJOpen(true);
  const closeBJ = () => setIsBJOpen(false);

  const openSlots = () => setIsSlotsOpen(true);
  const closeSlots = () => setIsSlotsOpen(false);

  const navigate = useNavigate();

  return (
    <div className="Arcade">
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
        Blackjack
      </button>
      <button
        className="ArcadeButton"
        onClick={() => {
          if (bet < MINBET) alert(`Minimum bet is ${MINBET} mana!`);
          else if (mana < bet) alert("Not enough mana!");
          else {
            updateMana(-bet);
            openSlots();
          }
        }}
      >
        Slots
      </button>

      <button className="ArcadeButton" onClick={() => navigate("/")}>
        Home
      </button>

      <Modal
        isOpen={isScratchOpen}
        onClose={closeScratch}
        title="Scratch"
        isDisabled={closeIsDisabled}
      >
        <Scratch bet={bet} setCloseIsDisabled={setCloseIsDisabled} />
      </Modal>
      <Modal
        isOpen={isBJOpen}
        onClose={closeBJ}
        title="Blackjack"
        isDisabled={closeIsDisabled}
      >
        <Blackjack bet={bet} setCloseIsDisabled={setCloseIsDisabled} />
      </Modal>
      <Modal
        isOpen={isSlotsOpen}
        onClose={closeSlots}
        title="Slots"
        isDisabled={closeIsDisabled}
      >
        <Slots bet={bet} setCloseIsDisabled={setCloseIsDisabled} />
      </Modal>
    </div>
  );
}

export default Arcade;
