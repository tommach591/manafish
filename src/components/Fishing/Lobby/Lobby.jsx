import { useEffect, useState } from "react";
import "./Lobby.css";
import io from "socket.io-client";

const SERVERURL = "http://localhost:3001";
const socket = io.connect(SERVERURL);

function Lobby() {
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
  };

  useEffect(() => {
    socket.on("recieveMessage", (data) => {
      setMessageRecieved((prev) => [...prev, data]);
    });
  }, [message]);

  return (
    <div className="Lobby">
      <input
        placeholder="Message"
        value={message}
        onChange={(event) => setMessage(event.currentTarget.value)}
      />
      <button
        onClick={() => {
          sendMessage();
          setMessage("");
        }}
      >
        Send Message
      </button>
      {messageRecieved.map((val, i) => {
        return <h1 key={i}>{val}</h1>;
      })}
    </div>
  );
}

export default Lobby;
