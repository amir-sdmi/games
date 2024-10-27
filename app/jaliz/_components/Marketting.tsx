import { useState } from "react";
import { CardType, GameType, PlayerType, TradeOffer } from "../_types/types";
import { emptyTempTradeOffer } from "../_utils/gameInitial";
import Button from "./ui/Button";
import { isEqual } from "lodash";
import { plantFromMarket } from "../_utils/actions/plantFromMarket";

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
  const handleAddHandCardsToTrade = (handCard: CardType) => {
    //if card is already in trade, do nothing
    if (
      tradeTemp.cardsFromProposersHand.some(
        (c) => c.inHandOrMarketId === handCard.inHandOrMarketId
      )
    )
      return;

    const newTradeTemp = { ...tradeTemp };
    newTradeTemp.cardsFromProposersHand.push(handCard);
    setTradeTemp(newTradeTemp);
  };

  const handlePlantFromMarket = (fieldIndex: number, card: CardType) => {
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
  const handleAddPlayerHatToTrade = () => {
    const newTradeTemp = { ...tradeTemp };
    newTradeTemp.includePlayerHat = true;
    setTradeTemp(newTradeTemp);
  };
  const handleOthersHatsToTrade = (otherHat: PlayerType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    newTradeTemp.otherPlayersHats.push(otherHat);
    setTradeTemp(newTradeTemp);
  };
  const handleAddMarketCardToTrade = (marketCard: CardType) => {
    const newTradeTemp = { ...tradeTemp };
    newTradeTemp.cardsFromMarket.push(marketCard);
    setTradeTemp(newTradeTemp);
  };
  //TODO: ux is aweful ! make it better
  const handleNewTradeOffer = () => {
    //if tradeTemp is empty, do nothing
    if (isEqual(tradeTemp, emptyTempTradeOffer(currentPlayer.id))) return;
    //if tradeTemp is already in tradeOffers, do nothing
    if (
      currentPlayer.tradeOffers.some((tradeOffer) =>
        isEqual(tradeOffer, tradeTemp)
      )
    )
      return;

    //if tradeTemp is already in tradeOffers, do nothing (based on cards type and count)
    currentPlayer.tradeOffers.map((tradeOffer) => {
      if (
        tradeOffer.cardsFromProposersHand.length ===
        tradeTemp.cardsFromProposersHand.length
      ) {
        console.log("same length");
        const arr = tradeOffer.cardsFromProposersHand.filter((cOffer) =>
          tradeTemp.cardsFromProposersHand.some(
            (cTemp) => cOffer.id === cTemp.id
          )
        );
        if (isEqual(arr, tradeOffer)) return;
      }
    });

    setGame({
      ...game,
      currentPlayer: {
        ...currentPlayer,
        tradeOffers: [...currentPlayer.tradeOffers, tradeTemp],
      },
    });
    setTradeTemp(emptyTempTradeOffer(currentPlayer.id));
  };
  const handleRemoveTradeOffer = (tradeOfferToDelete: TradeOffer) => {
    setGame({
      ...game,
      currentPlayer: {
        ...currentPlayer,
        tradeOffers: currentPlayer.tradeOffers.filter(
          (tradeOffer) => !isEqual(tradeOffer, tradeOfferToDelete)
        ),
      },
    });
  };

  const isCardInTrade = (card: CardType) => {
    if (
      tradeTemp.cardsFromProposersHand.some(
        (c) => c.inHandOrMarketId === card.inHandOrMarketId
      )
    ) {
      return true;
    } else return false;
  };
  return (
    <div className="flex gap-2 border border-green-700">
      <div className="border border-blue-500">
        <p>Market !</p>
        {currentPlayer.markettingCards.map((card, index) => (
          <div key={index}>
            <p>
              card name: {card.name}
              {card.inHandOrMarketId}
            </p>
            <div>
              <Button onClick={() => handlePlantFromMarket(0, card)}>F1</Button>
              <Button onClick={() => handlePlantFromMarket(1, card)}>F2</Button>
              {players[currentPlayer.id].fields.length > 2 && (
                <Button onClick={() => handlePlantFromMarket(2, card)}>
                  F3
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border border-rose-800 ">
        <Button onClick={() => handleNewTradeOffer()}>trade</Button>
        <p>hand :</p>
        <ol>
          {players[currentPlayer.id].hand.map((card, index) => (
            <li className="flex gap-2 " key={index}>
              <p className={isCardInTrade(card) ? "text-red-500" : ""}>
                {card.name} {card.inHandOrMarketId}
              </p>
              <Button onClick={() => handleAddHandCardsToTrade(card)}>+</Button>
            </li>
          ))}
        </ol>
        <p>hats :</p>
        {players[currentPlayer.id].playerHat.ownedById === currentPlayer.id && (
          <div className="flex gap-2">
            <p>my hat</p>
            <Button onClick={() => handleAddPlayerHatToTrade()}>+</Button>
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
        <p>Market Cards : </p>
        <ol>
          {currentPlayer.markettingCards.map((card, index) => (
            <li className="flex gap-2" key={index}>
              <p>
                {card.name}
                {card.inHandOrMarketId}
              </p>
              <Button onClick={() => handleAddMarketCardToTrade(card)}>
                +
              </Button>
            </li>
          ))}
        </ol>
      </div>
      <div className="border-2 border-pink-500">
        <p>trade offers:</p>
        {currentPlayer.tradeOffers.map((tradeOffer, index) => (
          <div className="border-2 border-green-400" key={index}>
            cards from proposers hand:
            <ol>
              {tradeOffer.cardsFromProposersHand.map((card, i) => (
                <li key={i}>
                  {card.name}
                  {card.inHandOrMarketId}
                </li>
              ))}
            </ol>
            cards from market:
            <ol>
              {tradeOffer.cardsFromMarket.map((card, i) => (
                <li key={i}>
                  {card.name}
                  {card.inHandOrMarketId}
                </li>
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
      </div>
    </div>
  );
}
