import { useCallback, useState } from "react";
import { useMana } from "../../../utils/ManaContext";
import { formatNumberWithCommas } from "../../../utils/Helper";
import Heads from "../../../assets/miscImage/coinHeads.png";
import Tails from "../../../assets/miscImage/coinTails.png";
import mintArcade1 from "../../../assets/miscImage/mintArcade1.png";
import mintArcade2 from "../../../assets/miscImage/mintArcade2.png";
import scarletArcade1 from "../../../assets/miscImage/scarletArcade1.png";
import scarletArcade2 from "../../../assets/miscImage/scarletArcade2.png";
import "./Coin.css";
import { useUtil } from "../../../utils/UtilContext";

function Coin({ bet, setCloseIsDisabled, openBroke }) {
    const { playAudio } = useUtil();
    const [chooseHead, setChooseHead] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [coinChoice, setCoinChoice] = useState(0);
    const [HEADS, TAILS, OTHER] = [18, 36, 38];

    const [coinsFlipped, setCoinsFlipped] = useState(0);
    const [coinHistory, setCoinHistory] = useState([]);
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
        setCloseIsDisabled(true);
        setCoinsFlipped(prev => prev + 1);
        playAudio("coin");
    }, [OTHER, setCloseIsDisabled, bet, mana, openBroke, updateMana, playAudio]);

    const coinLanded = useCallback(() => {
        setIsFlipping(false);
        setCloseIsDisabled(false);
        setCoinHistory(prev => {
            const landed = coinChoice < HEADS ? 0 : coinChoice < TAILS ? 1 : 2;
            prev.unshift(landed);
            if (prev.length > 10) prev.pop();
            return prev;
        })
        if ((coinChoice < HEADS && chooseHead === 0) ||
         (coinChoice < TAILS && coinChoice >= HEADS && chooseHead === 1)) 
         {
            setWinnings(bet * 2);
            updateMana(bet * 2);
            setMintCheers(Math.random() < 0.5);
            playAudio("yippee");
            const sounds = ["great", "lucky", "wow", "yay"];
            playAudio(sounds[Math.floor(Math.random() * sounds.length)]);
        }
        else if (coinChoice >= TAILS && chooseHead === 2) {
            setWinnings(bet * 35);
            updateMana(bet * 35);
            setMintCheers(Math.random() < 0.5);
            playAudio("yippee");
            const sounds = ["ohMyGosh", "amazing", "wooow"];
            playAudio(sounds[Math.floor(Math.random() * sounds.length)]);
        }
    }, [coinChoice, chooseHead, HEADS, TAILS, bet, setCloseIsDisabled, updateMana, playAudio]);

    const getAnimation = useCallback(() => {
        if (isFlipping) {
            if (coinChoice < HEADS) return {animation: "flipHeads 5s forwards"};
            else if (coinChoice < TAILS) return {animation: "flipTails 5s forwards"};
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
        <div className="CoinHistory">
            {
                coinHistory.map((coin, i) => {
                    return <h1 key={i} 
                    style={coin === 0 ? {color: "black"} :
                    coin === 1 ? {color: "red"} : {color: "green"}}>
                        {coin === 0 ? "H" : coin === 1 ? "T" : "N"}
                    </h1>
                })
            }
        </div>
        <div className="CoinDisplay" 
            style={getAnimation()}
            onAnimationEnd={() => {coinLanded()}}
        >
            <img src={Heads} alt="" className="Heads" />
            <img src={Tails} alt="" className="Tails" />
        </div>
        {coinsFlipped > 0 ? <h1>{isFlipping ? 
            `You chose ${chooseHead === 0 ? "Heads" : 
                chooseHead === 1 ? "Tails" : "Neither"}.` : getText()}</h1> :
         <h1>Heads or Tails?</h1>}
        <div className="Controls">
            <button className="CoinButton" onClick={() => {
                if (!isFlipping) {
                    setup();
                    setChooseHead(0);
                }
            }}>Heads</button>
            <button className="CoinButton" onClick={() => {
                if (!isFlipping) {
                    setup();
                    setChooseHead(1);
                }
            }}>Tails</button>
            <button className="CoinButton" onClick={() => {
                if (!isFlipping) {
                    setup();
                    setChooseHead(2);
                }
            }}>Neither</button>
        </div>
        {!isFlipping && coinHistory.length > 0 ? 
        <div className="Winnings">{`Earned ${formatNumberWithCommas(winnings)} mana. 
            Net gain ${formatNumberWithCommas(winnings - bet)} mana.`}</div> : <div className="Winnings"/>}
        <div className="MintArcade" 
            style={winnings >= bet * 2 && mintCheers && !isFlipping ? {animation: "MintCheer 2s ease-out forwards"} : {}}>
            <img src={winnings >= bet * 35 ? mintArcade2 : mintArcade1} alt=""/>
        </div>
            <div className="ScarletArcade" 
            style={winnings >= bet * 2 && !mintCheers && !isFlipping ? {animation: "ScarletCheer 2s ease-out forwards"} : {}}>
            <img src={winnings >= bet * 35 ? scarletArcade2 : scarletArcade1} alt=""/>
        </div>
    </div>
}

export default Coin;