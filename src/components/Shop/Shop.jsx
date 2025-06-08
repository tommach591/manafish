import "./Shop.css";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { useMana } from "../../utils/ManaContext";
import { formatNumberWithCommas } from "../../utils/Helper";
import { getProfileIcon, getProfileIconList } from "../../utils/ProfileIcon";
import aivyGremlinGif from "../../assets/miscImage/aivyGremlin.gif";
import aivyFishingGif from "../../assets/miscImage/aivyFishing.gif";
import { useFish } from "../../utils/FishContext";
import HomeButton from "../HomeButton";
import LogoutButton from "../LogoutButton";

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
  const { fishCaught, aliensCaught, unlockAliens } = useFish();
  const [isManaLimitOpen, setIsManaLimitOpen] = useState(false);
  const openManaLimit = () => setIsManaLimitOpen(true);
  const closeManaLimit = () => setIsManaLimitOpen(false);

  const [isIconGachaOpen, setIsIconGachaOpen] = useState(false);
  const openIconGacha = () => setIsIconGachaOpen(true);
  const closeIconGacha = () => setIsIconGachaOpen(false);

  const [isPremiumIconGachaOpen, setIsPremiumIconGachaOpen] = useState(false);
  const openPremiumIconGacha = () => setIsPremiumIconGachaOpen(true);
  const closePremiumIconGacha = () => setIsPremiumIconGachaOpen(false);

  const [isSpaceshipOpen, setIsSpaceshipOpen] = useState(false);
  const openSpaceship = () => setIsSpaceshipOpen(true);
  const closeSpaceship = () => setIsSpaceshipOpen(false);

  const RAISE_MAX_MANA_PRICE = 10000;
  const MAX_MANA_INCREMENT = 120; // 1 hour
  const MAX_MANA_CAP = 20160;
  const PROFILE_ICON_GACHA_PRICE = 5000;
  const PREMIUM_PROFILE_ICON_GACHA_PRICE = 25000;
  const SPACESHIP_PRICE = 150000;

  const [
    CONFIRM_PURCHASE,
    NOT_ENOUGH_MANA,
    MAX_REACHED,
    INCREASE_MAX,
    DUPLICATE_ICON,
    ICON_PURCHASED,
    PREMIUM_ICON_PURCHASED,
    NOT_ENOUGH_FISH,
    SPACESHIP_ALREADY_UNLOCKED,
    SPACESHIP_PURCHASED,
    COMING_SOON,
  ] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const [confirmedPurchase, setConfirmedPurchase] = useState(CONFIRM_PURCHASE);
  const [price, setPrice] = useState(0);
  const [purchasedIcon, setPurchasedIcon] = useState(0);

  const premiumIcons = [
    55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
    74, 75,
  ];

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
              Math.floor(price * 0.2)
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
      case PREMIUM_ICON_PURCHASED:
        return (
          <div className="ShopMessage">
            <h1>{`Obtained new icon!`}</h1>
            <img src={getProfileIcon(purchasedIcon)} alt="" />
            <button onClick={() => setCurrentProfileIcon(purchasedIcon)}>
              Equip
            </button>
          </div>
        );
      case NOT_ENOUGH_FISH:
        return (
          <div className="ShopMessage">
            <h1>{`You have not caught 107 fish from Mana's Beach`}</h1>
            <h1>{`Fish Caught: ${Object.keys(fishCaught).length}`}</h1>
          </div>
        );
      case SPACESHIP_ALREADY_UNLOCKED:
        return (
          <div className="ShopMessage">
            <h1>{`You already own a spaceship!`}</h1>
          </div>
        );
      case SPACESHIP_PURCHASED:
        return (
          <div className="ShopMessage">
            <h1>{`You have bought a Spaceship! Yippee!`}</h1>
          </div>
        );
      case COMING_SOON:
        return (
          <div className="ShopMessage">
            <h1>{`Coming soon!`}</h1>
          </div>
        );
      default:
        return <div />;
    }
  };

  useEffect(() => {
    switch (confirmedPurchase) {
      case INCREASE_MAX: {
        updateMana(-price);
        setMaxStoredMana((prev) => prev + MAX_MANA_INCREMENT);
        break;
      }
      case DUPLICATE_ICON: {
        updateMana(-Math.floor(price * 0.8));
        break;
      }
      case ICON_PURCHASED: {
        updateMana(-price);
        setProfileIcons((prev) => [...prev, purchasedIcon]);
        break;
      }
      case PREMIUM_ICON_PURCHASED: {
        updateMana(-price);
        setProfileIcons((prev) => [...prev, purchasedIcon]);
        break;
      }
      case SPACESHIP_PURCHASED: {
        updateMana(-price);
        unlockAliens();
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
    PREMIUM_ICON_PURCHASED,
    SPACESHIP_PURCHASED,
    purchasedIcon,
    setMaxStoredMana,
    setProfileIcons,
    updateMana,
    price,
    unlockAliens,
  ]);

  return (
    <div className="Shop">
      <img
        className="ShopNPC"
        src={aivyFishingGif}
        alt=""
        style={{ animation: "ShopNPCAnimation 0.75s ease-out forwards" }}
      />
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
          Icon Gacha
        </button>
        <button
          onClick={() => {
            setConfirmedPurchase(CONFIRM_PURCHASE);
            setPrice(
              PREMIUM_PROFILE_ICON_GACHA_PRICE +
                2000 *
                  premiumIcons.filter((item) => profileIcons.includes(item))
                    .length
            );
            openPremiumIconGacha();
          }}
        >
          <div className="BubbleReflection" />
          Premium Gacha
        </button>
        <button
          onClick={() => {
            setConfirmedPurchase(COMING_SOON);
            setPrice(0);
            openSpaceship();
            /*
            setConfirmedPurchase(CONFIRM_PURCHASE);
            setPrice(SPACESHIP_PRICE);
            openSpaceship();
            */
          }}
        >
          <div className="BubbleReflection" />
          Spaceship
        </button>
      </div>
      <HomeButton />
      <LogoutButton />
      <Modal
        isOpen={isManaLimitOpen}
        onClose={closeManaLimit}
        title="Raise Mana Limit"
      >
        <div className="AivyGremlin">
          <img src={aivyGremlinGif} alt="" />
        </div>
        {confirmedPurchase === CONFIRM_PURCHASE ? (
          <div className="ShopMessage">
            <h1>{`Spend ${formatNumberWithCommas(
              price
            )} to increase max stored mana by ${MAX_MANA_INCREMENT} mana? (1 Hour)`}</h1>
            <div className="ShopDecision">
              <button
                onClick={() => {
                  if (mana <= price) {
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
          <img src={aivyGremlinGif} alt="" />
        </div>
        {confirmedPurchase === CONFIRM_PURCHASE ? (
          <div className="ShopMessage">
            <h1>{`Spend ${formatNumberWithCommas(
              price
            )} to get a random profile icon?`}</h1>
            <h1>Duplicate icons are refunded 20%.</h1>
            <div className="ShopDecision">
              <button
                onClick={() => {
                  if (mana <= price) {
                    setConfirmedPurchase(NOT_ENOUGH_MANA);
                  } else {
                    const profileIconList = getProfileIconList();
                    let selectedIcon = Math.floor(
                      Math.random() * profileIconList.length
                    );
                    while (premiumIcons.includes(selectedIcon))
                      selectedIcon = Math.floor(
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

      <Modal
        isOpen={isPremiumIconGachaOpen}
        onClose={closePremiumIconGacha}
        title="Premium Profile Icon Gacha"
      >
        <div className="AivyGremlin">
          <img src={aivyGremlinGif} alt="" />
        </div>
        {confirmedPurchase === CONFIRM_PURCHASE ? (
          <div className="ShopMessage">
            <h1>{`Spend ${formatNumberWithCommas(
              price
            )} to get a random PREMIUM profile icon?`}</h1>
            <h1>Duplicate icons are refunded 20%.</h1>
            <div className="ShopDecision">
              <button
                onClick={() => {
                  if (mana <= price) {
                    setConfirmedPurchase(NOT_ENOUGH_MANA);
                  } else {
                    let selectedIcon =
                      premiumIcons[
                        Math.floor(Math.random() * premiumIcons.length)
                      ];
                    setPurchasedIcon(selectedIcon);
                    if (profileIcons.includes(selectedIcon)) {
                      setConfirmedPurchase(DUPLICATE_ICON);
                    } else {
                      setConfirmedPurchase(PREMIUM_ICON_PURCHASED);
                    }
                  }
                }}
              >
                Yes
              </button>
              <button onClick={closePremiumIconGacha}>No</button>
            </div>
          </div>
        ) : (
          getShopMessage()
        )}
      </Modal>

      <Modal
        isOpen={isSpaceshipOpen}
        onClose={closeSpaceship}
        title="Purchase Spaceship"
      >
        <div className="AivyGremlin">
          <img src={aivyGremlinGif} alt="" />
        </div>
        {confirmedPurchase === CONFIRM_PURCHASE ? (
          <div className="ShopMessage">
            <h1>{`Spend ${formatNumberWithCommas(
              price
            )} to unlock Spaceship?`}</h1>
            <h1>Must have caught 107 fishes from Mana's Beach.</h1>
            <div className="ShopDecision">
              <button
                onClick={() => {
                  if (aliensCaught !== null) {
                    setConfirmedPurchase(SPACESHIP_ALREADY_UNLOCKED);
                  } else if (mana <= price) {
                    setConfirmedPurchase(NOT_ENOUGH_MANA);
                  } else if (Object.entries(fishCaught).length < 107) {
                    setConfirmedPurchase(NOT_ENOUGH_FISH);
                  } else {
                    setConfirmedPurchase(SPACESHIP_PURCHASED);
                  }
                }}
              >
                Yes
              </button>
              <button onClick={closeSpaceship}>No</button>
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
