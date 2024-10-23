import { CardType, GameType, PlayerType } from "../_types/types";
import { plant } from "../_utils/actions";

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
    endTurnReceivingCardsCount,
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
  return (
    <div>
      <div>
        <h1>Gameboard</h1>
        <p>players number: {players.length}</p>
        <p>current player: {currentPlayer}</p>
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
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <ul className="border border-yellow-700 flex gap-4 ">
              {player.fields.map((field, fieldIndex) => (
                <li className="border border-green-600 w-32" key={fieldIndex}>
                  <p>id: {field.id}</p>
                  <p>manure : {field.manure ? "yes" : "no"}</p>
                  {field.crops.quantity > 0 && (
                    <div>
                      <p>crop: {field.crops.cardId}</p>
                      <p>
                        name:{" "}
                        {deck.find((c) => c.id === field.crops.cardId)?.name}
                      </p>
                      <p>quantity: {field.crops.quantity}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
