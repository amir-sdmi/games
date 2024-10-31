import { GameType } from "../_types/types";
import GameDetails from "./GameDetails";
import Marketting from "./Market/Marketting";
import Player from "./Player";

export default function Gameboard({
  game,
  setGame,
}: {
  game: GameType;
  setGame: (game: GameType) => void;
}) {
  const { players, currentPlayer } = game;

  return (
    <div>
      <GameDetails game={game} />
      <div>
        {players.map((player) => (
          <div
            className="border border-red-300 mb-2 flex gap-2"
            key={player.id}
          >
            <Player player={player} game={game} setGame={setGame} />

            {currentPlayer.id === player.id &&
              currentPlayer.turnStatus === "marketting" && (
                <Marketting game={game} setGame={setGame} />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
