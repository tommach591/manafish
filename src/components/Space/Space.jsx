import { useEffect, useState } from "react";
import "./Space.css";
import Modal from "../Modal";
import Spacedex from "./Spacedex";
import spacedex from "../../assets/Spacedex.json";
import { useMana } from "../../utils/ManaContext";
import SpaceGame from "./SpaceGame";
import { useFish } from "../../utils/FishContext";
import LogoutButton from "../LogoutButton";
import HomeButton from "../HomeButton";
import { useAudio } from "../../utils/AudioContext";
import { useSocket } from "../../utils/SocketContext";
import manaCurrencyImg from "../../assets/miscImage/manacurrency.png";

function Space() {
  const { userID, storedMana, retrieveStoredMana } = useMana();
  const [claimedMana, setClaimedMana] = useState(0);
  const { aliensCaught } = useFish();
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

  const [isSpacedexOpen, setIsSpacedexOpen] = useState(false);
  const openSpacedex = () => setIsSpacedexOpen(true);
  const closeSpacedex = () => setIsSpacedexOpen(false);

  const [isSpaceGameOpen, setIsSpaceGameOpen] = useState(false);

  function generateLobbyCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = roomType; // Start with S

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }

  useEffect(() => {
    if (!userID) return;

    setRoomType("S");
    const timeout = setTimeout(() => {
      refreshLobbyList();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsSpaceGameOpen(playerList[userID]);
  }, [playerList, userID]);

  const openSpaceGame = () => {
    if (validateRoomCode(room) && userID && !playerList[userID]) {
      joinRoom();
    } else {
      alert(
        `Invalid room code. It must start with ${roomType} and contain 6 total uppercase letters.`
      );
    }
  };
  const closeSpaceGame = () => {
    setIsSpaceGameOpen(false);
    leaveRoom();
  };

  return (
    <div className="Space">
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
        {isSpaceGameOpen ? (
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
            openSpacedex();
          }}
          onMouseEnter={() => playAudio("bubble")}
          style={
            isSpaceGameOpen
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
          {isSpaceGameOpen ? "" : "Spacedex"}
          {aliensCaught ? (
            <h1 className="SpacedexCount">
              {Object.keys(aliensCaught).length} /{" "}
              {Object.keys(spacedex).length}
            </h1>
          ) : (
            <h1 className="SpacedexCount">
              {0} / {Object.keys(spacedex).length}
            </h1>
          )}
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
            if (!playerList[userID]) openSpaceGame();
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
        isOpen={isSpaceGameOpen}
        onClose={closeSpaceGame}
        title={`Space - ${room}`}
        isDisabled={closeIsDisabled}
      >
        <SpaceGame
          playerList={playerList}
          sendMessage={sendMessage}
          messagesRecieved={messagesRecieved}
          setCloseIsDisabled={setCloseIsDisabled}
        />
      </Modal>
      <Modal isOpen={isSpacedexOpen} onClose={closeSpacedex} title="Spacedex">
        <Spacedex />
      </Modal>
    </div>
  );
}

export default Space;
