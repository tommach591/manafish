import { useCallback, useEffect, useMemo, useState } from "react";
import "./Slots.css";
import { useMana } from "../../../utils/ManaContext";
import { formatNumberWithCommas } from "../../../utils/Helper";
import mintArcade1 from "../../../assets/miscImage/mintArcade1.png";
import mintArcade2 from "../../../assets/miscImage/mintArcade2.png";
import scarletArcade1 from "../../../assets/miscImage/scarletArcade1.png";
import scarletArcade2 from "../../../assets/miscImage/scarletArcade2.png";
import { useUtil } from "../../../utils/UtilContext";

function Slots({ bet, setCloseIsDisabled, openBroke }) {
  const { mana, updateMana } = useMana();
  const { playAudio } = useUtil();
  const [slots, setSlots] = useState(["", "", "", "", ""]);
  const [mintCheers, setMintCheers] = useState(true);
  const [winnings, setWinnings] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);

  const SYMBOLS = useMemo(() => ["💩", "☁️", "🌈", "⭐", "☂️", "💧"], []);

  const setup = useCallback(() => {
    setSlots(["", "", "", "", ""]);
    setWinnings(0);
    setSpinning(false);
    setCloseIsDisabled(true);
  }, [setCloseIsDisabled]);

  const getRandomSymbol = useCallback(() => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }, [SYMBOLS]);

  const calculateWinnings = useCallback(
    (slots) => {
      const counts = {};
      slots.forEach((symbol) => {
        counts[symbol] = (counts[symbol] || 0) + 1;
      });

      let winnings = 0;
      Object.keys(counts).forEach((symbol) => {
        const count = counts[symbol];
        if (count === 5 && symbol === "💧") winnings += bet * 200;
        else if (count === 5 && symbol === "☂️") winnings += bet * 150;
        else if (count === 5) winnings += bet * 100;
        else if (count === 4 && symbol === "💧") winnings += bet * 20;
        else if (count === 4 && symbol === "☂️") winnings += bet * 15;
        else if (count === 4) winnings += bet * 10;
        else if (count === 3 && symbol === "💧") winnings += bet * 3;
        else if (count === 3 && symbol === "☂️") winnings += bet * 2.5;
        else if (count === 3) winnings += Math.floor(bet * 1.5);
        else if (count === 2) winnings += Math.floor(bet * 0.25);
      });

      return Math.floor(winnings);
    },
    [bet]
  );

  const handleSpin = useCallback(() => {
    const newSlots = [...slots];
    setSpinning(true);
    let spinTimeouts = [];
    for (let i = 0; i < newSlots.length; i++) {
      spinTimeouts.push(
        setTimeout(() => {
          newSlots[i] = getRandomSymbol();
          setSlots([...newSlots]);
          if (i === newSlots.length - 1) {
            const newWinnings = calculateWinnings(newSlots, bet);
            
            setWinnings(newWinnings);
            setCloseIsDisabled(false);
          }
          playAudio("slots");
        }, (i + 1) * 333) // Stops each slot one second apart
      );
    }

    return () => spinTimeouts.forEach(clearTimeout); // Clear timeouts on cleanup
  }, [bet, calculateWinnings, getRandomSymbol, setCloseIsDisabled, slots, playAudio]);

  useEffect(() => {
    if (!slots.includes("") && winnings > 0) { 
      updateMana(winnings);
      setMintCheers(Math.random() < 0.5);
      
      if (winnings >= bet * 15) {
        playAudio("yippee");
        const sounds = ["ohMyGosh", "amazing", "wooow"];
        playAudio(sounds[Math.floor(Math.random() * sounds.length)]);
      }
      else if (winnings >= bet * 2.5) {
        playAudio("yippee");
        const sounds = ["great", "lucky", "wow", "yay", "niceHit"];
        playAudio(sounds[Math.floor(Math.random() * sounds.length)]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, winnings, playAudio]);

  useEffect(() => {
    setCloseIsDisabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoSpin) {
      const autoSpinInterval = setInterval(() => {
        if (mana >= bet) {
          if (spinning && !slots.includes("")) {
            updateMana(-bet);
            setup();
          } else if (!spinning) {
            const startSpinTimeout = setTimeout(() => {
              handleSpin();
            }, 1000);

            return () => {
              clearTimeout(startSpinTimeout);
            };
          }
        } else {
          setAutoSpin(false);
          openBroke();
        }
      }, (winnings >= bet * 2.5) ? 2750 : 1200);

      return () => {
        clearInterval(autoSpinInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, autoSpin, bet, handleSpin, mana, setup, spinning, updateMana]);

  return (
    <div className="SlotsGame">
      <div className="Slots">
        {slots.map((slot, i) => (
          <div key={i} className="Slot">
            {slots[i] !== "" ? (
              <h1>{slot}</h1>
            ) : (
              <div className="Strip">
                {[...SYMBOLS, SYMBOLS[0]].map((val, i) => (
                  <h1 key={i}>{val}</h1>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {!spinning && slots.includes("") ? (
        <button
          className="SpinButton"
          onClick={() => {
            handleSpin();
          }}
          disabled={spinning || autoSpin}
        >
          {slots[0] === "" ? "Stop" : "Reset"}
        </button>
      ) : (
        <button
          className="SpinButton"
          onClick={() => {
            if (mana < bet) openBroke();
            else {
              updateMana(-bet);
              setup();
            }
          }}
          disabled={slots.includes("")}
        >
          Reset
        </button>
      )}
      <button
        className="SpinButton"
        onClick={() => {
          if (autoSpin) setAutoSpin(false);
          else {
            if (mana < bet) openBroke();
            else {
              setAutoSpin(true);
              if (spinning && !slots.includes("")) {
                updateMana(-bet);
                setup();
              }
              if (!spinning) handleSpin();
            }
          }
        }}
      >
        {autoSpin ? "Stop Auto Spin" : "Start Auto Spin"}
      </button>

      {spinning && !slots.includes("") ? (
        <div className="Winnings">{`Earned ${formatNumberWithCommas(
          winnings
        )} mana. Net gain ${formatNumberWithCommas(
          winnings - bet
        )} mana.`}</div>
      ) : (
        <div className="Winnings" />
      )}
      <div className="SlotChart">
        <h1 className="Condition">{`Conditions`}</h1>
        <h1 className="Multiplier">{`Bet Multiplier`}</h1>
        <h1 className="Condition">{`5 💧`}</h1>
        <h1 className="Multiplier">{`200.00x`}</h1>
        <h1 className="Condition">{`5 ☂️`}</h1>
        <h1 className="Multiplier">{`150.00x`}</h1>
        <h1 className="Condition">{`Any 5`}</h1>
        <h1 className="Multiplier">{`100.00x`}</h1>
        <h1 className="Condition">{`4 💧`}</h1>
        <h1 className="Multiplier">{`20.00x`}</h1>
        <h1 className="Condition">{`4 ☂️`}</h1>
        <h1 className="Multiplier">{`15.00x`}</h1>
        <h1 className="Condition">{`Any 4`}</h1>
        <h1 className="Multiplier">{`10.00x`}</h1>
        <h1 className="Condition">{`3 💧`}</h1>
        <h1 className="Multiplier">{`3.00x`}</h1>
        <h1 className="Condition">{`3 ☂️`}</h1>
        <h1 className="Multiplier">{`2.50x`}</h1>
        <h1 className="Condition">{`Any 3`}</h1>
        <h1 className="Multiplier">{`1.50x`}</h1>
        <h1 className="Condition">{`Any 2`}</h1>
        <h1 className="Multiplier">{`0.25x`}</h1>
      </div>
      <div className="MintArcade" 
        style={winnings >= bet * 2.5 && mintCheers ? {animation: "MintCheer 2s ease-out forwards"} : {}}>
        <img src={winnings >= bet * 15 ? mintArcade2 : mintArcade1} alt=""/>
      </div>
      <div className="ScarletArcade" 
        style={winnings >= bet * 2.5 && !mintCheers ? {animation: "ScarletCheer 2s ease-out forwards"} : {}}>
        <img src={winnings >= bet * 15 ? scarletArcade2 : scarletArcade1} alt=""/>
      </div>
    </div>
  );
}

export default Slots;
