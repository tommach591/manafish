import "./Home.css";
import { useMana } from "../../utils/ManaContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../Modal";
import patchNotes from "../../assets/PatchNotes.json";
import manaCurrencyImg from "../../assets/miscImage/manacurrency.png";
import aivyShopImage from "../../assets/miscImage/aivyShop.png";
import mintletArcadeImage from "../../assets/miscImage/mintletArcade.png";
import leaderboardImage from "../../assets/miscImage/leaderboard.png";
import manaBeachImage from "../../assets/miscImage/manaBeach.png";
import spaceImage from "../../assets/miscImage/space.png";
import LogoutButton from "../LogoutButton";
import { useAudio } from "../../utils/AudioContext";
import { useFish } from "../../utils/FishContext";
// import { useGarden } from "../../utils/GardenContext";

function Home() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { updateMana, storedMana, retrieveStoredMana } = useMana();
  // eslint-disable-next-line no-unused-vars
  const { addAllFish, aliensCaught } = useFish();
  const { playAudio } = useAudio();
  // const { isAnyPlantFullyGrown } = useGarden();
  const [claimedMana, setClaimedMana] = useState(0);

  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const openCredits = () => setIsCreditsOpen(true);
  const closeCredits = () => setIsCreditsOpen(false);

  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(false);
  const openPatchNotes = () => setIsPatchNotesOpen(true);
  const closePatchNotes = () => setIsPatchNotesOpen(false);

  return (
    <div className="Home">
      <LogoutButton />
      <button
        className="CreditsButton"
        onClick={() => {
          openCredits();
        }}
        onMouseEnter={() => playAudio("bubble")}
      >
        <div className="BubbleReflection" />
        Credits
      </button>
      <button
        className="DiscordButton"
        onClick={() => {
          const newWindow = window.open(
            "https://discord.gg/4pfpHqcwpC",
            "_blank",
            "noopener,noreferrer"
          );
          if (newWindow) newWindow.opener = null;
        }}
        onMouseEnter={() => playAudio("bubble")}
      >
        <div className="BubbleReflection" />
        Discord
      </button>
      <button
        className="PatchButton"
        onClick={() => {
          openPatchNotes();
          localStorage.setItem(
            "patchVersion",
            JSON.stringify(Object.keys(patchNotes)[0])
          );
        }}
        onMouseEnter={() => playAudio("bubble")}
      >
        <div className="BubbleReflection" />
        {JSON.stringify(Object.keys(patchNotes)[0]) !==
        localStorage.getItem("patchVersion") ? (
          <div className="PatchNotification"></div>
        ) : (
          <div />
        )}
        Patch Notes
      </button>
      <button
        className="ClaimButton"
        onClick={() => {
          const oldStoredMana = storedMana;
          setClaimedMana(oldStoredMana);
          retrieveStoredMana();
        }}
        onMouseEnter={() => playAudio("bubble")}
      >
        <div className="BubbleReflection" />
        <h1
          className="TextPopUp"
          style={
            claimedMana !== 0
              ? {
                  animation: "textPopUp 1.5s forwards ease-in-out 1",
                }
              : {}
          }
          onAnimationEnd={() => setClaimedMana(0)}
        >
          +{claimedMana}
        </h1>
        <img src={manaCurrencyImg} alt="" />
      </button>
      <div className="NavigationButtons">
        <button
          onClick={() => {
            navigate("/shop");
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          Aivy's Shop
          <img src={aivyShopImage} alt="" className="MenuButtonIcon" />
        </button>
        <button
          onClick={() => {
            navigate("/leaderboard");
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          Hall of Legends
          <img src={leaderboardImage} alt="" className="MenuButtonIcon" />
        </button>
        <button
          onClick={() => {
            navigate("/arcade");
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          Mintlet's Arcade
          <img src={mintletArcadeImage} alt="" className="MenuButtonIcon" />
        </button>
        <button
          onClick={() => {
            navigate("/fishing");
          }}
          onMouseEnter={() => playAudio("bubble")}
        >
          <div className="BubbleReflection" />
          Mana's Beach
          <img src={manaBeachImage} alt="" className="MenuButtonIcon" />
        </button>
        {/*
          <button
            onClick={() => {
              if (aliensCaught) {
                navigate("/space");
              } else
                alert("How are you going to go to space without a spaceship?");
            }}
            onMouseEnter={() => playAudio("bubble")}
          >
            <div className="BubbleReflection" />
            Space
            <img src={spaceImage} alt="" className="MenuButtonIcon" />
          </button>
          */}
      </div>

      <Modal
        isOpen={isCreditsOpen}
        onClose={closeCredits}
        title={`Credits`}
        isDisabled={false}
      >
        <div className="Credits">
          <h1>Developer - @tummylol_</h1>
          <h1>Artist - @aivysu</h1>
          <h1>BGM - @damahysk</h1>
          <h1>Voice - @mi10ne</h1>
        </div>
      </Modal>
      <Modal
        isOpen={isPatchNotesOpen}
        onClose={closePatchNotes}
        title={`Patch Notes (PST)`}
        isDisabled={false}
      >
        <div className="PatchNotes">
          {Object.entries(patchNotes).map(([version, notes], i) => {
            return (
              <div key={i} className="Patches">
                <h1 className="PatchVersion">{version}</h1>
                <h1>{notes}</h1>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

export default Home;
