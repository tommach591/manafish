import { useCallback, useEffect, useState } from "react";
import "./Fishing.css";
import Modal from "../Modal";
import Fishionary from "./Fishionary";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useMana } from "../../utils/ManaContext";
import FishingGame from "./FishingGame/FishingGame";

const SERVERURL = "http://localhost:3001";
const socket = io.connect(SERVERURL);

function Fishing() {
  const navigate = useNavigate();

  const { userID, username, currentProfileIcon } = useMana();
  const [room, setRoom] = useState("");
  const [messagesRecieved, setMessagesRecieved] = useState([]);
  const [playerList, setPlayerList] = useState({});
  const [closeIsDisabled, setCloseIsDisabled] = useState(false);

  function generateLobbyCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "F"; // Start with F

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }

  const validateRoomCode = (code) => {
    const regex = /^F[A-Z]{5}$/;
    return regex.test(code);
  };

  const sendMessage = useCallback(
    (message) => {
      if (room && message)
        socket.emit("sendMessage", {
          room,
          message,
        });
    },
    [room]
  );

  const joinRoom = useCallback(() => {
    if (validateRoomCode(room) && userID && !playerList[userID]) {
      socket.emit("joinRoom", { room, userID, username, currentProfileIcon });
    }
  }, [playerList, room, userID, username, currentProfileIcon]);

  const leaveRoom = useCallback(() => {
    if (room && userID) socket.emit("leaveRoom", { room, userID });
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

    socket.on("lobbyPlayers", handleLobbyPlayers);
    socket.on("recieveMessage", handleReceiveMessage);
    socket.on("roomFull", handleRoomFull);

    return () => {
      socket.off("lobbyPlayers", handleLobbyPlayers);
      socket.off("recieveMessage", handleReceiveMessage);
      socket.off("roomFull", handleRoomFull);
    };
  }, []);

  useEffect(() => {
    setIsFishingGameOpen(playerList[userID]);
  }, [playerList, userID]);

  const [isFishionaryOpen, setIsFishionaryOpen] = useState(false);
  const openFishionary = () => setIsFishionaryOpen(true);
  const closeFishionary = () => setIsFishionaryOpen(false);

  const [isFishingGameOpen, setIsFishingGameOpen] = useState(false);
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
      <button
        className="HomeButton"
        onClick={() => {
          leaveRoom();
          navigate("/");
        }}
      >
        <div className="BubbleReflection" />
        <img
          src="https://api.iconify.design/ic:round-home.svg?color=%2332323c"
          alt=""
        />
      </button>
      <div className="LobbyInput">
        <input
          placeholder="Room #"
          maxlength="6"
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
        >
          <div className="BubbleReflection" />
          Fishionary
        </button>
        <button
          onClick={() => {
            if (!playerList[userID]) {
              setRoom(generateLobbyCode());
            }
          }}
        >
          <div className="BubbleReflection" />
          Random Room
        </button>
        <button
          onClick={() => {
            if (!playerList[userID]) openFishingGame();
          }}
        >
          <div className="BubbleReflection" />
          Join Room
        </button>
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
