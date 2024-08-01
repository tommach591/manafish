import { useEffect, useState } from "react";
import "./FishingPlayer.css";
import { getFishImage } from "../../../../utils/Fishionary";

function FishingPlayer({ playerID, messageQueue, handleMessageQueueShift }) {
  const [message, setMessage] = useState();

  useEffect(() => {
    if (messageQueue?.length > 0) {
      setMessage(messageQueue[0]);
      handleMessageQueueShift(playerID);
    }
  }, [playerID, messageQueue, handleMessageQueueShift]);

  return (
    <div className="FishingPlayer">
      <div className="PlayerContent">
        <img
          src="https://api.iconify.design/material-symbols:person.svg?color=%2300000"
          alt=""
        />
        {message ? (
          <div
            className="FishMessage"
            style={{
              animation: "messageAndFade 4s forwards ease-in-out 1",
            }}
            onAnimationEnd={() => setMessage("")}
          >
            <img
              src={message ? getFishImage(message.message.fish.id) : ""}
              alt=""
            />
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default FishingPlayer;
