import { GameType } from "../../server/types/types";

export interface GameAndSetGameProps {
  game: GameType;
  setGame: (game: GameType) => void;
}
