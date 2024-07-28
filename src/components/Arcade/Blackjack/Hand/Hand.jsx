import Card from "./Card";
import "./Hand.css";

function Hand({ hand, isDealer, countHand, isDone }) {
  return (
    <div className="Hand">
      {hand?.map((card, i) => (
        <Card
          key={i}
          value={card}
          isHidden={isDealer ? i === 0 && !isDone : false}
        />
      ))}
      <h1 className="Count">
        {isDealer && !isDone ? countHand(hand.slice(1)) : countHand(hand)}
      </h1>
    </div>
  );
}

export default Hand;
