import { useState } from "react";
import {
  CardType,
  CurrentPlayer,
  GameType,
  HatType,
  PlayerType,
  TradeOffer,
} from "../_types/types";
import { addCardsToHand } from "../_utils/actions/addCardsToHand";
import { buy } from "../_utils/actions/buy";
import { harvest } from "../_utils/actions/harvest";
import { plantFromHand } from "../_utils/actions/plantFromHand";
import { plantFromMarket } from "../_utils/actions/plantFromMarket";
import { cardData } from "../_utils/cardData";
import { nextRound } from "../_utils/gameMaster";

export default function Gameboard({
  game,
  setGame,
}: {
  game: GameType;
  setGame: (game: GameType) => void;
}) {
  const {
    players,
    currentPlayer,
    availableManures,
    availableTractors,
    deck,
    discardPile,
    endTurnReceivingCardsCount,
    round,
  } = game;
  const [tradeTemp, setTradeTemp] = useState<TradeOffer>({
    proposerId: currentPlayer.id,
    cardsFromProposersHand: [],
    cardsFromMarket: [],
    otherPlayersHats: [],
    includePlayerHat: false,
  });
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
  const handlePlantFromHand = (
    fieldIndex: number,
    card: CardType,
    player: PlayerType
  ) => {
    const {
      hand: newHand,
      field: newField,
      currentPlayer: newCurrentPlayer,
    } = plantFromHand(
      player.hand,
      player.fields[fieldIndex],
      card,
      currentPlayer
    );

    setGame({
      ...game,
      players: players.map((p) =>
        p.id === player.id
          ? {
              ...p,
              hand: newHand,
              fields: p.fields.map((f, i) => (i === fieldIndex ? newField : f)),
            }
          : p
      ),
      currentPlayer: newCurrentPlayer,
    });
  };

  const handleHarvest = (fieldIndex: number, player: PlayerType) => {
    const {
      field: newField,
      money,
      discardPile: newDiscardPile,
    } = harvest(player.fields[fieldIndex], discardPile);
    setGame({
      ...game,
      players: players.map((p) =>
        p.id === player.id
          ? {
              ...p,
              fields: p.fields.map((f, i) => (i === fieldIndex ? newField : f)),
              money: p.money + money,
            }
          : p
      ),
      discardPile: newDiscardPile,
    });
  };

  const handleAddCardsToHand = (player: PlayerType) => {
    let updatedGame = { ...game };
    if (updatedGame.deck.length < updatedGame.endTurnReceivingCardsCount) {
      console.log("next round");
      updatedGame = nextRound(updatedGame);
    }
    updatedGame = addCardsToHand(updatedGame, player);
    setGame(updatedGame);
  };

  const handleBuy = (
    player: PlayerType,
    type: "field" | "manure" | "tractor" | "cards",
    price: number,
    fieldId?: number
  ) => {
    const { updatedPlayer, updatedDeck, updatedManures, updatedTractors } = buy(
      player,
      deck,
      availableManures,
      availableTractors,
      type,
      price,
      fieldId
    );

    setGame({
      ...game,
      players: players.map((p) => (p.id === player.id ? updatedPlayer : p)),
      deck: updatedDeck,
      availableManures: updatedManures,
      availableTractors: updatedTractors,
    });
  };

  const handleShowCards = () => {
    const newDeck = [...deck];

    const newCurrentPlayer: CurrentPlayer = {
      ...currentPlayer,
      markettingCards: newDeck.splice(0, 2),
      turnStatus: "marketting",
    };

    setGame({
      ...game,
      currentPlayer: newCurrentPlayer,
      deck: newDeck,
    });
  };

  const handleAddHandCardsToTrade = (handCard: CardType) => {
    const newTradeTemp = { ...tradeTemp };
    newTradeTemp.cardsFromProposersHand.push(handCard);
    setTradeTemp(newTradeTemp);
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

  return (
    <div>
      <div>
        <h1>Gameboard</h1>
        <p>round : {round}</p>
        <p>deck : {deck.length} cards</p>
        <p>discards : {discardPile.length}</p>
        <p>players number: {players.length}</p>
        <p>
          current player: {currentPlayer.id} : {currentPlayer.turnStatus}
        </p>
        <p>available manures: {availableManures}</p>
        <p>available tractors: {availableTractors}</p>
        <p>end turn receiving cards count: {endTurnReceivingCardsCount}</p>
        <hr />
      </div>
      {currentPlayer.turnStatus === "marketting" && (
        <div className="flex gap-2 border border-green-700">
          <div className="border border-blue-500">
            <p>Market !</p>
            <button className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700">
              trade
            </button>
            {currentPlayer.markettingCards.map((card, index) => (
              <div key={index}>
                <p>card name: {card.name}</p>
                <div>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                    onClick={() => handlePlantFromMarket(0, card)}
                  >
                    F1
                  </button>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                    onClick={() => handlePlantFromMarket(1, card)}
                  >
                    F2
                  </button>
                  {players[currentPlayer.id].fields.length > 2 && (
                    <button
                      className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                      onClick={() => handlePlantFromMarket(2, card)}
                    >
                      F3
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border border-rose-800 ">
            <button
              className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
              onClick={() =>
                setGame({
                  ...game,
                  currentPlayer: {
                    ...currentPlayer,
                    tradeOffers: [...currentPlayer.tradeOffers, tradeTemp],
                  },
                })
              }
            >
              trade
            </button>
            <p>hand :</p>
            <ol>
              {players[currentPlayer.id].hand.map((card, index) => (
                <li className="flex gap-2" key={index}>
                  <p>{card.name}</p>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-1 text-gray-700 disabled:bg-gray-400"
                    onClick={() => handleAddHandCardsToTrade(card)}
                  >
                    +
                  </button>
                </li>
              ))}
            </ol>
            <p>hats :</p>
            {players[currentPlayer.id].playerHat.ownedById ===
              currentPlayer.id && (
              <div className="flex gap-2">
                <p>my hat</p>
                <button
                  className="border border-green-500 bg-gray-200 rounded px-1 text-gray-700 disabled:bg-gray-400"
                  onClick={() => handleAddPlayerHatToTrade()}
                >
                  +
                </button>
              </div>
            )}
            {players[currentPlayer.id].otherPlayersHats.map(
              (hatOwnerId, index) => (
                <div key={index} className="flex gap-2">
                  <p>{players[hatOwnerId].playerName} hat</p>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-1 text-gray-700 disabled:bg-gray-400"
                    onClick={() => handleOthersHatsToTrade(hatOwnerId)}
                  >
                    +
                  </button>
                </div>
              )
            )}
            <p>Market Cards : </p>
            <ol>
              {currentPlayer.markettingCards.map((card, index) => (
                <li className="flex gap-2" key={index}>
                  <p>{card.name}</p>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-1 text-gray-700 disabled:bg-gray-400"
                    onClick={() => handleAddMarketCardToTrade(card)}
                  >
                    +
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      <div>
        {players.map((player) => (
          <div
            className="border border-red-300 mb-2 flex gap-2"
            key={player.id}
          >
            <div>
              {player.id === currentPlayer.id && (
                <div>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700 disabled:bg-gray-400"
                    onClick={() => handleShowCards()}
                    disabled={
                      currentPlayer.turnStatus !== "planting" ||
                      currentPlayer.plantCounts < 1
                    }
                  >
                    start marketting
                  </button>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700 disabled:bg-gray-400"
                    onClick={() => handleAddCardsToHand(player)}
                    disabled={
                      //TODO : this is not totally correct, later should change it
                      (currentPlayer.markettingCards.length !== 0 &&
                        currentPlayer.turnStatus === "marketting") ||
                      currentPlayer.turnStatus === "planting"
                    }
                  >
                    Add Cards To Hand
                  </button>
                </div>
              )}
              <p>id :{player.id}</p>
              <p>name :{player.playerName}</p>
              <p>tractor : {player.tractor ? "yes" : "no"}</p>
              <p>money : {player.money}</p>
              <p>
                hat :
                {player.playerHat.ownedById === player.playerHat.ownerId
                  ? "here"
                  : players[player.playerHat.ownedById].playerName}
              </p>
              <ol className="border border-blue-500">
                {player.hand.map((card, handIndex) => (
                  <li key={handIndex}>
                    {card.name}
                    {player.id === currentPlayer.id &&
                      currentPlayer.turnStatus === "planting" &&
                      (currentPlayer.plantCounts < 2 ||
                        (currentPlayer.plantCounts < 3 && player.tractor)) && (
                        <div>
                          <button
                            className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                            onClick={() => handlePlantFromHand(0, card, player)}
                          >
                            F1
                          </button>
                          <button
                            className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                            onClick={() => handlePlantFromHand(1, card, player)}
                          >
                            F2
                          </button>
                          {player.fields.length > 2 && (
                            <button
                              className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                              onClick={() =>
                                handlePlantFromHand(2, card, player)
                              }
                            >
                              F3
                            </button>
                          )}
                        </div>
                      )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="border border-purple-700 flex flex-col gap-2">
              <p>actions :</p>

              {!player.hasBoughtCards && (
                <button
                  className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                  onClick={() => handleBuy(player, "cards", 1)}
                >
                  Buy Cards
                </button>
              )}
              {!player.tractor && (
                <button
                  className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                  onClick={() => handleBuy(player, "tractor", 2)}
                >
                  Buy Tractor
                </button>
              )}
            </div>
            <ul className="border border-yellow-700 flex gap-4 ">
              {player.fields.map((field, fieldIndex) => (
                <li className="border border-green-600 w-32" key={fieldIndex}>
                  <p>id: {field.id}</p>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                    onClick={() => handleHarvest(fieldIndex, player)}
                    disabled={field.crops.quantity === 0}
                  >
                    Harvest
                  </button>

                  <p>manure : {field.manure ? "yes" : "no"}</p>
                  {!field.manure && availableManures > 0 && (
                    <button
                      className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                      onClick={() => handleBuy(player, "manure", 2, field.id)}
                    >
                      Buy manure
                    </button>
                  )}
                  {field.crops.quantity > 0 && (
                    <div>
                      <p>crop: {field.crops.cardId}</p>
                      <p>
                        name:{" "}
                        {
                          cardData.find((c) => c.id === field.crops.cardId)
                            ?.name
                        }
                      </p>
                      <p>quantity: {field.crops.quantity}</p>
                    </div>
                  )}
                </li>
              ))}
              {player.fields.length < 3 && (
                <button
                  className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                  onClick={() => handleBuy(player, "field", 3)}
                >
                  + Buy Field for 3 coins
                </button>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
