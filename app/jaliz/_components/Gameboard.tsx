import { CardType, CurrentPlayer, GameType, PlayerType } from "../_types/types";
import { addCardsToHand } from "../_utils/actions/addCardsToHand";
import { buy } from "../_utils/actions/buy";
import { harvest } from "../_utils/actions/harvest";
import { plant } from "../_utils/actions/plant";
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

  const handlePlant = (
    fieldIndex: number,
    card: CardType,
    player: PlayerType
  ) => {
    const {
      hand: newHand,
      field: newField,
      currentPlayer: newCurrentPlayer,
    } = plant(player.hand, player.fields[fieldIndex], card, currentPlayer);

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
        <div className="h-64 w-64">
          <div className="border border-blue-500">
            {currentPlayer.markettingCards.map((card, index) => (
              <div key={index}>
                <p>card name: {card.name}</p>
                <div>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                    onClick={() =>
                      handlePlant(0, card, players[currentPlayer.id])
                    }
                  >
                    F1
                  </button>
                  <button
                    className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                    onClick={() =>
                      handlePlant(1, card, players[currentPlayer.id])
                    }
                  >
                    F2
                  </button>
                  {players[currentPlayer.id].fields.length > 2 && (
                    <button
                      className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                      onClick={() =>
                        handlePlant(2, card, players[currentPlayer.id])
                      }
                    >
                      F3
                    </button>
                  )}
                </div>
              </div>
            ))}
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
                    disabled={currentPlayer.turnStatus !== "addingCardsToHand"}
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
                hat :{" "}
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
                            onClick={() => handlePlant(0, card, player)}
                          >
                            F1
                          </button>
                          <button
                            className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                            onClick={() => handlePlant(1, card, player)}
                          >
                            F2
                          </button>
                          {player.fields.length > 2 && (
                            <button
                              className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                              onClick={() => handlePlant(2, card, player)}
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
