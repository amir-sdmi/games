"use client";
import { useState } from "react";
import PlayersForm from "./_components/PlayersForm";
import { PlayerType } from "./_types/types";

type GameStatus = "initial" | "playing" | "finished";
export default function JalizPage() {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("initial");
  return (
    <div>
      <h1 className="text-6xl mb-20">Jaliz Page</h1>
      {gameStatus === "initial" ? (
        <PlayersForm
          players={players}
          setPlayers={setPlayers}
          setGameStatus={setGameStatus}
        />
      ) : null}
    </div>
  );
}
