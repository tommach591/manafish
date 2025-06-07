import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "../Login";
import Home from "../Home";
import Shop from "../Shop";
import Fishing from "../Fishing";
import Space from "../Space";
import Arcade from "../Arcade";
import Garden from "../Garden";
import Leaderboard from "../Leaderboard";
import { useMana } from "../../utils/ManaContext";
import { useEffect, useState } from "react";
import { getProfileIcon, getProfileIconList } from "../../utils/ProfileIcon";
import { formatNumberWithCommas, formatTime } from "../../utils/Helper";
import Modal from "../Modal";
import manaCurrencyImg from "../../assets/miscImage/manacurrency.png";
import VolumeSlider from "./VolumeSlider";
import patchNotes from "../../assets/PatchNotes.json"

function App() {
  const {
    userID,
    username,
    mana,
    storedMana,
    maxStoredMana,
    nextManaInterval,
    lastManaInterval,
    setCurrentProfileIcon,
    currentProfileIcon,
    profileIcons,
  } = useMana();
  const TICK_RATE = 1000;
  const MANA_RATE = 30;
  const navigate = useNavigate();

  const [isProfileIconOpen, setIsProfileIconOpen] = useState(false);
  const openProfileIcon = () => setIsProfileIconOpen(true);
  const closeProfileIcon = () => setIsProfileIconOpen(false);

  useEffect(() => {
    if (!userID) {
      navigate("/login");
    }
  }, [userID, navigate]);

  return (
    <div className="App">
      <div className="Wave" />
      <div className="Wave" />
      <div className="Wave" />
      <h1 className="Version">Version: {Object.keys(patchNotes)[0]}</h1>
      {userID ? (
        <div className="AppHeader">
          <div className="Mana">
            <h1 className="Username">{`${username}`}</h1>
            <h1>{`Mana: ${formatNumberWithCommas(mana)}`}
              <img className="CurrencyIcon" src={manaCurrencyImg} alt=""/>
            </h1>
            <h1>{`Stored Mana: ${storedMana}/${maxStoredMana}`} 
              <img className="CurrencyIcon" src={manaCurrencyImg} alt=""/>
            </h1>
            <h2>
              {`Replenishes In:
        ${
          storedMana === maxStoredMana ? "00:00:00" : 
          Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1 < 0 ? "00:00:00" : 
          formatTime(Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1)
        } / ${
          storedMana === maxStoredMana ? "00:00:00" : 
          Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1 < 0 ? "00:00:00" :
           formatTime((maxStoredMana - storedMana - 1) * MANA_RATE + Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1)
          }`} 
            </h2>
          </div>
          <div className="ProfileIcon" onClick={openProfileIcon}>
            <img src={getProfileIcon(currentProfileIcon)} alt="" />
          </div>
          <VolumeSlider/>
        </div>
      ) : (
        <div className="AppHeader" />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/fishing" element={<Fishing />} />
        <Route path="/space" element={<Space />} />
        <Route path="/arcade" element={<Arcade />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Modal
        isOpen={isProfileIconOpen}
        onClose={closeProfileIcon}
        title="Select Profile Icon"
      >
        <div className="ProfileIconSelector">
          {getProfileIconList().map((icon, i) => {
            return (
              <div
                className="ProfileIconChoice"
                key={i}
                onClick={() => {
                  if (profileIcons.includes(icon)) setCurrentProfileIcon(icon);
                }}
              >
                {profileIcons.includes(icon) ? (
                  <div />
                ) : (
                  <div className="ProfileIconCover" />
                )}
                <img src={getProfileIcon(icon)} alt="" />
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

export default App;

