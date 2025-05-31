import { useCallback, useEffect, useState } from "react";
import "./FishingGame.css";
import fishionary from "../../../assets/Fishionary.json";
import { getFishImage } from "../../../utils/Fishionary";
import { useMana } from "../../../utils/ManaContext";
import FishingPlayer from "./FishingPlayer/FishingPlayer";
import { useFish } from "../../../utils/FishContext";
import Modal from "../../Modal";

function FishingGame({
  playerList,
  sendMessage,
  messagesRecieved,
  setCloseIsDisabled,
}) {
  const { userID, mana, updateMana } = useMana();
  const { fishCaught, addFish } = useFish();
  const [fishPrize, setFishPrize] = useState("");
  const [isFishing, setIsFishing] = useState(false);
  const [autoFish, setAutoFish] = useState(false);

  const [messageQueue, setMessageQueue] = useState({});
  const BAITCOST = 10;
  const FISHINGTIME = 1000 * 7;

  const [isBrokeOpen, setIsBrokeOpen] = useState(false);
  const openBroke = () => setIsBrokeOpen(true);
  const closeBroke = () => setIsBrokeOpen(false);

  const handleIsFishing = useCallback(
    (value) => {
      setIsFishing(value);
      setCloseIsDisabled(value);
    },
    [setCloseIsDisabled]
  );

  const handleCatchFish = useCallback(() => {
    const FISHES = [[], [], [], [], [], [], []];
    const [COMMON, UNCOMMON, RARE, EPIC, UNIQUE, LEGENDARY] = [10, 25, 50, 75, 300, 5000]

    Object.keys(fishionary).forEach((key) => {
      const item = fishionary[key];
      const value = item.value;

      if (value <= COMMON) {
        FISHES[0].push({ ...item });
      } else if (value > COMMON && value <= UNCOMMON) {
        FISHES[1].push({ ...item });
      } else if (value > UNCOMMON && value <= RARE) {
        FISHES[2].push({ ...item });
      } else if (value > RARE && value <= EPIC) {
        FISHES[3].push({ ...item });
      } else if (value > EPIC && value <= UNIQUE) {
        FISHES[4].push({ ...item });
      } else if (value > UNIQUE && value <= LEGENDARY) {
        FISHES[5].push({ ...item });
      } else {
        FISHES[6].push({ ...item });
      }
    });

    // Define weights for each category (higher index = lower weight)
    const weights = [1100000000, 700000000, 200000000, 20000000, 1000000, 100000, 1000];
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
    setFishPrize(fish);
    addFish(fish.id);
    sendMessage({ userID, fish });
    updateMana(Number(fish.value));
  }, [userID, updateMana, sendMessage, addFish]);

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
        handleIsFishing(false);
      }, FISHINGTIME);

      return () => {
        clearTimeout(startFishingTimeout);
      };
    }
  }, [FISHINGTIME, isFishing, handleCatchFish, handleIsFishing]);

  useEffect(() => {
    if (autoFish) {
      const autoFishInterval = setInterval(() => {
        if (!isFishing) {
          if (mana >= BAITCOST) {
            updateMana(-BAITCOST);
            handleIsFishing(true);
            setFishPrize("");
            if (isFishing) {
              const startFishingTimeout = setTimeout(() => {
                handleCatchFish();
                handleIsFishing(false);
              }, FISHINGTIME);

              return () => {
                clearTimeout(startFishingTimeout);
              };
            }
          } else {
            setAutoFish(false);
            openBroke();
          }
        }
      }, 1000 * 4);
      return () => {
        clearInterval(autoFishInterval);
      };
    }
  }, [
    FISHINGTIME,
    autoFish,
    isFishing,
    mana,
    updateMana,
    handleCatchFish,
    handleIsFishing,
  ]);

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
        ) : fishPrize ? (
          <div className="FishCaughtInfo">
            <img src={getFishImage(fishPrize.id)} alt="" />
            <h1 className="NewFishCaught">
              {fishCaught[fishPrize.id] === 1 ? "NEW!!!" : ""}
            </h1>
            <h1>{fishPrize.name}</h1>
            <h2>{fishPrize.info}</h2>
            <h3>Value: {fishPrize.value}</h3>
            <h3>Caught: {fishCaught[fishPrize.id]}</h3>
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="FishingButtons">
        <button
          onClick={() => {
            if (mana < BAITCOST) openBroke();
            else {
              updateMana(-BAITCOST);
              handleIsFishing(true);
              setFishPrize("");
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
                  if (mana < BAITCOST) openBroke();
                  else {
                    setAutoFish(true);
                    if (!isFishing) updateMana(-BAITCOST);
                    handleIsFishing(true);
                    setFishPrize("");
                  }
                }
          }
        >
          {autoFish ? "Stop Autofish" : "Start Autofish"}
        </button>
      </div>
      <div className="PlayersFishing">
        {Object.keys(playerList).map((playerID, i) => {
          if (playerID !== userID) {
            const playerInfo = playerList[playerID]; // Access the player's information
            return (
              <FishingPlayer
                key={i}
                playerID={playerID}
                playerInfo={playerInfo}
                messageQueue={messageQueue[playerID]}
                handleMessageQueueShift={handleMessageQueueShift}
              />
            );
          } else return null;
        })}
      </div>
      <Modal isOpen={isBrokeOpen} onClose={closeBroke} title="Not Enough Mana">
        Fishing is for the rich.
      </Modal>
    </div>
  );
}

export default FishingGame;
