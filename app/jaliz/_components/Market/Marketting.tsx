import { useState } from "react";
import {
  CardsType,
  GameType,
  PlayerType,
  TradeOffer,
} from "../../_types/types";
import { emptyTempTradeOffer } from "../../_utils/gameInitial";
import Button from "../ui/Button";
import { plantFromMarket } from "../../_utils/actions/plantFromMarket";
import { cardName } from "../../_utils/utils";
import TradeSetting from "./TradeSetting";
import TradeTemp from "./TradeTemp";
import TradeOffers from "./TradeOffers";

export default function Marketting({
  game,
  setGame,
}: {
  game: GameType;
  setGame: (game: GameType) => void;
}) {
  const { currentPlayer, players } = game;
  const [tradeTemp, setTradeTemp] = useState(
    emptyTempTradeOffer(currentPlayer.id)
  );
  const [selectedMarketCards, setSelectedMarketCards] = useState<boolean[]>([
    false,
    false,
  ]);

  //handlers
  const handlePlantFromMarket = (fieldIndex: number, card: CardsType) => {
    const { currentPlayer: newCurrentPlayer, player } = plantFromMarket(
      currentPlayer,
      fieldIndex,
      players[currentPlayer.id],
      card
    );
    setGame({
      ...game,
      currentPlayer: newCurrentPlayer,
      players: players.map((p) => (p.id === currentPlayer.id ? player : p)),
    });
  };

  const handleAddMarketCardToTradeTemp = (
    marketCard: CardsType,
    index: number
  ) => {
    const newTempTrade: TradeOffer = { ...tradeTemp };
    // Find if the card already exists in temp
    const cardInTrade = tradeTemp.cardsFromMarket.find(
      (c) => c.id === marketCard.id
    );
    if (cardInTrade) {
      // Increase quantity if card is already in temp
      cardInTrade.quantity++;
      newTempTrade.cardsFromMarket = tradeTemp.cardsFromMarket.map((c) =>
        c.id === marketCard.id ? cardInTrade : c
      );
    } else {
      // Add the card to temp with quantity 1 if not already present
      newTempTrade.cardsFromMarket.push({ ...marketCard, quantity: 1 });
    }
    setTradeTemp(newTempTrade);
    const newMarketCards = [...selectedMarketCards];
    newMarketCards[index] = true;
    setSelectedMarketCards(newMarketCards);
  };

  return (
    <div className="flex gap-2 border border-green-700">
      <div className="border border-blue-500">
        <p>Market !</p>
        {currentPlayer.markettingCards.map((card, index) => (
          <div key={index}>
            <p>card name: {cardName(card.id)}</p>
            <div>
              <Button onClick={() => handlePlantFromMarket(0, card)}>F1</Button>
              <Button onClick={() => handlePlantFromMarket(1, card)}>F2</Button>
              {players[currentPlayer.id].fields.length > 2 && (
                <Button onClick={() => handlePlantFromMarket(2, card)}>
                  F3
                </Button>
              )}
              <Button
                onClick={() => handleAddMarketCardToTradeTemp(card, index)}
                disabled={selectedMarketCards[index]}
              >
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
      <TradeSetting
        currentPlayer={currentPlayer}
        players={players}
        setTradeTemp={setTradeTemp}
        tradeTemp={tradeTemp}
      />
      <TradeTemp
        tradeTemp={tradeTemp}
        setTradeTemp={setTradeTemp}
        game={game}
        setGame={setGame}
        selectedMarketCards={selectedMarketCards}
        setSelectedMarketCards={setSelectedMarketCards}
      />
      <TradeOffers game={game} setGame={setGame} />
    </div>
  );
}
