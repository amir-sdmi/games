import { GameType } from "./types";

export interface GameAndSetGameProps {
  game: GameType;
  setGame: (game: GameType) => void;
}
