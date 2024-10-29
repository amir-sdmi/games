import {
  CardsType,
  CurrentPlayer,
  GameType,
  TradeOffer,
} from "../_types/types";
import { cardName } from "../_utils/utils";
import Button from "./ui/Button";

export default function TradeTempShow({
  tradeTemp,
  setTradeTemp,
  game,
  setGame,
}: {
  tradeTemp: TradeOffer;
  setTradeTemp: (tradeTemp: TradeOffer) => void;
  game: GameType;
  setGame: (game: GameType) => void;
}) {
  const handleRemoveMarketCardFromTempTrade = (cardId: CardsType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    const tempCard = newTradeTemp.cardsFromMarket.find((c) => c.id === cardId);
    if (tempCard) {
      if (tempCard.quantity > 0) {
        tempCard.quantity--;
      }
      if (tempCard.quantity === 0) {
        newTradeTemp.cardsFromMarket = newTradeTemp.cardsFromMarket.filter(
          (c) => c.id !== cardId
        );
      }
    }
    setTradeTemp(newTradeTemp);

    const newCurrentPlayer: CurrentPlayer = { ...game.currentPlayer };
    newCurrentPlayer.markettingCards.push({ id: cardId, quantity: 1 });
    setGame({ ...game, currentPlayer: newCurrentPlayer });
  };
  const handleRemoveHandCardsFromTradeTemp = (cardId: CardsType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    const tempCard = newTradeTemp.cardsFromProposersHand.find(
      (c) => c.id === cardId
    );
    if (tempCard) {
      if (tempCard.quantity > 0) {
        tempCard.quantity--;
      }
      if (tempCard.quantity === 0) {
        newTradeTemp.cardsFromProposersHand =
          newTradeTemp.cardsFromProposersHand.filter((c) => c.id !== cardId);
      }
    }
    setTradeTemp(newTradeTemp);
  };
  return (
    <div className="border border-yellow-500">
      <p className="border border-yellow-400 text-red-600">TradeTemp :</p>
      <p className="border border-red-600">from Market:</p>
      <ul>
        {tradeTemp.cardsFromMarket.map((card, index) => (
          <div key={index}>
            <p>
              {cardName(card.id)} {card.quantity}
            </p>
            <Button
              onClick={() => handleRemoveMarketCardFromTempTrade(card.id)}
            >
              remove
            </Button>
          </div>
        ))}
      </ul>
      {tradeTemp.includePlayerHat && (
        <div>
          <p className="border border-red-600">HAT</p>
          <Button
            onClick={() =>
              setTradeTemp({ ...tradeTemp, includePlayerHat: false })
            }
          >
            remove
          </Button>
        </div>
      )}
      {tradeTemp.cardsFromProposersHand.length > 0 && (
        <div>
          <p>Hand :</p>
          {tradeTemp.cardsFromProposersHand.map((card, index) => (
            <div key={index}>
              <p>
                {cardName(card.id)} {card.quantity}{" "}
                <Button
                  onClick={() => handleRemoveHandCardsFromTradeTemp(card.id)}
                >
                  remove
                </Button>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
