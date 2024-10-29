import { useState } from "react";
import { CardsType, GameType, PlayerType, TradeOffer } from "../_types/types";
import { emptyTempTradeOffer } from "../_utils/gameInitial";
import Button from "./ui/Button";
import { isEqual } from "lodash";
import { plantFromMarket } from "../_utils/actions/plantFromMarket";
import { cardName, showHandCardsSeperately } from "../_utils/utils";
import TradeSetting from "./TradeSetting";
import TradeTempShow from "./TradeTempShow";

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

  const handleAddMarketCardToTradeTemp = (marketCard: CardsType) => {
    const newTempTrade: TradeOffer = { ...tradeTemp };
    // Find if the card already exists in hand
    const cardInTrade = tradeTemp.cardsFromMarket.find(
      (c) => c.id === marketCard.id
    );
    if (cardInTrade) {
      // Increase quantity if card is already in hand
      cardInTrade.quantity++;
      newTempTrade.cardsFromMarket = tradeTemp.cardsFromMarket.map((c) =>
        c.id === marketCard.id ? cardInTrade : c
      );
    } else {
      // Add the card to hand with quantity 1 if not already present
      newTempTrade.cardsFromMarket.push({ ...marketCard, quantity: 1 });
    }
    setGame({
      ...game,
      currentPlayer: {
        ...currentPlayer,
        markettingCards: currentPlayer.markettingCards.filter(
          (c) => c.id !== marketCard.id
        ),
      },
    });
    setTradeTemp(newTempTrade);
  };

  //TODO: ux is aweful ! make it better
  // const handleNewTradeOffer = () => {
  //   //if tradeTemp is empty, do nothing
  //   if (isEqual(tradeTemp, emptyTempTradeOffer(currentPlayer.id))) return;
  //   //if tradeTemp is already in tradeOffers, do nothing
  //   if (
  //     currentPlayer.tradeOffers.some((tradeOffer) =>
  //       isEqual(tradeOffer, tradeTemp)
  //     )
  //   )
  //     return;

  //   //if tradeTemp is already in tradeOffers, do nothing (based on cards type and count)
  //   currentPlayer.tradeOffers.map((tradeOffer) => {
  //     if (
  //       tradeOffer.cardsFromProposersHand.length ===
  //       tradeTemp.cardsFromProposersHand.length
  //     ) {
  //       console.log("same length");
  //       const arr = tradeOffer.cardsFromProposersHand.filter((cOffer) =>
  //         tradeTemp.cardsFromProposersHand.some(
  //           (cTemp) => cOffer.id === cTemp.id
  //         )
  //       );
  //       if (isEqual(arr, tradeOffer)) return;
  //     }
  //   });

  //   setGame({
  //     ...game,
  //     currentPlayer: {
  //       ...currentPlayer,
  //       tradeOffers: [...currentPlayer.tradeOffers, tradeTemp],
  //     },
  //   });
  //   setTradeTemp(emptyTempTradeOffer(currentPlayer.id));
  // };
  // const handleRemoveTradeOffer = (tradeOfferToDelete: TradeOffer) => {
  //   setGame({
  //     ...game,
  //     currentPlayer: {
  //       ...currentPlayer,
  //       tradeOffers: currentPlayer.tradeOffers.filter(
  //         (tradeOffer) => !isEqual(tradeOffer, tradeOfferToDelete)
  //       ),
  //     },
  //   });
  // };

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
              <Button onClick={() => handleAddMarketCardToTradeTemp(card)}>
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
      <TradeTempShow
        tradeTemp={tradeTemp}
        setTradeTemp={setTradeTemp}
        game={game}
        setGame={setGame}
      />
      {/* <div className="border-2 border-pink-500">
        <p>trade offers:</p>
        {currentPlayer.tradeOffers.map((tradeOffer, index) => (
          <div className="border-2 border-green-400" key={index}>
            cards from proposers hand:
            <ol>
              {tradeOffer.cardsFromProposersHand.map((card, i) => (
                <li key={i}>{cardName(card.id)}</li>
              ))}
            </ol>
            cards from market:
            <ol>
              {tradeOffer.cardsFromMarket.map((card, i) => (
                <li key={i}>{cardName(card.id)}</li>
              ))}
            </ol>
            other players hats:
            <ol>
              {tradeOffer.otherPlayersHats.map((hat, i) => (
                <li key={i}>{players[hat].playerName}</li>
              ))}
            </ol>
            current player hat: {tradeOffer.includePlayerHat ? "yes" : "no"}
            <Button onClick={() => handleRemoveTradeOffer(tradeOffer)}>
              Discard
            </Button>
          </div>
        ))}
      </div> */}
    </div>
  );
}
