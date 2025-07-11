import { useEffect, useState } from "react";
import "./Fishing.css";
import Modal from "../Modal";
import Fishionary from "./Fishionary";
import fishionary from "../../assets/Fishionary.json";
import { useMana } from "../../utils/ManaContext";
import FishingGame from "./FishingGame";
import { useFish } from "../../utils/FishContext";
import HomeButton from "../HomeButton";
import LogoutButton from "../LogoutButton";
import { useAudio } from "../../utils/AudioContext";
import { useSocket } from "../../utils/SocketContext";
import manaNPC from "../../assets/miscImage/manaNPC.png";
import manaCurrencyImg from "../../assets/miscImage/manacurrency.png";

function Fishing() {
  const { userID, storedMana, retrieveStoredMana } = useMana();
  const [claimedMana, setClaimedMana] = useState(0);

  const { fishCaught } = useFish();
  const {
    room,
    setRoom,
    roomType,
    setRoomType,
    validateRoomCode,
    refreshLobbyList,
    playerList,
    activeLobbies,
    messagesRecieved,
    sendMessage,
    joinRoom,
    leaveRoom,
  } = useSocket();
  const { playAudio } = useAudio();
  const [closeIsDisabled, setCloseIsDisabled] = useState(false);

  const [isFishionaryOpen, setIsFishionaryOpen] = useState(false);
  const openFishionary = () => setIsFishionaryOpen(true);
  const closeFishionary = () => setIsFishionaryOpen(false);

  const [isFishingGameOpen, setIsFishingGameOpen] = useState(false);

  function generateLobbyCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = roomType; // Start with F

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }

  useEffect(() => {
    if (!userID) return;

    setRoomType("F");
    const timeout = setTimeout(() => {
      refreshLobbyList();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsFishingGameOpen(playerList[userID]);
  }, [playerList, userID]);

  const openFishingGame = () => {
    if (validateRoomCode() && userID && !playerList[userID]) {
      joinRoom();
    } else {
      alert(
        `Invalid room code. It must start with ${roomType} and contain 6 total uppercase letters.`
      );
    }
  };
  const closeFishingGame = () => {
    setIsFishingGameOpen(false);
    leaveRoom();
  };

  return (
    <div className="Fishing">
      <img src={manaNPC} alt="" className="NPC" />
      <HomeButton />
      <LogoutButton />
      <div className="LobbyInput">
        <input
          placeholder="Room #"
          maxLength="6"
          value={room}
          onChange={(event) => setRoom(event.currentTarget.value.toUpperCase())}
          disabled={playerList[userID] !== undefined}
        />
      </div>
      <div className="LobbyButtons">
        {isFishingGameOpen ? (
          <button
            className="ClaimButton"
            onClick={() => {
              const oldStoredMana = storedMana;
              setClaimedMana(oldStoredMana);
              retrieveStoredMana();
            }}
            onMouseEnter={() => playAudio("bubble")}
            style={{
              position: "absolute",
              bottom: "0.5rem",
              left: "4rem",
              zIndex: "999",
              width: "2rem",
              height: "2rem",
            }}
          >
            <div className="BubbleReflection" />
            <h1
              className="TextPopUp"
              style={
                claimedMana !== 0
                  ? {
                      animation: "textPopUp 1.5s forwards ease-in-out 1",
                    }
                  : {}
              }
              onAnimationEnd={() => setClaimedMana(0)}
            >
              +{claimedMana}
            </h1>
            <img src={manaCurrencyImg} alt="" style={{ width: "1.5rem" }} />
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={() => {
            openFishionary();
          }}
          onMouseEnter={() => playAudio("bubble")}
          style={
            isFishingGameOpen
              ? {
                  position: "absolute",
                  bottom: "0.5rem",
                  left: "0.5rem",
                  zIndex: "999",
                  width: "2rem",
                  height: "2rem",
                }
              : {}
          }
        >
          <div className="BubbleReflection" />
          {isFishingGameOpen ? "" : "Fishionary"}
          <h1 className="FishionaryCount">
            {Object.keys(fishCaught).length} / {Object.keys(fishionary).length}
          </h1>
        </button>
        <button
          onClick={() => {
            if (!playerList[userID]) {
              setRoom(generateLobbyCode());
            }
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          Random Room
        </button>
        <button
          onClick={() => {
            if (!playerList[userID]) openFishingGame();
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          Join Room
        </button>
      </div>
      <div className="OpenFishingLobbies">
        <button
          className="FishingLobbyRefreshButton"
          onClick={() => refreshLobbyList()}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          <img
            src="https://api.iconify.design/material-symbols:refresh-rounded.svg?color=%2332323c"
            alt=""
          />
        </button>
        <h1>Lobbies</h1>
        <div className="FishingLobbies">
          {activeLobbies
            .filter(([str]) => str.startsWith(roomType))
            .map(([key, value], i) => {
              return (
                <div
                  className="FishingLobby"
                  key={i}
                  onClick={() => {
                    setRoom(key);
                  }}
                >
                  <h1 className="FishingLobbyRoom">{key}</h1>
                  <h1 className="FishingLobbyValue">
                    <img
                      src="https://api.iconify.design/material-symbols:person.svg?color=%2332323c"
                      alt=""
                    />
                    {value}/8
                  </h1>
                </div>
              );
            })}
        </div>
      </div>

      <Modal
        isOpen={isFishingGameOpen}
        onClose={closeFishingGame}
        title={`Fishing - ${room}`}
        isDisabled={closeIsDisabled}
      >
        <FishingGame
          playerList={playerList}
          sendMessage={sendMessage}
          messagesRecieved={messagesRecieved}
          setCloseIsDisabled={setCloseIsDisabled}
        />
      </Modal>
      <Modal
        isOpen={isFishionaryOpen}
        onClose={closeFishionary}
        title="Fishionary"
      >
        <Fishionary />
      </Modal>
    </div>
  );
}

export default Fishing;
