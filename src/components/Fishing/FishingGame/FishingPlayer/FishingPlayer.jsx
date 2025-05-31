import { useEffect, useState } from "react";
import "./FishingPlayer.css";
import { getFishImage } from "../../../../utils/Fishionary";
import { getProfileIcon } from "../../../../utils/ProfileIcon";

function FishingPlayer({
  playerID,
  playerInfo,
  messageQueue,
  handleMessageQueueShift,
}) {
  const [message, setMessage] = useState();

  useEffect(() => {
    if (messageQueue?.length > 0) {
      setMessage(messageQueue[0]);
      handleMessageQueueShift(playerID);
    }
  }, [playerID, messageQueue, handleMessageQueueShift, message]);

  return (
    <div className="FishingPlayer">
      <div className="PlayerContent">
        <h1 className="PlayerName">{playerInfo.username}</h1>
        <img src={getProfileIcon(playerInfo.currentProfileIcon)} alt="" />
        {message ? (
          <div
            className="FishMessage"
            style={{
              animation: "messageAndFade 4s forwards ease-in-out 1",
            }}
            onAnimationEnd={() => setMessage("")}
          >
            <img
              src={message ? getFishImage(message?.message.fish.id) : ""}
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
