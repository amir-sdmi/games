"use client";
import { useEffect, useState } from "react";
import PlayersForm from "./_components/PlayersForm";
import { GameType } from "../../server/types/types";
import Gameboard from "./_components/Gameboard";
import { cardData } from "@/server/data/cardData";
import { createNewGame } from "../../server/services/gameInitial";

export default function JalizPage() {
  const [players, setPlayers] = useState<string[]>([
    "player 1",
    "player 2",
    "player 3",
  ]);
  const [game, setGame] = useState<GameType>(createNewGame(players, cardData));

  return (
    <div>
      <h1 className="text-6xl mb-20">Jaliz Page</h1>
      {game.gameStatus === "initial" && (
        <PlayersForm
          players={players}
          setPlayers={setPlayers}
          setGame={setGame}
        />
      )}
      {game.gameStatus === "playing" && (
        <Gameboard game={game} setGame={setGame} />
      )}
    </div>
  );
}
