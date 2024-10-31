import { GameAndSetGameProps } from "../_types/props";
import GameDetails from "./GameDetails";
import Marketing from "./Market/Marketing";
import Player from "./Player";

export default function Gameboard({ game, setGame }: GameAndSetGameProps) {
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
              currentPlayer.turnStatus === "marketing" && (
                <Marketing game={game} setGame={setGame} />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
