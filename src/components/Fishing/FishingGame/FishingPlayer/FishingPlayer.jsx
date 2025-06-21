import { useEffect, useState } from "react";
import "./FishingPlayer.css";
import { getFishImage } from "../../../../utils/Fishionary";
import {
  getProfileBorder,
  getProfileIcon,
} from "../../../../utils/ProfileIcon";
import { useMana } from "../../../../utils/ManaContext";

function FishingPlayer({
  playerID,
  playerInfo,
  messageQueue,
  handleMessageQueueShift,
}) {
  const { userID } = useMana();
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
        <h1
          className="PlayerName"
          style={playerID === userID ? { fontWeight: "bold" } : {}}
        >
          {playerInfo.username}
        </h1>
        <img
          className="PlayerProfilePic"
          src={getProfileIcon(playerInfo.currentProfileIcon)}
          alt=""
          style={false ? {} : { border: "1px solid black" }}
        />
        {playerInfo.currentProfileBorder ? (
          <img
            className="PlayerProfileBorder"
            src={getProfileBorder(playerInfo.currentProfileBorder)}
            alt=""
          />
        ) : (
          <div />
        )}
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
