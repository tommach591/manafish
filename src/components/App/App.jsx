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
import {
  getProfileBorder,
  getProfileBorderList,
  getProfileIcon,
  getProfileIconList,
} from "../../utils/ProfileIcon";
import { formatNumberWithCommas, formatTime } from "../../utils/Helper";
import Modal from "../Modal";
import manaCurrencyImg from "../../assets/miscImage/manacurrency.png";
import VolumeSlider from "./VolumeSlider";
import patchNotes from "../../assets/PatchNotes.json";
import ManaBubble from "./ManaBubble";

function App() {
  const {
    userID,
    username,
    mana,
    storedMana,
    maxStoredMana,
    lastManaInterval,
    setCurrentProfileIcon,
    currentProfileIcon,
    profileIcons,
    currentProfileBorder,
    setCurrentProfileBorder,
    profileBorders,
  } = useMana();
  const MANA_RATE = 30;
  const navigate = useNavigate();

  const [isProfileIconOpen, setIsProfileIconOpen] = useState(false);
  const openProfileIcon = () => setIsProfileIconOpen(true);
  const closeProfileIcon = () => setIsProfileIconOpen(false);

  const [selectingIcons, setSelectingIcons] = useState(true);

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
            <h1>
              {`Mana: ${formatNumberWithCommas(mana)}`}
              <img className="CurrencyIcon" src={manaCurrencyImg} alt="" />
            </h1>
            <h1>
              {`Stored Mana: ${storedMana}/${maxStoredMana}`}
              <img className="CurrencyIcon" src={manaCurrencyImg} alt="" />
            </h1>
            <h2>
              {`Replenishes In:
                ${
                  storedMana >= maxStoredMana
                    ? "00:00:00"
                    : formatTime(
                        Math.max(
                          0,
                          -Math.floor((Date.now() - lastManaInterval) / 1000)
                        )
                      )
                } / ${
                storedMana >= maxStoredMana
                  ? "00:00:00"
                  : formatTime(
                      Math.max(
                        0,
                        -Math.floor((Date.now() - lastManaInterval) / 1000)
                      ) +
                        (maxStoredMana - storedMana - 1) * MANA_RATE
                    )
              }`}
            </h2>
          </div>
          <div
            className="ProfileIcon"
            onClick={openProfileIcon}
            style={
              (currentProfileBorder !== null) &
              (currentProfileBorder !== undefined)
                ? {}
                : { border: "1px solid rgb(50, 50, 60)" }
            }
          >
            {currentProfileBorder !== null &&
            currentProfileBorder !== undefined ? (
              <img
                className="ProfileBorder"
                src={getProfileBorder(currentProfileBorder)}
                alt=""
              />
            ) : (
              <div />
            )}
            <img
              className="ProfileIconImage"
              src={getProfileIcon(currentProfileIcon)}
              alt=""
            />
          </div>
          <VolumeSlider />
        </div>
      ) : (
        <div className="AppHeader" />
      )}
      {userID ? <ManaBubble /> : <div />}
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
        <div className="ProfileCustomizationType">
          <button
            onClick={() => {
              setSelectingIcons(true);
            }}
          >
            Icon
          </button>
          <button
            onClick={() => {
              setSelectingIcons(false);
            }}
          >
            Borders
          </button>
        </div>

        {selectingIcons ? (
          <div className="ProfileIconSelector">
            {getProfileIconList().map((icon, i) => {
              return (
                <div
                  className="ProfileIconChoice"
                  key={i}
                  onClick={() => {
                    if (profileIcons.includes(icon))
                      setCurrentProfileIcon(icon);
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
        ) : (
          <div className="ProfileBorderSelector">
            {getProfileBorderList().map((border, i) => {
              return (
                <div
                  className="ProfileBorderChoice"
                  key={i}
                  onClick={() => {
                    if (profileBorders?.includes(border))
                      currentProfileBorder === border
                        ? setCurrentProfileBorder(null)
                        : setCurrentProfileBorder(border);
                  }}
                >
                  {profileBorders?.includes(border) ? (
                    <div />
                  ) : (
                    <div className="ProfileBorderCover" />
                  )}
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      top: "0px",
                      left: "0px",
                    }}
                    src={getProfileIcon(currentProfileIcon)}
                    alt=""
                  />
                  <img src={getProfileBorder(border)} alt="" />
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
