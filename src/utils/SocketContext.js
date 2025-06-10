import {
  useContext,
  createContext,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useMana } from "./ManaContext";
import io from "socket.io-client";

const SocketContext = createContext();
export function useSocket() {
  return useContext(SocketContext);
}

// const SERVERURL = "http://localhost:3001";
const SERVERURL = "https://manafish-server-47d29a19afc3.herokuapp.com";

export function SocketProvider({ children }) {
  const { userID, username, currentProfileIcon, handleBalanceLogout } =
    useMana();
  const socket = useRef(null);
  const [roomType, setRoomType] = useState("F");
  const [room, setRoom] = useState("");
  const [messagesRecieved, setMessagesRecieved] = useState([]);
  const [playerList, setPlayerList] = useState({});
  const [activeLobbies, setActiveLobbies] = useState([]);

  const validateRoomCode = useCallback(() => {
    const regex = new RegExp(`^${roomType}[A-Z]{5}$`);
    return regex.test(room);
  }, [room, roomType]);

  const refreshLobbyList = useCallback(() => {
    socket.current.emit("refreshLobbies", userID);
  }, [userID]);

  const joinRoom = useCallback(() => {
    if (validateRoomCode() && userID && !playerList[userID]) {
      socket.current.emit("joinRoom", {
        room,
        userID,
        username,
        currentProfileIcon,
      });
    }
  }, [
    playerList,
    userID,
    username,
    currentProfileIcon,
    room,
    validateRoomCode,
  ]);

  const leaveRoom = useCallback(() => {
    if (room && userID) socket.current.emit("leaveRoom", { room, userID });
  }, [room, userID]);

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

  useEffect(() => {
    if (!userID || socket.current) return;

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
      setActiveLobbies(data);
    };
    const handleForceLogout = (data) => {
      alert(data.reason || "You were logged out.");
      handleBalanceLogout();
      socket.current.disconnect();
      socket.current = null;
      setRoom("");
    };
    const handleBeforeUnload = () => {
      socket.current.disconnect();
      socket.current = null;
      setRoom("");
    };

    socket.current = io(SERVERURL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    const data = {
      userID: userID,
    };

    socket.current.emit("register", data);
    socket.current.on("lobbyPlayers", handleLobbyPlayers);
    socket.current.on("recieveMessage", handleReceiveMessage);
    socket.current.on("roomFull", handleRoomFull);
    socket.current.on("randomActiveLobbies", handleRefresh);
    socket.current.on("forceLogout", handleForceLogout);

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (socket.current) {
        socket.current.off("lobbyPlayers", handleLobbyPlayers);
        socket.current.off("recieveMessage", handleReceiveMessage);
        socket.current.off("roomFull", handleRoomFull);
        socket.current.off("randomActiveLobbies", handleRefresh);
        socket.current.off("forceLogout", handleForceLogout);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  return (
    <SocketContext.Provider
      value={{
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
