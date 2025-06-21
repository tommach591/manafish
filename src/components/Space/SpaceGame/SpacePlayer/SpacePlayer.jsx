import { useEffect, useState } from "react";
import "./SpacePlayer.css";
import {
  getProfileBorder,
  getProfileIcon,
} from "../../../../utils/ProfileIcon";
import { useMana } from "../../../../utils/ManaContext";
import { getSpaceImage } from "../../../../utils/Spacedex";

function SpacePlayer({
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
    <div className="SpacePlayer">
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
            className="SpaceMessage"
            style={{
              animation: "messageAndFade 4s forwards ease-in-out 1",
            }}
            onAnimationEnd={() => setMessage("")}
          >
            <img
              src={message ? getSpaceImage(message?.message.fish.id) : ""}
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

export default SpacePlayer;
