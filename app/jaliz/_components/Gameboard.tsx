import { CardType, GameType, PlayerType } from "../_types/types";
import { addCardsToHand, harvest, plant } from "../_utils/actions";
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
    const { hand: newHand, field: newField } = plant(
      player.hand,
      player.fields[fieldIndex],
      card
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
    const updatedPlayer = { ...player };
    const updatedDeck = [...deck];
    let updatedManures = availableManures;
    let updatedTractors = availableTractors;
    switch (type) {
      case "field":
        if (updatedPlayer.money >= price && updatedPlayer.fields.length < 3) {
          updatedPlayer.money -= price;
          updatedPlayer.fields.push({
            id: updatedPlayer.fields.length,
            crops: { cardId: null, quantity: 0 },
            manure: false,
          });
        }
        break;

      case "manure":
        if (typeof fieldId === "number" && updatedPlayer.fields[fieldId]) {
          if (updatedPlayer.money >= price) {
            updatedPlayer.money -= price;
            updatedPlayer.fields[fieldId].manure = true;
            updatedManures -= 1;
          }
        } else {
          console.error("Invalid fieldId or field does not exist");
        }
        break;

      case "tractor":
        if (updatedPlayer.money >= price && !updatedPlayer.tractor) {
          updatedPlayer.money -= price;
          updatedPlayer.tractor = true;
          updatedTractors -= 1;
        }

        break;

      case "cards":
        if (updatedPlayer.money >= price && !updatedPlayer.hasBoughtCards) {
          updatedPlayer.money -= price;
          updatedPlayer.hasBoughtCards = true;
          for (let i = 0; i < 3; i++) {
            updatedPlayer.hand.push(updatedDeck.pop() as CardType);
          }
        }
        break;

      default:
        console.error("Unknown purchase type");
    }

    setGame({
      ...game,
      players: players.map((p) => (p.id === player.id ? updatedPlayer : p)),
      deck: updatedDeck,
      availableManures: updatedManures,
      availableTractors: updatedTractors,
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

      <div>
        {players.map((player) => (
          <div
            className="border border-red-300 mb-2 flex gap-2"
            key={player.id}
          >
            <div>
              {player.id === currentPlayer.id && (
                <button
                  className="border border-green-500 bg-gray-200 rounded px-2 text-gray-700"
                  onClick={() => handleAddCardsToHand(player)}
                >
                  Add Cards To Hand
                </button>
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
                      currentPlayer.turnStatus === "planting" && (
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
