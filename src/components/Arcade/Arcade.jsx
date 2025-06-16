import { useState } from "react";
import { useMana } from "../../utils/ManaContext";
import "./Arcade.css";
import Modal from "../Modal";
import Scratch from "./Scratch";
import Blackjack from "./Blackjack";
import Slots from "./Slots";
import Coin from "./Coin";
import HomeButton from "../HomeButton";
import LogoutButton from "../LogoutButton";
import { useAudio } from "../../utils/AudioContext";
import scratchImage from "../../assets/miscImage/scratch.png";
import blackjackImage from "../../assets/miscImage/blackjack.png";
import slotsImage from "../../assets/miscImage/slots.png";
import coinsImage from "../../assets/miscImage/coins.png";
import manaCurrencyImg from "../../assets/miscImage/manacurrency.png";

function Arcade() {
  const { mana, updateMana } = useMana();
  const { playAudio } = useAudio();
  const MINBET = 10;
  const MAXBET = 100000;
  const [bet, setBet] = useState(MINBET);

  const [closeIsDisabled, setCloseIsDisabled] = useState(false);

  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [isBJOpen, setIsBJOpen] = useState(false);
  const [isSlotsOpen, setIsSlotsOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isBrokeOpen, setIsBrokeOpen] = useState(false);

  const openScratch = () => setIsScratchOpen(true);
  const closeScratch = () => setIsScratchOpen(false);

  const openBJ = () => setIsBJOpen(true);
  const closeBJ = () => setIsBJOpen(false);

  const openSlots = () => setIsSlotsOpen(true);
  const closeSlots = () => setIsSlotsOpen(false);

  const openCoin = () => setIsCoinOpen(true);
  const closeCoin = () => setIsCoinOpen(false);

  const openDonate = () => setIsDonateOpen(true);
  const closeDonate = () => setIsDonateOpen(false);

  const openBroke = () => setIsBrokeOpen(true);
  const closeBroke = () => setIsBrokeOpen(false);

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
            const formatBet = Math.floor(bet);
            if (formatBet === "") setBet(MINBET);
            else if (formatBet > MAXBET) setBet(MAXBET);
            else if (formatBet < MINBET) setBet(MINBET);
            else setBet(formatBet);
          }}
        />
        <button
          className="BetAll"
          onClick={() => {
            mana > MAXBET
              ? setBet(MAXBET)
              : mana < MINBET
              ? setBet(MINBET)
              : setBet(mana);
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          ALL IN
        </button>
      </div>
      <HomeButton />
      <LogoutButton />
      <div className="ArcadeButtons">
        <button
          onClick={() => {
            if (mana < bet) openBroke();
            else {
              updateMana(-bet);
              openScratch();
            }
          }}
          onMouseEnter={() => playAudio("bubble")}
          style={{ fontSize: "14px", paddingBottom: "2.5rem" }}
        >
          <div className="BubbleReflection" />
          Scratch
          <img src={scratchImage} alt="" className="MenuButtonIcon" />
        </button>
        <button
          onClick={() => {
            if (mana < bet) openBroke();
            else {
              updateMana(-bet);
              openBJ();
            }
          }}
          onMouseEnter={() => playAudio("bubble")}
          style={{ fontSize: "14px", paddingBottom: "2.5rem" }}
        >
          <div className="BubbleReflection" />
          Blackjack
          <img src={blackjackImage} alt="" className="MenuButtonIcon" />
        </button>
        <button
          onClick={() => {
            if (mana < bet) openBroke();
            else {
              updateMana(-bet);
              openSlots();
            }
          }}
          onMouseEnter={() => playAudio("bubble")}
          style={{ fontSize: "14px", paddingBottom: "2.5rem" }}
        >
          <div className="BubbleReflection" />
          Slots
          <img
            src={slotsImage}
            alt=""
            className="MenuButtonIcon"
            style={{ bottom: "0.85rem", left: "0.68rem" }}
          />
        </button>
        <button
          onClick={() => {
            openCoin();
          }}
          onMouseEnter={() => playAudio("bubble")}
          style={{ fontSize: "14px", paddingBottom: "2.5rem" }}
        >
          <div className="BubbleReflection" />
          Coin
          <img
            src={coinsImage}
            alt=""
            className="MenuButtonIcon"
            style={{ bottom: "0.85rem" }}
          />
        </button>
        <button
          onClick={() => {
            if (mana < bet) openBroke();
            else {
              updateMana(-bet);
              openDonate();
            }
          }}
          onMouseEnter={() => playAudio("bubble")}
          style={{ fontSize: "14px", paddingBottom: "2.5rem" }}
        >
          <div className="BubbleReflection" />
          Donate
          <img
            src={manaCurrencyImg}
            alt=""
            className="MenuButtonIcon"
            style={{ width: "2.5rem", bottom: "0.85rem" }}
          />
        </button>
      </div>
      <Modal
        isOpen={isScratchOpen}
        onClose={closeScratch}
        title="Scratch"
        isDisabled={closeIsDisabled}
      >
        <Scratch
          bet={bet}
          setCloseIsDisabled={setCloseIsDisabled}
          openBroke={openBroke}
        />
      </Modal>
      <Modal
        isOpen={isBJOpen}
        onClose={closeBJ}
        title="Blackjack"
        isDisabled={closeIsDisabled}
      >
        <Blackjack
          bet={bet}
          setCloseIsDisabled={setCloseIsDisabled}
          openBroke={openBroke}
        />
      </Modal>
      <Modal
        isOpen={isSlotsOpen}
        onClose={closeSlots}
        title="Slots"
        isDisabled={closeIsDisabled}
      >
        <Slots
          bet={bet}
          setCloseIsDisabled={setCloseIsDisabled}
          openBroke={openBroke}
        />
      </Modal>
      <Modal
        isOpen={isCoinOpen}
        onClose={closeCoin}
        title="Coin Flip"
        isDisabled={closeIsDisabled}
      >
        <Coin
          bet={bet}
          setCloseIsDisabled={setCloseIsDisabled}
          openBroke={openBroke}
        />
      </Modal>
      <Modal isOpen={isDonateOpen} onClose={closeDonate} title="Donation">
        The RNG Gods have blessed you for donating {bet} mana.
      </Modal>
      <Modal isOpen={isBrokeOpen} onClose={closeBroke} title="Not Enough Mana">
        Stop gambling. Get some help.
      </Modal>
    </div>
  );
}

export default Arcade;
