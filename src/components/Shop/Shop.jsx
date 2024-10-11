import { useNavigate } from "react-router-dom";
import "./Shop.css";
import Modal from "../Modal";
import { useState } from "react";
import { useMana } from "../../utils/ManaContext";
import { formatNumberWithCommas } from "../../utils/Helper";
import { getProfileIconList } from "../../utils/ProfileIcon";

function Shop() {
  const {
    mana,
    updateMana,
    maxStoredMana,
    setMaxStoredMana,
    setCurrentProfileIcon,
    profileIcons,
    setProfileIcons,
  } = useMana();
  const navigate = useNavigate();
  const [isManaLimitOpen, setIsManaLimitOpen] = useState(false);
  const openManaLimit = () => setIsManaLimitOpen(true);
  const closeManaLimit = () => setIsManaLimitOpen(false);

  const [isIconGachaOpen, setIsIconGachaOpen] = useState(false);
  const openIconGacha = () => setIsIconGachaOpen(true);
  const closeIconGacha = () => setIsIconGachaOpen(false);

  const [confirmedPurchase, setConfirmedPurchase] = useState(false);

  const RAISE_MAX_MANA_PRICE = 10000;
  const MAX_MANA_INCREMENT = 120; // 1 hour
  const PROFILE_ICON_GACHA_PRICE = 5000;

  return (
    <div className="Shop">
      <div className="ShopButtons">
        <button
          onClick={() => {
            setConfirmedPurchase(false);
            openManaLimit();
          }}
        >
          <div className="BubbleReflection" />
          Raise Mana Limit
        </button>
        <button
          onClick={() => {
            setConfirmedPurchase(false);
            openIconGacha();
          }}
        >
          <div className="BubbleReflection" />
          Profile Icon Gacha
        </button>
      </div>
      <button className="HomeButton" onClick={() => navigate("/")}>
        <div className="BubbleReflection" />
        <img
          src="https://api.iconify.design/ic:round-home.svg?color=%2332323c"
          alt=""
        />
      </button>

      <Modal
        isOpen={isManaLimitOpen}
        onClose={closeManaLimit}
        title="Raise Mana Limit"
      >
        {!confirmedPurchase ? (
          <div className="ShopMessage">
            <h1>{`Spend ${formatNumberWithCommas(
              RAISE_MAX_MANA_PRICE
            )} to increase max stored mana by ${MAX_MANA_INCREMENT} mana? (1 Hour)`}</h1>
            <div className="ShopDecision">
              <button
                onClick={() => {
                  if (mana <= RAISE_MAX_MANA_PRICE) {
                    alert("Not enough mana!");
                    closeManaLimit();
                  } else if (maxStoredMana >= 20160) {
                    alert("You have reached max cap!");
                    closeManaLimit();
                  } else {
                    setConfirmedPurchase(true);
                    updateMana(-RAISE_MAX_MANA_PRICE);
                    setMaxStoredMana((prev) => prev + MAX_MANA_INCREMENT);
                  }
                }}
              >
                Yes
              </button>
              <button onClick={closeManaLimit}>No</button>
            </div>
          </div>
        ) : (
          <div className="ShopMessage">
            <h1>{`You have raised your max stored mana cap by ${MAX_MANA_INCREMENT} mana!`}</h1>
            <h1>{`Current max stored mana cap: ${maxStoredMana}`}</h1>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isIconGachaOpen}
        onClose={closeIconGacha}
        title="Profile Icon Gacha"
      >
        <div className="ShopMessage">
          <h1>{`Spend ${formatNumberWithCommas(
            PROFILE_ICON_GACHA_PRICE
          )} to get a random profile icon? Dupes are refunded 20%.`}</h1>
          <div className="ShopDecision">
            <button
              onClick={() => {
                if (mana <= PROFILE_ICON_GACHA_PRICE) {
                  alert("Not enough mana!");
                  closeIconGacha();
                } else {
                  const profileIconList = getProfileIconList();
                  const selectedIcon = Math.floor(
                    Math.random() * profileIconList.length
                  );
                  setCurrentProfileIcon(selectedIcon);
                  if (profileIcons.includes(selectedIcon)) {
                    alert(
                      `You have already obtained this icon! Refunded ${Math.floor(
                        PROFILE_ICON_GACHA_PRICE * 0.2
                      )}`
                    );
                    updateMana(-Math.floor(PROFILE_ICON_GACHA_PRICE * 0.8));
                  } else {
                    alert(`You have purchased a new icon!`);
                    updateMana(-PROFILE_ICON_GACHA_PRICE);
                    setProfileIcons((prev) => [...prev, selectedIcon]);
                  }
                  closeIconGacha();
                }
              }}
            >
              Yes
            </button>
            <button onClick={closeIconGacha}>No</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Shop;
