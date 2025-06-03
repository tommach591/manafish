import { useCallback, useState } from "react";
import { useMana } from "../../../utils/ManaContext";
import { formatNumberWithCommas } from "../../../utils/Helper";
import Heads from "../../../assets/miscImage/coinHeads.png";
import Tails from "../../../assets/miscImage/coinTails.png";
import mintArcade1 from "../../../assets/miscImage/mintArcade1.png";
import mintArcade2 from "../../../assets/miscImage/mintArcade2.png";
import scarletArcade1 from "../../../assets/miscImage/scarletArcade1.png";
import scarletArcade2 from "../../../assets/miscImage/scarletArcade2.png";
import yippeeMP3 from "../../../assets/audio/yippee.mp3";
import "./Coin.css";

function Coin({ bet, setCloseIsDisabled, openBroke }) {
    const [chooseHead, setChooseHead] = useState(true);
    const [isFlipping, setIsFlipping] = useState(false);
    const [coinChoice, setCoinChoice] = useState(0);
    const [HEADS, TAILS, OTHER] = [18, 36, 38];

    const [coinsFlipped, setCoinsFlipped] = useState(0);
    const [winnings, setWinnings] = useState(0);
    const { mana, updateMana } = useMana();
    const [mintCheers, setMintCheers] = useState(true);

    const setup = useCallback(() => {
        if (mana < bet) {
            openBroke();
            return;
        }
        updateMana(-bet);
        setIsFlipping(true);
        setCoinChoice(Math.floor(Math.random() * OTHER));
        setWinnings(0);
        setCoinsFlipped(prev => prev + 1);
        setCloseIsDisabled(true);
    }, [OTHER, setCloseIsDisabled, bet, mana, openBroke, updateMana]);

    const coinLanded = useCallback(() => {
        setIsFlipping(false);
        setCloseIsDisabled(false);
        if ((coinChoice < HEADS && chooseHead) ||
         (coinChoice < TAILS && coinChoice >= HEADS && !chooseHead)) 
         {
            setWinnings(bet * 2);
            updateMana(bet * 2);
            setMintCheers(Math.random() < 0.5);
            const yippeeAudio = new Audio(yippeeMP3);
            yippeeAudio.volume = 0.25;
            yippeeAudio.play();
                        
            return () => {
                yippeeAudio.pause();
                yippeeAudio.currentTime = 0;
            };
        }
    }, [coinChoice, chooseHead, HEADS, TAILS, bet, setCloseIsDisabled, updateMana]);

    const getAnimation = useCallback(() => {
        if (isFlipping) {
            if (coinChoice < HEADS) return {animation: "flipHeads 7s forwards"};
            else if (coinChoice < TAILS) return {animation: "flipTails 7s forwards"};
            else return {animation: "flipGone 5s forwards"};
        }
        else {
            if (coinChoice < HEADS) return {transform: "rotateX(0deg)"}
            else if (coinChoice < TAILS) return {transform: "rotateX(180deg)"}
            else return {opacity: 0}
        }
    }, [isFlipping, coinChoice, HEADS, TAILS]);

    const getText = useCallback(() => {
        if (coinChoice < HEADS) return `The coin landed on Heads!`;
        else if (coinChoice < TAILS) return `The coin landed on Tails!`;
        else return `Oops, flipped the coin too hard!`;
    }, [coinChoice, HEADS, TAILS]);

    return <div className="Coin">
        <div className="CoinDisplay" 
            style={getAnimation()}
            onAnimationEnd={() => {coinLanded()}}
        >
            <img src={Heads} alt="" className="Heads" />
            <img src={Tails} alt="" className="Tails" />
        </div>
        {coinsFlipped > 0 ? <h1>{isFlipping ? `You chose ${chooseHead ? "Heads" : "Tails"}.` : getText()}</h1> :
         <h1>Heads or Tails?</h1>}
        <div className="Controls">
            <button className="CoinButton" onClick={() => {
                if (!isFlipping) {
                    setup();
                    setChooseHead(true);
                }
            }}>Heads</button>
            <button className="CoinButton" onClick={() => {
                if (!isFlipping) {
                    setup();
                    setChooseHead(false);
                }
            }}>Tails</button>
        </div>
        {!isFlipping && coinsFlipped > 0 ? 
        <div className="Winnings">{`Earned ${formatNumberWithCommas(winnings)} mana. 
            Net gain ${formatNumberWithCommas(winnings - bet)} mana.`}</div> : <div className="Winnings"/>}
        <div className="MintArcade" 
            style={winnings >= bet * 1.5 && mintCheers && !isFlipping ? {animation: "MintCheer 2s ease-out forwards"} : {}}>
            <img src={winnings > bet * 20 ? mintArcade2 : mintArcade1} alt=""/>
        </div>
            <div className="ScarletArcade" 
            style={winnings >= bet * 1.5 && !mintCheers && !isFlipping ? {animation: "ScarletCheer 2s ease-out forwards"} : {}}>
            <img src={winnings > bet * 20 ? scarletArcade2 : scarletArcade1} alt=""/>
        </div>
    </div>
}

export default Coin;