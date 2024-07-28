import { useCallback, useEffect, useState } from "react";
import "./Blackjack.css";
import { useMana } from "../../../utils/AccountContext";
import Button from "./Button";
import Hand from "./Hand";

function Blackjack({ bet }) {
  const [winnings, setWinnings] = useState(0);
  const { mana, updateMana } = useMana();

  const [BLACKJACK, DEALERMIN] = [21, 16];

  const [game, setGame] = useState({
    deck: [],
    dealer: [],
    player: [],
    selected: 0,
    bet: 0,
    done: true,
    paid: false,
  });

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const countHand = (hand) => {
    let sum = 0;
    let hasAce = 0;
    hand?.forEach((card) => {
      let temp = card > 10 ? 10 : Math.floor(card);
      if (temp === 1) {
        hasAce++;
        temp += 10;
      }
      sum += temp;
    });

    while (hasAce > 0 && sum > BLACKJACK) {
      sum -= 10;
      hasAce--;
    }

    return sum;
  };
  const setup = useCallback(() => {
    const DECK = [
      1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 1.1,
      2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 1.2, 2.2,
      3.2, 4.2, 5.2, 6.2, 7.2, 8.2, 9.2, 10.2, 11.2, 12.2, 13.2, 1.3, 2.3, 3.3,
      4.3, 5.3, 6.3, 7.3, 8.3, 9.3, 10.3, 11.3, 12.3, 13.3,
    ];
    const newDeck = shuffleDeck([
      ...DECK,
      ...DECK,
      ...DECK,
      ...DECK,
      ...DECK,
      ...DECK,
    ]);
    const dealerHand = [newDeck.shift(), newDeck.shift()];
    const playerHand = [newDeck.shift(), newDeck.shift()];

    setGame({
      deck: newDeck,
      dealer: dealerHand,
      player: [playerHand],
      selected: 0,
      bet: Number(bet),
      done: countHand(playerHand) === BLACKJACK,
      paid: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bet]);

  const dealDealer = useCallback(
    (oldGame) => {
      const newGame = oldGame
        ? JSON.parse(JSON.stringify(oldGame))
        : JSON.parse(JSON.stringify(game));

      let dealerVal = countHand(newGame.dealer);

      while (dealerVal <= DEALERMIN && newGame.dealer.length < 5) {
        newGame.dealer.push(newGame.deck.shift());
        dealerVal = countHand(newGame.dealer);
      }

      newGame.done = true;
      setGame(newGame);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [game]
  );

  const checkGame = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    if (!newGame.done) {
      const sum = countHand(newGame.player[newGame.selected]);
      if (sum > BLACKJACK) {
        if (newGame.selected < newGame.player.length - 1) {
          newGame.selected++;
          setGame(newGame);
        } else {
          newGame.done = true;
          dealDealer(newGame);
        }
      } else if (newGame.player[newGame.selected].length === 5) {
        if (newGame.selected < newGame.player.length - 1) {
          newGame.selected++;
          setGame(newGame);
        } else {
          newGame.done = true;
          dealDealer(newGame);
        }
      }
    } else if (newGame.bet > 0) {
      let totalEarned = 0;
      let dealerVal = countHand(newGame.dealer);

      newGame.player.forEach((hand) => {
        let playerVal = countHand(hand);

        const blackjack =
          playerVal === BLACKJACK && newGame.player[0].length === 2;
        const higherValue = playerVal <= BLACKJACK && playerVal > dealerVal;
        const dealerBust = playerVal <= BLACKJACK && dealerVal > BLACKJACK;
        const fiveCards = playerVal <= BLACKJACK && hand.length === 5;
        const push = playerVal <= BLACKJACK && playerVal === dealerVal;

        if (blackjack) {
          totalEarned += Math.round(Number(bet) * 2.5);
        } else if (higherValue || dealerBust || fiveCards) {
          totalEarned += Number(bet) * 2;
        } else if (push) totalEarned += Number(bet);
      });

      if (!newGame.paid) {
        newGame.paid = true;
        setGame(newGame);
        setWinnings(totalEarned);
        if (totalEarned > 0) updateMana(Number(totalEarned));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, dealDealer]);

  const hit = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    newGame.player[newGame.selected].push(newGame.deck.shift());
    setGame(newGame);
  }, [game]);

  const stand = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    if (newGame.selected < newGame.player.length - 1) {
      newGame.selected++;
      setGame(newGame);
    } else dealDealer(newGame);
  }, [game, dealDealer]);

  const split = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    newGame.player.push([
      newGame.player[newGame.selected].pop(),
      newGame.deck.shift(),
    ]);
    newGame.player[newGame.selected].push(newGame.deck.shift());
    newGame.bet += Number(bet);
    setGame(newGame);

    updateMana(Number(-bet));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, bet]);

  const double = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    newGame.player[newGame.selected].push(newGame.deck.shift());
    newGame.bet += Number(bet);

    updateMana(Number(-bet));
    dealDealer(newGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, bet, dealDealer]);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    checkGame();
  }, [checkGame]);

  return (
    <div className="Blackjack">
      <div className="Controls">
        <Button
          name={"Hit"}
          handleOnClick={hit}
          active={!game.done}
          params={null}
        />
        <Button
          name={"Stand"}
          handleOnClick={stand}
          active={!game.done}
          params={null}
        />
        <Button
          name={"Split"}
          handleOnClick={split}
          active={
            !game.done &&
            game.player[game.selected]?.length === 2 &&
            Math.floor(game.player[game.selected][0]) ===
              Math.floor(game.player[game.selected][1]) &&
            game.player.length < 4 &&
            mana >= bet
          }
          params={null}
        />
        <Button
          name={"Double"}
          handleOnClick={double}
          active={
            !game.done &&
            game.player[game.selected]?.length === 2 &&
            game.player.length === 1 &&
            mana >= bet
          }
          params={null}
        />
      </div>
      {game.dealer.length > 0 && (
        <Hand
          hand={game.dealer}
          isDealer={true}
          countHand={countHand}
          isDone={game.done}
        />
      )}
      <div className="Player">
        {!game.done && (
          <img
            className="Selected"
            src="https://api.iconify.design/material-symbols:arrow-right-alt.svg?color=%23000000"
            alt=""
            style={{ top: `${game.selected * (3.5 + 0.5) + 1.575}rem` }}
          />
        )}
        {game.player.length > 0 &&
          game.player.map((hand, i) => (
            <Hand
              key={i}
              hand={hand}
              isDealer={false}
              countHand={countHand}
              isDone={game.done}
            />
          ))}
      </div>
      {!game.done ? (
        <div className="Winnings">
          {`Blackjack! Beat the dealer, but don't go over 21!`}
        </div>
      ) : (
        <div className="Winnings">{`Earned ${Number(
          winnings
        )} mana. Net gain ${Number(winnings - game.bet)} mana.`}</div>
      )}
      {!game.done ? (
        <div />
      ) : (
        <button
          className="ResetGame"
          onClick={() => {
            if (mana < bet) alert("Not enough mana!");
            else {
              updateMana(-bet);
              setup();
            }
          }}
        >
          Reset
        </button>
      )}
      <div className="Warning">
        Closing before finishing will not reward you of your winnings.
      </div>
    </div>
  );
}

export default Blackjack;
