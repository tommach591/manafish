import { useCallback, useEffect, useState } from "react";
import "./Slots.css";
import { useMana } from "../../../utils/AccountContext";

function Slots({ bet }) {
  const { mana, updateMana } = useMana();
  const [slots, setSlots] = useState(["", "", "", "", ""]);
  const [winnings, setWinnings] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const SYMBOLS = ["💩", "🌼", "🌻", "🥀", "🌷", "☂️", "💧"];

  const setup = useCallback(() => {
    setSlots(["", "", "", "", ""]);
    setWinnings(0);
    setSpinning(false);
  }, []);

  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  const calculateWinnings = (slots) => {
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
      else if (count === 3) winnings += Math.floor(bet * 1.5);
      else if (count === 2) winnings += Math.floor(bet * 0.5);
    });

    return winnings;
  };

  const handleSpin = () => {
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
          }
        }, (i + 1) * 333) // Stops each slot one second apart
      );
    }

    return () => spinTimeouts.forEach(clearTimeout); // Clear timeouts on cleanup
  };

  useEffect(() => {
    if (!slots.includes("") && winnings > 0) updateMana(winnings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, winnings]);

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
      <button
        className="SpinButton"
        onClick={() => handleSpin()}
        disabled={spinning}
      >
        Stop
      </button>

      {spinning && !slots.includes("") ? (
        <div className="Winnings">{`Earned ${winnings} mana. Net gain ${
          winnings - bet
        } mana.`}</div>
      ) : (
        <div />
      )}
      <div className="Winnings">
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
          <h1 className="Multiplier">{`1.5x`}</h1>
          <h1 className="Condition">{`Any 2`}</h1>
          <h1 className="Multiplier">{`0.5x`}</h1>
        </div>
      </div>
      <div className="Warning">
        Closing before finishing will not reward you of your winnings.
      </div>
      {spinning && !slots.includes("") ? (
        <button
          className="ResetGame"
          onClick={() => {
            if (mana < bet) alert("Not enough mana!");
            else {
              updateMana(-bet);
              setup();
            }
          }}
        >
          Reset
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}

export default Slots;
