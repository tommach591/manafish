import { useNavigate } from "react-router-dom";
import "./Shop.css";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { useMana } from "../../utils/ManaContext";
import { formatNumberWithCommas } from "../../utils/Helper";
import { getProfileIcon, getProfileIconList } from "../../utils/ProfileIcon";
import aivyGremlinGif from "../../assets/miscImage/aivyGremlin.gif";
import aivyFishingGif from "../../assets/miscImage/aivyFishing.gif";

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

  const RAISE_MAX_MANA_PRICE = 10000;
  const MAX_MANA_INCREMENT = 120; // 1 hour
  const MAX_MANA_CAP = 20160;
  const PROFILE_ICON_GACHA_PRICE = 5000;

  const [
    CONFIRM_PURCHASE,
    NOT_ENOUGH_MANA,
    MAX_REACHED,
    INCREASE_MAX,
    DUPLICATE_ICON,
    ICON_PURCHASED,
  ] = [0, 1, 2, 3, 4, 5, 6];
  const [confirmedPurchase, setConfirmedPurchase] = useState(CONFIRM_PURCHASE);
  const [price, setPrice] = useState(0);
  const [purchasedIcon, setPurchasedIcon] = useState(0);

  const getShopMessage = () => {
    switch (confirmedPurchase) {
      case NOT_ENOUGH_MANA:
        return (
          <div className="ShopMessage">
            <h1>{`Not enough mana!`}</h1>
            <h1>{`Price: ${formatNumberWithCommas(price)}`}</h1>
          </div>
        );
      case MAX_REACHED:
        return (
          <div className="ShopMessage">
            <h1>{`You have reached the max stored mana cap: ${MAX_MANA_CAP}!`}</h1>
          </div>
        );
      case INCREASE_MAX:
        return (
          <div className="ShopMessage">
            <h1>{`You have raised your max stored mana cap by ${MAX_MANA_INCREMENT} mana!`}</h1>
            <h1>{`Current max stored mana cap: ${formatNumberWithCommas(
              maxStoredMana
            )}`}</h1>
          </div>
        );
      case DUPLICATE_ICON:
        return (
          <div className="ShopMessage">
            <h1>{`You got a duplicate icon!`}</h1>
            <img src={getProfileIcon(purchasedIcon)} alt="" />
            <h1>{`Refunded: ${formatNumberWithCommas(
              Math.floor(PROFILE_ICON_GACHA_PRICE * 0.2)
            )}`}</h1>
            <button onClick={() => setCurrentProfileIcon(purchasedIcon)}>
              Equip
            </button>
          </div>
        );
      case ICON_PURCHASED:
        return (
          <div className="ShopMessage">
            <h1>{`Obtained new icon!`}</h1>
            <img src={getProfileIcon(purchasedIcon)} alt="" />
            <button onClick={() => setCurrentProfileIcon(purchasedIcon)}>
              Equip
            </button>
          </div>
        );
      default:
        return <div />;
    }
  };

  useEffect(() => {
    switch (confirmedPurchase) {
      case INCREASE_MAX: {
        updateMana(-RAISE_MAX_MANA_PRICE);
        setMaxStoredMana((prev) => prev + MAX_MANA_INCREMENT);
        break;
      }
      case DUPLICATE_ICON: {
        updateMana(-Math.floor(PROFILE_ICON_GACHA_PRICE * 0.8));
        break;
      }
      case ICON_PURCHASED: {
        updateMana(-PROFILE_ICON_GACHA_PRICE);
        setProfileIcons((prev) => [...prev, purchasedIcon]);
        break;
      }
      default:
        return;
    }
  }, [
    confirmedPurchase,
    DUPLICATE_ICON,
    ICON_PURCHASED,
    INCREASE_MAX,
    purchasedIcon,
    setMaxStoredMana,
    setProfileIcons,
    updateMana,
  ]);

  return (
    <div className="Shop">
      <img className="ShopNPC" src={aivyFishingGif} alt="" style={{animation: "ShopNPCAnimation 0.75s ease-out forwards"}}/>
      <div className="ShopButtons">
        <button
          onClick={() => {
            setConfirmedPurchase(CONFIRM_PURCHASE);
            setPrice(RAISE_MAX_MANA_PRICE);
            openManaLimit();
          }}
        >
          <div className="BubbleReflection" />
          Raise Mana Limit
        </button>
        <button
          onClick={() => {
            setConfirmedPurchase(CONFIRM_PURCHASE);
            setPrice(PROFILE_ICON_GACHA_PRICE);
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
        <div className="AivyGremlin">
          <img  src={aivyGremlinGif} alt=""/>
        </div>
        {confirmedPurchase === CONFIRM_PURCHASE ? (
          <div className="ShopMessage">
            <h1>{`Spend ${formatNumberWithCommas(
              RAISE_MAX_MANA_PRICE
            )} to increase max stored mana by ${MAX_MANA_INCREMENT} mana? (1 Hour)`}</h1>
            <div className="ShopDecision">
              <button
                onClick={() => {
                  if (mana <= RAISE_MAX_MANA_PRICE) {
                    setConfirmedPurchase(NOT_ENOUGH_MANA);
                  } else if (maxStoredMana >= MAX_MANA_CAP) {
                    setConfirmedPurchase(MAX_REACHED);
                  } else {
                    setConfirmedPurchase(INCREASE_MAX);
                  }
                }}
              >
                Yes
              </button>
              <button onClick={closeManaLimit}>No</button>
            </div>
          </div>
        ) : (
          getShopMessage()
        )}
      </Modal>

      <Modal
        isOpen={isIconGachaOpen}
        onClose={closeIconGacha}
        title="Profile Icon Gacha"
      >
        <div className="AivyGremlin">
          <img  src={aivyGremlinGif} alt=""/>
        </div>
        {confirmedPurchase === CONFIRM_PURCHASE ? (
          <div className="ShopMessage">
            <h1>{`Spend ${formatNumberWithCommas(
              PROFILE_ICON_GACHA_PRICE
            )} to get a random profile icon?`}</h1>
            <h1>Duplicate icons are refunded 20%.</h1>
            <div className="ShopDecision">
              <button
                onClick={() => {
                  if (mana <= PROFILE_ICON_GACHA_PRICE) {
                    setConfirmedPurchase(NOT_ENOUGH_MANA);
                  } else {
                    const profileIconList = getProfileIconList();
                    const selectedIcon = Math.floor(
                      Math.random() * profileIconList.length
                    );
                    setPurchasedIcon(selectedIcon);
                    if (profileIcons.includes(selectedIcon)) {
                      setConfirmedPurchase(DUPLICATE_ICON);
                    } else {
                      setConfirmedPurchase(ICON_PURCHASED);
                    }
                  }
                }}
              >
                Yes
              </button>
              <button onClick={closeIconGacha}>No</button>
            </div>
          </div>
        ) : (
          getShopMessage()
        )}
      </Modal>
    </div>
  );
}

export default Shop;
