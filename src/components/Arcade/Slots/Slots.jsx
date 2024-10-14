import { useCallback, useEffect, useMemo, useState } from "react";
import "./Slots.css";
import { useMana } from "../../../utils/ManaContext";
import { formatNumberWithCommas } from "../../../utils/Helper";
import audioMP3 from "../../../assets/audio/slot.mp3";

function Slots({ bet, setCloseIsDisabled }) {
  const { mana, updateMana } = useMana();
  const [slots, setSlots] = useState(["", "", "", "", ""]);
  const [winnings, setWinnings] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);

  const SYMBOLS = useMemo(() => ["💩", "🌼", "🌻", "🥀", "🌷", "☂️", "💧"], []);

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
        if (count === 5 && symbol === "💧") winnings += bet * 150;
        else if (count === 5 && symbol === "☂️") winnings += bet * 100;
        else if (count === 5) winnings += bet * 50;
        else if (count === 4 && symbol === "💧") winnings += bet * 20;
        else if (count === 4 && symbol === "☂️") winnings += bet * 15;
        else if (count === 4) winnings += bet * 10;
        else if (count === 3 && symbol === "💧") winnings += bet * 5;
        else if (count === 3 && symbol === "☂️") winnings += bet * 4;
        else if (count === 3) winnings += Math.floor(bet * 1.25);
        else if (count === 2) winnings += Math.floor(bet * 0.25);
      });

      return winnings;
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
          const slotAudio = new Audio(audioMP3);
          slotAudio.play();

          return () => {
            slotAudio.pause();
            slotAudio.currentTime = 0;
          };
        }, (i + 1) * 333) // Stops each slot one second apart
      );
    }

    return () => spinTimeouts.forEach(clearTimeout); // Clear timeouts on cleanup
  }, [bet, calculateWinnings, getRandomSymbol, setCloseIsDisabled, slots]);

  useEffect(() => {
    if (!slots.includes("") && winnings > 0) updateMana(winnings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, winnings]);

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
          alert("Not enough mana!");
        }
      }, 1250);

      return () => {
        clearInterval(autoSpinInterval);
      };
    }
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
            if (mana < bet) alert("Not enough mana!");
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
            if (mana < bet) alert("Not enough mana!");
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
        <h1 className="Multiplier">{`150.0x`}</h1>
        <h1 className="Condition">{`5 ☂️`}</h1>
        <h1 className="Multiplier">{`100.0x`}</h1>
        <h1 className="Condition">{`Any 5`}</h1>
        <h1 className="Multiplier">{`50.0x`}</h1>
        <h1 className="Condition">{`4 💧`}</h1>
        <h1 className="Multiplier">{`20.0x`}</h1>
        <h1 className="Condition">{`4 ☂️`}</h1>
        <h1 className="Multiplier">{`15.0x`}</h1>
        <h1 className="Condition">{`Any 4`}</h1>
        <h1 className="Multiplier">{`10.0x`}</h1>
        <h1 className="Condition">{`3 💧`}</h1>
        <h1 className="Multiplier">{`5.0x`}</h1>
        <h1 className="Condition">{`3 ☂️`}</h1>
        <h1 className="Multiplier">{`4.0x`}</h1>
        <h1 className="Condition">{`Any 3`}</h1>
        <h1 className="Multiplier">{`1.25x`}</h1>
        <h1 className="Condition">{`Any 2`}</h1>
        <h1 className="Multiplier">{`0.25x`}</h1>
      </div>
    </div>
  );
}

export default Slots;
