import { useCallback, useEffect, useState } from "react";
import "./Scratch.css";
import { useMana } from "../../../utils/AccountContext";

function Scratch({ bet }) {
  const [range, setRange] = useState([0]);
  const [numbers, setNumbers] = useState(
    Array.from({ length: 9 }, (_, i) => i).fill(0)
  );
  const [winnings, setWinnings] = useState(0);
  const { mana, updateMana } = useMana();

  const COLORS = [
    "#ffe8e8",
    "#fff1e8",
    "#ffffe8",
    "#edffe8",
    "#e8feff",
    "#e8eeff",
    "#f4e8ff",
  ];

  const setup = useCallback(() => {
    function generateRange(median) {
      median = Number(median);
      const newRange = new Array(7);
      newRange[3] = median;

      const increment = Math.floor(0.1 * (2 * median));
      for (let i = 2; i >= 0; i--) newRange[i] = newRange[i + 1] - increment;
      for (let i = 3; i < newRange.length; i++)
        newRange[i] = newRange[i - 1] + increment;

      return newRange;
    }
    setNumbers(Array.from({ length: 9 }, (_, i) => i).fill(0));
    setRange(generateRange(bet));
    setWinnings(0);
  }, [bet]);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    function calculateWinnings() {
      const MINMATCHING = 3;
      const counts = {};
      numbers.forEach((num) => {
        counts[num] = (counts[num] || 0) + 1;
      });

      let totalEarned = 0;
      Object.keys(counts).forEach((num) => {
        const count = counts[num];
        if (count > MINMATCHING) {
          totalEarned += Number(num) + Number(num) * (count - MINMATCHING);
        } else if (count === MINMATCHING) {
          totalEarned += Number(num);
        }
      });

      if (totalEarned > 0 && !numbers.includes(0)) updateMana(totalEarned);
      setWinnings(totalEarned);
    }

    calculateWinnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numbers]);

  return (
    <div className="Scratch">
      <div className="ScratchGrid">
        {numbers.map((val, i) => (
          <div
            className="Square"
            key={i}
            onClick={() => {
              if (val === 0)
                setNumbers((prevNumbers) => {
                  prevNumbers[i] =
                    range[Math.floor(Math.random() * range.length)];
                  return [...prevNumbers];
                });
            }}
            style={{ backgroundColor: COLORS[range.indexOf(val)] }}
          >
            <div
              className="Ink"
              style={
                val !== 0
                  ? { animation: `lowerOpacity ${0.1}s forwards linear` }
                  : {}
              }
            />
            <h1>{val}</h1>
          </div>
        ))}
      </div>
      {numbers.includes(0) ? (
        <div className="Winnings">
          {`Match Three! Each additional number beyond the third gets added to total winnings!`}
        </div>
      ) : (
        <div className="Winnings">{`Earned ${winnings} mana. Net gain ${
          winnings - bet
        } mana.`}</div>
      )}
      {numbers.includes(0) ? (
        <div />
      ) : (
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
      )}
      <div className="Warning">
        Closing before finishing will not reward you of your winnings.
      </div>
    </div>
  );
}

export default Scratch;
