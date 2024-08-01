import { useCallback, useEffect, useState } from "react";
import "./FishingGame.css";
import fishionary from "../../../assets/Fishionary.json";
import { getFishImage } from "../../../utils/Fishionary";
import { useMana } from "../../../utils/ManaContext";
import FishingPlayer from "./FishingPlayer/FishingPlayer";

function FishingGame({ playerList, sendMessage, messagesRecieved }) {
  const { userID, mana, updateMana } = useMana();
  const [fishCaught, setFishCaught] = useState("");
  const [isFishing, setIsFishing] = useState(false);
  const [autoFish, setAutoFish] = useState(false);

  const [messageQueue, setMessageQueue] = useState({});
  const BAITCOST = 10;

  const handleCatchFish = useCallback(() => {
    const FISHES = [[], [], [], [], [], [], []];

    Object.keys(fishionary).forEach((key) => {
      const item = fishionary[key];
      const value = item.value;

      if (value <= 10) {
        FISHES[0].push({ ...item });
      } else if (value > 10 && value <= 25) {
        FISHES[1].push({ ...item });
      } else if (value > 25 && value <= 50) {
        FISHES[2].push({ ...item });
      } else if (value > 50 && value <= 75) {
        FISHES[3].push({ ...item });
      } else if (value > 75 && value <= 99) {
        FISHES[4].push({ ...item });
      } else if (value > 99 && value <= 300) {
        FISHES[5].push({ ...item });
      } else {
        FISHES[6].push({ ...item });
      }
    });
    // Define weights for each category (higher index = lower weight)
    const weights = [600, 300, 80, 20, 5, 1, 0.01];
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

    const getRandomCategory = () => {
      const randomWeight = Math.random() * totalWeight;
      let cumulativeWeight = 0;

      for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (randomWeight <= cumulativeWeight) return i;
      }

      return 0; // Fallback in case of any rounding issues
    };

    const category = getRandomCategory();
    const index = Math.floor(Math.random() * FISHES[category].length);
    const fish = FISHES[category][index];
    setFishCaught(fish);
    sendMessage({ userID, fish });
    updateMana(Number(fish.value));
  }, [userID, updateMana, sendMessage]);

  const handleMessageQueueShift = useCallback((playerID) => {
    setMessageQueue((prev) => {
      const newMessageQueue = JSON.parse(JSON.stringify(prev));
      if (newMessageQueue[playerID]?.length > 0) {
        newMessageQueue[playerID].shift();
        setMessageQueue(newMessageQueue);
      }
      return newMessageQueue;
    });
  }, []);

  useEffect(() => {
    if (isFishing) {
      const startFishingTimeout = setTimeout(() => {
        handleCatchFish();
        setIsFishing(false);
      }, 1000 * 5);

      return () => {
        clearTimeout(startFishingTimeout);
      };
    }
  }, [isFishing, handleCatchFish]);

  useEffect(() => {
    if (autoFish) {
      const autoFishInterval = setInterval(() => {
        if (!isFishing) {
          if (mana >= BAITCOST) {
            updateMana(-BAITCOST);
            setIsFishing(true);
            setFishCaught("");
            if (isFishing) {
              const startFishingTimeout = setTimeout(() => {
                handleCatchFish();
                setIsFishing(false);
              }, 1000 * 5);

              return () => {
                clearTimeout(startFishingTimeout);
              };
            }
          } else {
            setAutoFish(false);
            alert("Not enough mana!");
          }
        }
      }, 1000 * 3);
      return () => {
        clearInterval(autoFishInterval);
      };
    }
  }, [autoFish, isFishing, mana, updateMana, handleCatchFish]);

  useEffect(() => {
    if (messagesRecieved.length > 0) {
      setMessageQueue((prev) => {
        const newMessageQueue = JSON.parse(JSON.stringify(prev));
        const message = messagesRecieved[messagesRecieved.length - 1];
        if (!newMessageQueue[message.message.userID])
          newMessageQueue[message.message.userID] = [];
        newMessageQueue[message.message.userID].push(message);
        return newMessageQueue;
      });
    }
  }, [messagesRecieved]);

  return (
    <div className="FishingGame">
      <div className="FishingDisplay">
        {isFishing ? (
          <img
            src="https://i.pinimg.com/originals/9f/40/34/9f403475da2a117ff5074c7d661753e2.gif"
            alt=""
          />
        ) : fishCaught ? (
          <div className="FishCaughtInfo">
            <img src={getFishImage(fishCaught.id)} alt="" />
            <h1>{fishCaught.name}</h1>
            <h1>{fishCaught.info}</h1>
            <h1>Value: {fishCaught.value}</h1>
          </div>
        ) : (
          <div />
        )}
      </div>
      <button
        onClick={() => {
          if (mana < BAITCOST) alert("Not enough mana!");
          else {
            updateMana(-BAITCOST);
            setIsFishing(true);
            setFishCaught("");
          }
        }}
        disabled={isFishing || autoFish}
      >
        Fish ({BAITCOST} Mana)
      </button>
      <button
        onClick={
          autoFish
            ? () => {
                setAutoFish(false);
              }
            : () => {
                if (mana < BAITCOST) alert("Not enough mana!");
                else {
                  setAutoFish(true);
                  if (!isFishing) updateMana(-BAITCOST);
                  setIsFishing(true);
                  setFishCaught("");
                }
              }
        }
      >
        {autoFish ? "Stop Autofish" : "Start Autofish"}
      </button>
      <div className="PlayersFishing">
        {playerList.map((playerID, i) => {
          if (playerID !== userID)
            return (
              <FishingPlayer
                key={i}
                playerID={playerID}
                messageQueue={messageQueue[playerID]}
                handleMessageQueueShift={handleMessageQueueShift}
              />
            );
          else return null;
        })}
      </div>
    </div>
  );
}

export default FishingGame;
