"use client";
import { useState } from "react";
import PlayersForm from "./_components/PlayersForm";
import { GameType } from "./_types/types";
import Gameboard from "./_components/Gameboard";

type GameStatus = "initial" | "playing" | "finished";
export default function JalizPage() {
  const [players, setPlayers] = useState<string[]>([
    "player 1",
    "player 2",
    "player 3",
  ]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("initial");
  const [game, setGame] = useState<GameType>();
  return (
    <div>
      <h1 className="text-6xl mb-20">Jaliz Page</h1>
      {gameStatus === "initial" && (
        <PlayersForm
          players={players}
          setPlayers={setPlayers}
          setGameStatus={setGameStatus}
          setGame={setGame}
        />
      )}
      {gameStatus === "playing" && game && <Gameboard game={game} />}
    </div>
  );
}
