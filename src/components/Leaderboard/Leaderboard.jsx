import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";
import { useEffect, useState } from "react";
import { getAllAccount } from "../../utils/Account";
import { getAllBalance } from "../../utils/Balance";
import { formatCompactNumber } from "../../utils/Helper";
import { useMana } from "../../utils/ManaContext";
import manaCurrencyImg from "../../assets/miscImage/manacurrency.png";

function Leaderboard() {
  const navigate = useNavigate();
  const { userID } = useMana();
  const [playerList, setPlayerList] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accounts, balances] = await Promise.all([
          getAllAccount(),
          getAllBalance(),
        ]);
    
        const accountMap = Object.fromEntries(accounts.map(account => [account._id, account]));
        const balanceMap = Object.fromEntries(balances.map(balance => [balance.userID, balance]));
    
        const allUserIDs = new Set([
          ...accounts.map(account => account._id),
          ...balances.map(balance => balance.userID),
        ]);
    
        const mergedPlayers = Array.from(allUserIDs).map(userID => ({
          ...accountMap[userID],
          ...balanceMap[userID],
        })).sort((a, b) => (b.mana || 0) - (a.mana || 0));

        setPlayerList(mergedPlayers);
        setPlayerIndex(mergedPlayers.findIndex(player => player.userID === userID));
      } catch (error) {
        console.error("Failed to fetch accounts or balances:", error);
      }
    };
    
    fetchData();
  }, [userID]);

  return <div className="Leaderboard">
    <button
      className="HomeButton"
      onClick={() => {
        navigate("/");
      }}
    >
      <div className="BubbleReflection" />
      <img
        src="https://api.iconify.design/ic:round-home.svg?color=%2332323c"
        alt=""
      />
    </button>
    <div className="Rankings">
    <h1 className="RankingsTitle">Rankings</h1>
      {playerList.length > 0 ? <div className="PlayerRank"
            style={playerIndex === 0 ? {background: "rgb(255, 230, 160)"} :
            playerIndex === 1 ? {background: "rgb(214, 217, 219)"} : 
            playerIndex === 2 ? {background: "rgb(197, 166, 157)"} : 
            {background: "none"}
          }>
        <img className="PlayerRankMedal" src={
          playerIndex === 0 ? "https://api.iconify.design/fluent-emoji:1st-place-medal.svg" :
          playerIndex === 1 ? "https://api.iconify.design/fluent-emoji:2nd-place-medal.svg" : 
          playerIndex === 2 ? "https://api.iconify.design/fluent-emoji:3rd-place-medal.svg" : ""
          } alt=""/>
        <h1 className="PlayerRankPlacement">#{playerIndex+1}</h1>
        <h1 className="PlayerRankName">{playerList[playerIndex].username}</h1>
        <h1 className="PlayerRankMana">{formatCompactNumber(playerList[playerIndex].mana)}</h1>
      </div> : <div/>}
      <div className="RankingsDivider" />
      {
        playerList.slice(0, 10).map((player, i) => {
          return <div className="PlayerRank" key={i} 
              style={i === 0 ? {background: "rgb(255, 230, 160)"} :
              i === 1 ? {background: "rgb(214, 217, 219)"} : 
              i === 2 ? {background: "rgb(197, 166, 157)"} : 
              {background: "none"}
            }>
            <img className="PlayerRankMedal" src={
              i === 0 ? "https://api.iconify.design/fluent-emoji:1st-place-medal.svg" :
              i === 1 ? "https://api.iconify.design/fluent-emoji:2nd-place-medal.svg" : 
              i === 2 ? "https://api.iconify.design/fluent-emoji:3rd-place-medal.svg" : ""
              } alt=""/>
            <h1 className="PlayerRankPlacement">#{i+1}</h1>
            <h1 className="PlayerRankName">{player.username}</h1>
            <h1 className="PlayerRankMana">{formatCompactNumber(player.mana)}
              <img className="CurrencyIcon" src={manaCurrencyImg} alt=""/>
            </h1>
          </div>
        })
      }
    </div>
  </div>;
}

export default Leaderboard;