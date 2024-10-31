import { shuffleArray } from "@/utils/utils";
import { CardInformationType, GameType } from "../_types/types";
export const nextRound = (game: GameType): GameType => {
  console.log("deck is under 2 or 3 cards");
  if (game.round < 4) {
    const newDeck: CardInformationType[] = shuffleArray([
      ...game.deck,
      ...game.discardPile,
    ]);
    const newRound = game.round === 1 ? 2 : game.round === 2 ? 3 : 4;
    return { ...game, deck: newDeck, discardPile: [], round: newRound };
  } else {
    return { ...game, round: 4, gameStatus: "finished" };
  }
};
