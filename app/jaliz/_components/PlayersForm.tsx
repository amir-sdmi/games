"use client";

import { GameType } from "../_types/types";
import { createNewGame } from "../_utils/gameInitial";
import { cardData } from "../_utils/cardData";
interface PlayerFormProps {
  players: string[];
  setPlayers: (players: string[]) => void;
  setGame: (game: GameType) => void;
}
export default function PlayersForm({
  players,
  setPlayers,
  setGame,
}: PlayerFormProps) {
  return (
    <>
      <p>please enter the name of players. this game need 3-7 players. </p>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setPlayers(players);
          setGame({
            ...createNewGame(players, cardData),
            gameStatus: "playing",
          });
        }}
      >
        {players.map((player, i) => {
          return (
            <div key={i} className="gap-4 flex">
              <label>
                Player {i + 1}:{" "}
                <input
                  type="text"
                  defaultValue={player}
                  placeholder={`player ${i + 1}`}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onChange={(e) => {
                    const newPlayerInputs = [...players];
                    newPlayerInputs[i] = e.target.value;
                    setPlayers(newPlayerInputs);
                  }}
                />
              </label>

              {players.length > 3 && (
                <button
                  type="button"
                  onClick={() => {
                    const newPlayerInputs = [...players];
                    newPlayerInputs.splice(i, 1);
                    setPlayers(newPlayerInputs);
                  }}
                >
                  -
                </button>
              )}
            </div>
          );
        })}

        {players.length < 7 && (
          <button
            type="button"
            onClick={() => {
              setPlayers([...players, `player ${players.length + 1}`]);
            }}
          >
            Add player
          </button>
        )}

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
