import { PlayerType } from "../_types/types";
import { createNewPlayer } from "../_utils/gameInitial";

export default function PlayersForm({
  players,
  setPlayers,
  setGameStatus,
}: {
  players: PlayerType[];
  setPlayers: (players: PlayerType[]) => void;
  setGameStatus: (gameStatus: "initial" | "playing" | "finished") => void;
}) {
  const handleAddPlayer = () => {
    const newPlayers = [...players];
    newPlayers.push(createNewPlayer(newPlayers.length));
    setPlayers(newPlayers);
  };

  return (
    <>
      <p>please enter the name of players. this game need 3-7 players. </p>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setGameStatus("playing");
        }}
      >
        {players.map((player, i) => {
          return (
            <div key={i} className="gap-4 flex">
              <label htmlFor={`player${i}`}>Player {i + 1}:</label>
              <input
                type="text"
                name={`player${i}`}
                id={`player${i}`}
                defaultValue={player.playerName}
                placeholder={`player ${i + 1}`}
                onFocus={(e) => {
                  e.target.select();
                }}
                onChange={(e) => {
                  const newPlayers = [...players];
                  newPlayers[i].playerName = e.target.value;
                  newPlayers[i].id = i;
                  setPlayers(newPlayers);
                }}
              />

              {players.length > 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    const newPlayers = [...players];
                    newPlayers.splice(i, 1);
                    setPlayers(newPlayers);
                  }}
                >
                  -
                </button>
              ) : null}
            </div>
          );
        })}

        {players.length < 7 ? (
          <button type="button" onClick={handleAddPlayer}>
            Add player
          </button>
        ) : null}

        <button
          type="submit"
          onClick={() => {
            console.log(players);
          }}
        >
          Start Game
        </button>
      </form>
    </>
  );
}
