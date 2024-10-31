import {
  CardsType,
  CurrentPlayer,
  PlayerType,
  TradeOffer,
} from "../../_types/types";
import Button from "../ui/Button";
import { cardName } from "../../_utils/utils";
import { cardData } from "../../_utils/cardData";

export default function TradeSetting({
  tradeTemp,
  setTradeTemp,
  currentPlayer,
  players,
}: {
  currentPlayer: CurrentPlayer;
  players: PlayerType[];
  tradeTemp: TradeOffer;
  setTradeTemp: (tradeTemp: TradeOffer) => void;
}) {
  //handlers
  const handleAddPlayerHatToTrade = () => {
    setTradeTemp({ ...tradeTemp, includePlayerHat: true });
  };
  const handleOthersHatsToTrade = (otherHat: PlayerType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    newTradeTemp.otherPlayersHats.push(otherHat);
    setTradeTemp(newTradeTemp);
  };
  const handleAddHandCardToTradeTemp = (cardId: CardsType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    const tempCard = newTradeTemp.cardsFromProposersHand.find(
      (c) => c.id === cardId
    );
    if (tempCard) {
      tempCard.quantity++;
      newTradeTemp.cardsFromProposersHand =
        newTradeTemp.cardsFromProposersHand.map((c) =>
          c.id === cardId ? tempCard : c
        );
    } else {
      newTradeTemp.cardsFromProposersHand.push({ id: cardId, quantity: 1 });
    }
    setTradeTemp(newTradeTemp);
  };
  const handleAddRequestToTradeTemp = (cardId: CardsType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    const tempCard = newTradeTemp.requestCards.find((c) => c.id === cardId);
    if (tempCard) {
      tempCard.quantity++;
      newTradeTemp.requestCards = newTradeTemp.requestCards.map((c) =>
        c.id === cardId ? tempCard : c
      );
    } else {
      newTradeTemp.requestCards.push({ id: cardId, quantity: 1 });
    }
    setTradeTemp(newTradeTemp);
  };

  return (
    <div className="border-4 border-rose-800 flex gap-2">
      <div className="border-2 border-yellow-400 ">
        <p>hand :</p>
        {players[currentPlayer.id].hand.map((card, index) => (
          <div key={index} className="flex gap-2">
            <p>
              {cardName(card.id)}
              {card.quantity -
                (tradeTemp.cardsFromProposersHand.find((c) => c.id === card.id)
                  ?.quantity ?? 0)}
            </p>
            <Button
              disabled={
                card.quantity -
                  (tradeTemp.cardsFromProposersHand.find(
                    (c) => c.id === card.id
                  )?.quantity ?? 0) ===
                0
              }
              onClick={() => handleAddHandCardToTradeTemp(card.id)}
            >
              +
            </Button>
          </div>
        ))}
        <p>hats :</p>
        {players[currentPlayer.id].playerHat.ownedById === currentPlayer.id && (
          <div className="flex gap-2">
            <p>my hat</p>
            <Button
              disabled={tradeTemp.includePlayerHat}
              onClick={() => handleAddPlayerHatToTrade()}
            >
              +
            </Button>
          </div>
        )}
        {players[currentPlayer.id].otherPlayersHats.map((hatOwnerId, index) => (
          <div key={index} className="flex gap-2">
            <p>{players[hatOwnerId].playerName} hat</p>
            <Button onClick={() => handleOthersHatsToTrade(hatOwnerId)}>
              +
            </Button>
          </div>
        ))}
      </div>
      <div className="border-2 border-blue-400">
        Requests
        {cardData.map((card, index) => (
          <div key={index} className="flex gap-2">
            <p>{card.name}</p>

            <Button onClick={() => handleAddRequestToTradeTemp(card.id)}>
              +
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
