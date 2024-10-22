import { GameType } from "../_types/types";

export default function Gameboard({ game }: { game: GameType }) {
  return (
    <div>
      <h1>Gameboard</h1>
      <p>current player: {game.currentPlayer}</p>
      <p>players:</p>
      <ul>
        {game.players.map((player) => (
          <li key={player.id}>
            <p>playerName: {player.playerName}</p>
            <p>money: {player.money}</p>
            <p>hand: {player.hand.map((card) => card.name).join(", ")}</p>
            <p>fields:</p>
            <ul>
              {player.fields.map((field) => (
                <li key={field.id}>
                  <p>
                    crops: {field.crops.map((crop) => crop.cardId).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
