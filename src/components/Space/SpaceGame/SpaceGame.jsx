import { useCallback, useEffect, useState } from "react";
import "./SpaceGame.css";
import spacedex from "../../../assets/Spacedex.json";
import { getSpaceImage } from "../../../utils/Spacedex";
import { useMana } from "../../../utils/ManaContext";
import SpacePlayer from "./SpacePlayer";
import { useFish } from "../../../utils/FishContext";
import Modal from "../../Modal";
import soloFishingGif from "../../../assets/miscImage/manafishsolo.gif";
import duoFishingGif from "../../../assets/miscImage/manafishduo.gif";
import { formatNumberWithCommas, formatTime } from "../../../utils/Helper";
import manaCurrencyImg from "../../../assets/miscImage/manacurrency.png";
import { useAudio } from "../../../utils/AudioContext";

function SpaceGame({
  playerList,
  sendMessage,
  messagesRecieved,
  setCloseIsDisabled,
}) {
  const { userID, mana, updateMana } = useMana();
  const { aliensCaught, addAlien } = useFish();
  const { playAudio } = useAudio();
  const [alienPrize, setAlienPrize] = useState("");
  const [isFishing, setIsFishing] = useState(false);
  const [autoFish, setAutoFish] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [timePassed, setTimePassed] = useState(new Date());
  // eslint-disable-next-line no-unused-vars
  const [startingMana, setStartingMana] = useState(mana);
  const [rarestAlien, setRarestAlien] = useState();

  const [messageQueue, setMessageQueue] = useState({});
  const BAITCOST = 20;
  const FISHINGTIME = 1000 * 7;

  const [fishRates, setFishRates] = useState(1);
  const baseWeights = [
    550000, // Common
    350000, // Uncommon
    100000, // Rare
    10000, // Epic
    2500, // Unique
    300, // Legendary
    5, // Mythic
  ];
  const [weights, setWeights] = useState(baseWeights);

  const [isBrokeOpen, setIsBrokeOpen] = useState(false);
  const openBroke = () => setIsBrokeOpen(true);
  const closeBroke = () => setIsBrokeOpen(false);

  const handleIsFishing = useCallback(
    (value) => {
      setIsFishing(value);
      setCloseIsDisabled(value || autoFish);
    },
    [setCloseIsDisabled, autoFish]
  );

  const handleCatchFish = useCallback(() => {
    const FISHES = [[], [], [], [], [], [], []];
    const [COMMON, UNCOMMON, RARE, EPIC, UNIQUE, LEGENDARY] = [
      25, 50, 70, 150, 500, 5000,
    ];

    Object.keys(spacedex).forEach((key) => {
      const item = spacedex[key];
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

    setAlienPrize(fish);
    if (!rarestAlien || rarestAlien.value < fish.value) setRarestAlien(fish);
    addAlien(fish.id);
    sendMessage({ userID, fish });
    updateMana(Number(fish.value));

    if (category >= 5) {
      playAudio("yippee");
      const sounds = ["ohMyGosh", "amazing", "wooow"];
      playAudio(sounds[Math.floor(Math.random() * sounds.length)]);
    } else if (category >= 3) {
      playAudio("yippee");
      const sounds = ["great", "lucky", "wow", "yay", "niceCatch"];
      playAudio(sounds[Math.floor(Math.random() * sounds.length)]);
    }
  }, [
    userID,
    updateMana,
    sendMessage,
    addAlien,
    weights,
    playAudio,
    rarestAlien,
  ]);

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
    function updateFishRates() {
      const newRate = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
      setFishRates(newRate);
    }

    const interval = setInterval(() => {
      updateFishRates();
    }, 20 * 60 * 1000); // every 20 min

    updateFishRates();

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function getSkewedWeights(baseWeights, fishRates) {
      const maxIndex = baseWeights.length - 1;

      return baseWeights.map((weight, index) => {
        const skewFactor = Math.pow(fishRates, maxIndex - index);
        return weight * skewFactor;
      });
    }
    const newWeights = getSkewedWeights(baseWeights, fishRates);

    /*
    const totalWeight = newWeights.reduce((sum, w) => sum + w, 0);
    console.log(fishRates, newWeights.map(w => {
      const percent = (w / totalWeight) * 100;
      return percent.toFixed(5) + "%";
    }));
    */

    setWeights(newWeights);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fishRates]);

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
            setAlienPrize("");
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
            setCloseIsDisabled(false);
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
    setCloseIsDisabled,
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

  const getFishingFilter = useCallback(() => {
    const normalized = (fishRates - 0.8) / (1.2 - 0.8);

    const brightness = 0.95 + normalized * 0.08;
    const contrast = 0.98 + normalized * 0.04;

    return `brightness(${brightness}) contrast(${contrast})`;
  }, [fishRates]);

  const getFishingOverlayStyle = useCallback(() => {
    const normalized = (fishRates - 0.8) / (1.2 - 0.8);
    const tintStrength = Math.abs(normalized - 0.5) * 1;

    if (fishRates > 1.0) {
      return `rgba(255, 255, 100, ${tintStrength})`;
    } else if (fishRates < 1.0) {
      return `rgba(20, 10, 50, ${tintStrength})`;
    } else {
      return `rgba(0,0,0,0)`;
    }
  }, [fishRates]);

  return (
    <div className="SpaceGame">
      <div className="FishingGameInfo">
        <h1 className="Timer">
          {formatTime(Math.floor((Date.now() - timePassed.getTime()) / 1000))} |
        </h1>
        <h1 className="ManaProfit">
          {mana - startingMana}
          <img className="CurrencyIcon" src={manaCurrencyImg} alt="" />
        </h1>
        {rarestAlien ? (
          <div className="RarestFish">
            <h1>| {rarestAlien.value}</h1>
            <img src={getSpaceImage(rarestAlien.id)} alt="" />
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="ManaDisplayWhileFishing">
        <h1>
          {`Mana: ${formatNumberWithCommas(mana)}`}
          <img className="CurrencyIcon" src={manaCurrencyImg} alt="" />
        </h1>
      </div>
      <div className="FishingDisplay">
        {isFishing ? (
          <div className="FishingDisplayImages">
            <img
              className="FishingAnimation"
              src={
                Object.keys(playerList).length === 1
                  ? soloFishingGif
                  : duoFishingGif
              }
              alt=""
              style={{
                filter: getFishingFilter(),
                backgroundColor: getFishingOverlayStyle(),
              }}
            />
            <img
              src={
                fishRates >= 1.05
                  ? "https://api.iconify.design/line-md:sun-rising-filled-loop.svg?color=%23ffda75"
                  : fishRates < 0.95
                  ? "https://api.iconify.design/line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition.svg?color=%23c4d0e3"
                  : ""
              }
              alt=""
              className="FishingRateIndicator"
            />
          </div>
        ) : alienPrize ? (
          <div className="AlienCaughtInfo">
            <img src={getSpaceImage(alienPrize.id)} alt="" />
            <h1 className="NewAlienCaught">
              {aliensCaught[alienPrize.id] === 1 ? "NEW!!!" : ""}
            </h1>
            <h1>{alienPrize.name}</h1>
            <h2>{alienPrize.info}</h2>
            <h3>Value: {alienPrize.value}</h3>
            <h3>Caught: {aliensCaught[alienPrize.id]}</h3>
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
              setAlienPrize("");
            }
          }}
          disabled={isFishing || autoFish}
        >
          <span>
            Fish - {BAITCOST}{" "}
            <img className="CurrencyIcon" src={manaCurrencyImg} alt="" />
          </span>
        </button>
        <button
          onClick={
            autoFish
              ? () => {
                  setAutoFish(false);
                  setCloseIsDisabled(isFishing);
                }
              : () => {
                  if (mana < BAITCOST) openBroke();
                  else {
                    setAutoFish(true);
                    if (!isFishing) updateMana(-BAITCOST);
                    handleIsFishing(true);
                    setAlienPrize("");
                  }
                }
          }
        >
          {autoFish ? "Stop Autofish" : "Start Autofish"}
        </button>
      </div>
      <div className="PlayersFishing">
        {Object.keys(playerList).map((playerID, i) => {
          if (userID) {
            const playerInfo = playerList[playerID]; // Access the player's information
            return (
              <SpacePlayer
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

export default SpaceGame;
