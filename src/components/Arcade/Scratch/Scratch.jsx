import { useCallback, useEffect, useState } from "react";
import "./Scratch.css";
import { useMana } from "../../../utils/ManaContext";
import { formatNumberWithCommas } from "../../../utils/Helper";
import mintArcade1 from "../../../assets/miscImage/mintArcade1.png";
import mintArcade2 from "../../../assets/miscImage/mintArcade2.png";
import scarletArcade1 from "../../../assets/miscImage/scarletArcade1.png";
import scarletArcade2 from "../../../assets/miscImage/scarletArcade2.png";
import yippeeMP3 from "../../../assets/audio/yippee.mp3";

function Scratch({ bet, setCloseIsDisabled, openBroke }) {
  const [range, setRange] = useState([0]);
  const [numbers, setNumbers] = useState(
    Array.from({ length: 9 }, (_, i) => i).fill(0)
  );
  const [winnings, setWinnings] = useState(0);
  const { mana, updateMana } = useMana();
  const [mintCheers, setMintCheers] = useState(true);

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

      const increment = Math.floor(0.1 * (3 * median));
      for (let i = 2; i >= 0; i--) newRange[i] = newRange[i + 1] - increment;
      for (let i = 3; i < newRange.length; i++)
        newRange[i] = newRange[i - 1] + increment;

      return newRange;
    }
    setNumbers(Array.from({ length: 9 }, (_, i) => i).fill(0));
    setRange(generateRange(bet));
    setWinnings(0);
    setCloseIsDisabled(true);
  }, [bet, setCloseIsDisabled]);

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

      updateMana(totalEarned);
      setWinnings(totalEarned);
      setCloseIsDisabled(false);

      if (totalEarned >= bet * 1.5) {
        setMintCheers(Math.random() < 0.5);
        const yippeeAudio = new Audio(yippeeMP3);
        yippeeAudio.volume = 0.25;
        yippeeAudio.play();
                      
        return () => {
          yippeeAudio.pause();
          yippeeAudio.currentTime = 0;
        };
      }
    }

    if (!numbers.includes(0)) calculateWinnings();
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
          {`Match three and each additional number beyond the third gets added to total winnings!`}
        </div>
      ) : (
        <div className="Winnings">{`Earned ${formatNumberWithCommas(
          winnings
        )} mana. Net gain ${formatNumberWithCommas(
          winnings - bet
        )} mana.`}</div>
      )}
      {numbers.includes(0) ? (
      <button
        className="ResetGame"
        onClick={() => {
          const newNumbers = [...numbers];
          newNumbers.forEach((value, i) => {
            if (value === 0) newNumbers[i] = range[Math.floor(Math.random() * range.length)]
          })
          setNumbers(newNumbers);
        }}
        disabled={!numbers.includes(0)}
      >
        Scratch All
      </button>
      ) : (
        <button
          className="ResetGame"
          onClick={() => {
            if (mana < bet) openBroke();
            else {
              updateMana(-bet);
              setup();
            }
          }}
        >
          Reset
        </button>
      )}
      <div className="MintArcade" 
        style={winnings >= bet * 1.5 && mintCheers && !numbers.includes(0) ? {animation: "MintCheer 2s ease-out forwards"} : {}}>
        <img src={winnings > bet * 20 ? mintArcade2 : mintArcade1} alt=""/>
      </div>
      <div className="ScarletArcade" 
        style={winnings >= bet * 1.5 && !mintCheers && !numbers.includes(0) ? {animation: "ScarletCheer 2s ease-out forwards"} : {}}>
        <img src={winnings > bet * 20 ? scarletArcade2 : scarletArcade1} alt=""/>
      </div>
    </div>
  );
}

export default Scratch;
