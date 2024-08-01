import { useCallback, useEffect, useState } from "react";
import "./Fishing.css";
import Modal from "../Modal";
import Fishionary from "./Fishionary";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useMana } from "../../utils/AccountContext";
import FishingGame from "./FishingGame/FishingGame";

const SERVERURL = "http://localhost:3001";
const socket = io.connect(SERVERURL);

function Fishing() {
  const navigate = useNavigate();

  const { userID } = useMana();
  const [room, setRoom] = useState("");
  const [messagesRecieved, setMessagesRecieved] = useState([]);
  const [playerList, setPlayerList] = useState([]);

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
      if (room && message) socket.emit("sendMessage", { room, message });
    },
    [room]
  );

  const joinRoom = useCallback(() => {
    if (validateRoomCode(room) && userID && !playerList.includes(userID)) {
      socket.emit("joinRoom", { room, userID });
    }
  }, [playerList, room, userID]);

  const leaveRoom = useCallback(() => {
    if (room && userID) socket.emit("leaveRoom", { room, userID });
  }, [room, userID]);

  useEffect(() => {
    const handleLobbyPlayers = (data) => {
      setPlayerList([...data]);
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
    setIsFishingGameOpen(playerList.includes(userID));
  }, [playerList, userID]);

  const [isFishionaryOpen, setIsFishionaryOpen] = useState(false);
  const openFishionary = () => setIsFishionaryOpen(true);
  const closeFishionary = () => setIsFishionaryOpen(false);

  const [isFishingGameOpen, setIsFishingGameOpen] = useState(false);
  const openFishingGame = () => {
    if (validateRoomCode(room) && userID && !playerList.includes(userID)) {
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
        onClick={() => {
          openFishionary();
        }}
      >
        Fishionary
      </button>
      <button
        onClick={() => {
          leaveRoom();
          navigate("/");
        }}
      >
        Home
      </button>

      <div className="LobbyInput">
        <input
          placeholder="Room #"
          value={room}
          onChange={(event) => setRoom(event.currentTarget.value)}
          disabled={playerList.includes(userID)}
        />
        <div className="LobbyButtons">
          <button
            onClick={() => {
              if (!playerList.includes(userID)) {
                setRoom(generateLobbyCode());
              }
            }}
          >
            Random Room
          </button>
          <button
            onClick={() => {
              if (!playerList.includes(userID)) openFishingGame();
            }}
          >
            Join Room
          </button>
        </div>
      </div>

      <Modal
        isOpen={isFishingGameOpen}
        onClose={closeFishingGame}
        title={`Fishing - ${room}`}
      >
        <FishingGame
          playerList={playerList}
          sendMessage={sendMessage}
          messagesRecieved={messagesRecieved}
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
