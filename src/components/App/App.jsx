import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "../Login";
import Home from "../Home";
import Shop from "../Shop";
import Fishing from "../Fishing";
import Arcade from "../Arcade";
import Garden from "../Garden";
import { useMana } from "../../utils/ManaContext";
import { useEffect, useState } from "react";
import { getProfileIcon, getProfileIconList } from "../../utils/ProfileIcon";
import { formatNumberWithCommas } from "../../utils/Helper";
import Modal from "../Modal";

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
      {userID ? (
        <div className="AppHeader">
          <div className="Mana">
            <h1 className="Username">{`${username}`}</h1>
            <h1>{`Mana: ${formatNumberWithCommas(mana)}`}</h1>
            <h1>{`Stored Mana: ${storedMana}/${maxStoredMana}`}</h1>
            <h1>
              {`Next Increment:
        ${
          Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1 < 0
            ? 15
            : Math.round((nextManaInterval - lastManaInterval) / TICK_RATE) + 1
        }s`}
            </h1>
          </div>
          <div className="ProfileIcon" onClick={openProfileIcon}>
            <img src={getProfileIcon(currentProfileIcon)} alt="" />
          </div>
        </div>
      ) : (
        <div className="AppHeader" />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/fishing" element={<Fishing />} />
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

