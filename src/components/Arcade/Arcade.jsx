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
  const MAXBET = 500000;
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
          value={bet}
          onChange={(event) => {
            setBet(event.currentTarget.value);
          }}
          onBlur={() => {
            if (bet === "") setBet(MINBET);
            else if (bet > MAXBET) setBet(MAXBET);
            else if (bet < MINBET) setBet(MINBET);
            setBet(Math.floor(bet));
          }}
        />
      </div>
      <button className="HomeButton" onClick={() => navigate("/")}>
        <div className="BubbleReflection" />
        <img
          src="https://api.iconify.design/ic:round-home.svg?color=%2332323c"
          alt=""
        />
      </button>
      <div className="ArcadeButtons">
        <button
          onClick={() => {
            if (mana < bet) alert("Not enough mana!");
            else {
              updateMana(-bet);
              openScratch();
            }
          }}
        >
          <div className="BubbleReflection" />
          Scratch
        </button>
        <button
          onClick={() => {
            if (mana < bet) alert("Not enough mana!");
            else {
              updateMana(-bet);
              openBJ();
            }
          }}
        >
          <div className="BubbleReflection" />
          Blackjack
        </button>
        <button
          onClick={() => {
            if (mana < bet) alert("Not enough mana!");
            else {
              updateMana(-bet);
              openSlots();
            }
          }}
        >
          <div className="BubbleReflection" />
          Slots
        </button>
      </div>
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
