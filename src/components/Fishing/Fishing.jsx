import { useCallback, useEffect, useState } from "react";
import "./Fishing.css";
import Modal from "../Modal";
import Fishionary from "./Fishionary";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useMana } from "../../utils/AccountContext";

const SERVERURL = "http://localhost:3001";
const socket = io.connect(SERVERURL);

function Fishing() {
  const [isFishionaryOpen, setIsFishionaryOpen] = useState(false);
  const openFishionary = () => setIsFishionaryOpen(true);
  const closeFishionary = () => setIsFishionaryOpen(false);
  const navigate = useNavigate();

  const { userID } = useMana();
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const [playerList, setPlayerList] = useState([]);

  function generateLobbyCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "F"; // Start with F

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    setRoom(code);
  }

  const validateRoomCode = (code) => {
    const regex = /^F[A-Z]{5}$/;
    return regex.test(code);
  };

  const sendMessage = useCallback(() => {
    if (room && message) socket.emit("sendMessage", { room, message });
  }, [message, room]);

  const joinRoom = useCallback(() => {
    if (validateRoomCode(room) && userID) {
      socket.emit("joinRoom", { room, userID });
    } else {
      alert(
        "Invalid room code. It must start with 'F' and contain 6 total uppercase letters."
      );
    }
  }, [room, userID]);

  const leaveRoom = useCallback(() => {
    if (room && userID) socket.emit("leaveRoom", { room, userID });
  }, [room, userID]);

  useEffect(() => {
    const handleLobbyPlayers = (data) => {
      setPlayerList([...data]);
    };
    const handleReceiveMessage = (data) => {
      setMessageRecieved((prev) => [...prev, data]);
    };

    socket.on("lobbyPlayers", handleLobbyPlayers);
    socket.on("recieveMessage", handleReceiveMessage);

    return () => {
      socket.off("lobbyPlayers", handleLobbyPlayers);
      socket.off("recieveMessage", handleReceiveMessage);
    };
  }, []);

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
                generateLobbyCode();
              }
            }}
            disabled={playerList.includes(userID)}
          >
            Create Room
          </button>
          <button
            onClick={() => {
              if (!playerList.includes(userID)) joinRoom();
              else leaveRoom();
            }}
          >
            {!playerList.includes(userID) ? "Join Room" : "Leave Room"}
          </button>
        </div>
      </div>

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
