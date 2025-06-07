import { useCallback, useEffect, useState } from "react";
import "./Fishing.css";
import Modal from "../Modal";
import Fishionary from "./Fishionary";
import fishionary from "../../assets/Fishionary.json";
import io from "socket.io-client";
import { useMana } from "../../utils/ManaContext";
import FishingGame from "./FishingGame";
import { useFish } from "../../utils/FishContext";
import { useRef } from "react";
import HomeButton from "../HomeButton";
import LogoutButton from "../LogoutButton";
import { useUtil } from "../../utils/UtilContext";

//const SERVERURL = "http://localhost:3001";
const SERVERURL = "https://manafish-server-47d29a19afc3.herokuapp.com";

function Fishing() {
  const socket = useRef(null);

  const { userID, username, currentProfileIcon } = useMana();
  const { fishCaught } = useFish();
  const { playAudio } = useUtil();
  const [room, setRoom] = useState("");
  const [messagesRecieved, setMessagesRecieved] = useState([]);
  const [playerList, setPlayerList] = useState({});
  const [closeIsDisabled, setCloseIsDisabled] = useState(false);
  const [activeLobbies, setActiveLobbies] = useState([]);

  const [isFishionaryOpen, setIsFishionaryOpen] = useState(false);
  const openFishionary = () => setIsFishionaryOpen(true);
  const closeFishionary = () => setIsFishionaryOpen(false);

  const [isFishingGameOpen, setIsFishingGameOpen] = useState(false);

  function generateLobbyCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "F"; // Start with F

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }

  const refreshLobbyList = () => {
    socket.current.emit("refreshLobbies", userID);
  };

  const validateRoomCode = (code) => {
    const regex = /^F[A-Z]{5}$/;
    return regex.test(code);
  };

  const sendMessage = useCallback(
    (message) => {
      if (room && message)
        socket.current.emit("sendMessage", {
          room,
          message,
        });
    },
    [room]
  );

  const joinRoom = useCallback(() => {
    if (validateRoomCode(room) && userID && !playerList[userID]) {
      socket.current.emit("joinRoom", { room, userID, username, currentProfileIcon });
    }
  }, [playerList, room, userID, username, currentProfileIcon]);

  const leaveRoom = useCallback(() => {
    if (room && userID) socket.current.emit("leaveRoom", { room, userID });
  }, [room, userID]);

  useEffect(() => {
    const handleLobbyPlayers = (data) => {
      setPlayerList({ ...data });
    };
    const handleReceiveMessage = (data) => {
      setMessagesRecieved((prev) => [...prev, data]);
    };
    const handleRoomFull = (data) => {
      alert("Uh oh. Room is full, try another code.");
    };
    const handleRefresh = (data) => {
      setActiveLobbies(data.filter(([str]) => str.startsWith("F")));
    };
    
    if (!userID || socket.current) return;

    socket.current = io.connect(SERVERURL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });
    socket.current.emit("register", userID);
    socket.current.on("lobbyPlayers", handleLobbyPlayers);
    socket.current.on("recieveMessage", handleReceiveMessage);
    socket.current.on("roomFull", handleRoomFull);
    socket.current.on("randomActiveLobbies", handleRefresh);

    const timeout = setTimeout(() => {
      refreshLobbyList();
    }, 100); 

    return () => {
      socket.current.off("lobbyPlayers", handleLobbyPlayers);
      socket.current.off("recieveMessage", handleReceiveMessage);
      socket.current.off("roomFull", handleRoomFull);
      socket.current.off("randomActiveLobbies", handleRefresh);
      socket.current.disconnect();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsFishingGameOpen(playerList[userID]);
  }, [playerList, userID]);

  const openFishingGame = () => {
    if (validateRoomCode(room) && userID && !playerList[userID]) {
      joinRoom();
    } else {
      alert(
        "Invalid room code. It must start with 'F' and contain 6 total uppercase letters."
      );
    }
  };
  const closeFishingGame = () => {
    setIsFishingGameOpen(false);
    leaveRoom();
  };

  return (
    <div className="Fishing">
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
        <button
          onClick={() => {
            openFishionary();
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          Fishionary
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
          onClick={refreshLobbyList}
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
        {activeLobbies.map(([key, value], i) => {
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
