import { GameType } from "../_types/types";
import GameDetails from "./GameDetails";
import Marketting from "./Marketting";
import Player from "./Player";

//TODO:Important! inHandleOrMarketId is not perfect ! the problem is .lenght for id is not suitable. it should should be max id + 1. next thing is they should be completely unique, maybe it has some issues when they are duplicated. goje1 from two users might happen

//TODO: BUGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG sequence of adding to tradeTemp, is importat now, but it shouldnt ! the problem is if user add goje1, goje2, bademjoon1, it should not be different with another order of it ! but now is, ! this is disaster ! make something dude !!!!!!!
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
