import { useState } from "react";
import {
  CardType,
  CurrentPlayer,
  GameType,
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
import Button from "./ui/Button";
import { emptyTempTradeOffer } from "../_utils/gameInitial";
import isEqual from "lodash/isEqual";

//TODO:Important! inHandleOrMarketId is not perfect ! the problem is .lenght for id is not suitable. it should should be max id + 1. next thing is they should be completely unique, maybe it has some issues when they are duplicated. goje1 from two users might happen

//TODO: BUGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG sequence of adding to tradeTemp, is importat now, but it shouldnt ! the problem is if user add goje1, goje2, bademjoon1, it should not be different with another order of it ! but now is, ! this is disaster ! make something dude !!!!!!!
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
  const [tradeTemp, setTradeTemp] = useState(
    emptyTempTradeOffer(currentPlayer.id)
  );
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

  const handleShowMarketCards = () => {
    const newDeck = [...deck];
    const newMarkettingCards = currentPlayer.markettingCards;
    for (let i = 0; i < 2; i++) {
      const card = newDeck.pop() as CardType;
      const newCard = {
        ...card,
        inHandOrMarketId: newMarkettingCards.length,
      };
      newMarkettingCards.push(newCard);
    }
    const newCurrentPlayer: CurrentPlayer = {
      ...currentPlayer,
      markettingCards: newMarkettingCards,
      turnStatus: "marketting",
    };

    setGame({
      ...game,
      currentPlayer: newCurrentPlayer,
      deck: newDeck,
    });
  };

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
    <div>
      {
        //Game details}
      }
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
      </div>{" "}
      <div>
        {players.map((player) => (
          <div
            className="border border-red-300 mb-2 flex gap-2"
            key={player.id}
          >
            {
              //player Hand
            }
            <div>
              {player.id === currentPlayer.id && (
                <div>
                  <Button
                    onClick={() => handleShowMarketCards()}
                    disabled={
                      currentPlayer.turnStatus !== "planting" ||
                      currentPlayer.plantCounts < 1
                    }
                  >
                    start marketting
                  </Button>
                  <Button
                    onClick={() => handleAddCardsToHand(player)}
                    disabled={
                      //TODO : this is not totally correct, later should change it
                      (currentPlayer.markettingCards.length !== 0 &&
                        currentPlayer.turnStatus === "marketting") ||
                      currentPlayer.turnStatus === "planting"
                    }
                  >
                    Add Cards To Hand
                  </Button>
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
                    {card.name} {card.inHandOrMarketId}
                    {player.id === currentPlayer.id &&
                      currentPlayer.turnStatus === "planting" &&
                      (currentPlayer.plantCounts < 2 ||
                        (currentPlayer.plantCounts < 3 && player.tractor)) && (
                        <div>
                          <Button
                            onClick={() => handlePlantFromHand(0, card, player)}
                          >
                            F1
                          </Button>
                          <Button
                            onClick={() => handlePlantFromHand(1, card, player)}
                          >
                            F2
                          </Button>
                          {player.fields.length > 2 && (
                            <Button
                              onClick={() =>
                                handlePlantFromHand(2, card, player)
                              }
                            >
                              F3
                            </Button>
                          )}
                        </div>
                      )}
                  </li>
                ))}
              </ol>
            </div>
            {
              //player buyingActions
            }
            <div className="border border-purple-700 flex flex-col gap-2">
              <p>Buy :</p>

              {!player.hasBoughtCards && (
                <Button onClick={() => handleBuy(player, "cards", 1)}>
                  Buy Cards
                </Button>
              )}
              {!player.tractor && (
                <Button onClick={() => handleBuy(player, "tractor", 2)}>
                  Buy Tractor
                </Button>
              )}
            </div>
            {
              //fields
            }
            <ul className="border border-yellow-700 flex gap-4 ">
              {player.fields.map((field, fieldIndex) => (
                <li className="border border-green-600 w-32" key={fieldIndex}>
                  <p>id: {field.id}</p>
                  <Button
                    onClick={() => handleHarvest(fieldIndex, player)}
                    disabled={field.crops.quantity === 0}
                  >
                    Harvest
                  </Button>

                  <p>manure : {field.manure ? "yes" : "no"}</p>
                  {!field.manure && availableManures > 0 && (
                    <Button
                      onClick={() => handleBuy(player, "manure", 2, field.id)}
                    >
                      Buy manure
                    </Button>
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
                <Button onClick={() => handleBuy(player, "field", 3)}>
                  + Buy Field for 3 coins
                </Button>
              )}
            </ul>
            {
              //Trade
            }
            {currentPlayer.id === player.id &&
              currentPlayer.turnStatus === "marketting" && (
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
                          <Button
                            onClick={() => handlePlantFromMarket(0, card)}
                          >
                            F1
                          </Button>
                          <Button
                            onClick={() => handlePlantFromMarket(1, card)}
                          >
                            F2
                          </Button>
                          {players[currentPlayer.id].fields.length > 2 && (
                            <Button
                              onClick={() => handlePlantFromMarket(2, card)}
                            >
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
                          <p
                            className={
                              isCardInTrade(card) ? "text-red-500" : ""
                            }
                          >
                            {card.name} {card.inHandOrMarketId}
                          </p>
                          <Button
                            onClick={() => handleAddHandCardsToTrade(card)}
                          >
                            +
                          </Button>
                        </li>
                      ))}
                    </ol>
                    <p>hats :</p>
                    {players[currentPlayer.id].playerHat.ownedById ===
                      currentPlayer.id && (
                      <div className="flex gap-2">
                        <p>my hat</p>
                        <Button onClick={() => handleAddPlayerHatToTrade()}>
                          +
                        </Button>
                      </div>
                    )}
                    {players[currentPlayer.id].otherPlayersHats.map(
                      (hatOwnerId, index) => (
                        <div key={index} className="flex gap-2">
                          <p>{players[hatOwnerId].playerName} hat</p>
                          <Button
                            onClick={() => handleOthersHatsToTrade(hatOwnerId)}
                          >
                            +
                          </Button>
                        </div>
                      )
                    )}
                    <p>Market Cards : </p>
                    <ol>
                      {currentPlayer.markettingCards.map((card, index) => (
                        <li className="flex gap-2" key={index}>
                          <p>
                            {card.name}
                            {card.inHandOrMarketId}
                          </p>
                          <Button
                            onClick={() => handleAddMarketCardToTrade(card)}
                          >
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
                        current player hat:{" "}
                        {tradeOffer.includePlayerHat ? "yes" : "no"}
                        <Button
                          onClick={() => handleRemoveTradeOffer(tradeOffer)}
                        >
                          Discard
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
