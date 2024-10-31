import {
  CardInformationType,
  CurrentPlayer,
  GameType,
  PlayerType,
} from "../../types/types";
import { emptyTempTradeOffer } from "../../services/gameInitial";
import { fromDeckToHand } from "../utils";

export const addCardsToHand = (game: GameType, player: PlayerType) => {
  const newDeck = [...game.deck];
  let newHand = [...player.hand];

  for (let i = 0; i < game.endTurnReceivingCardsCount; i++) {
    const card = newDeck.pop() as CardInformationType;
    newHand = fromDeckToHand(card, newHand);
  }

  const nextPlayerId =
    game.currentPlayer.id < game.players.length - 1
      ? game.currentPlayer.id + 1
      : 0;
  const newCurrentPlayer: CurrentPlayer = {
    id: nextPlayerId,
    turnStatus: "planting",
    plantCounts: 0,
    marketingCards: [],
    tradeOffer: emptyTempTradeOffer(nextPlayerId),
  };
  return {
    ...game,
    currentPlayer: newCurrentPlayer,
    deck: newDeck,
    players: game.players.map((p: PlayerType) =>
      p.id === player.id ? { ...p, hand: newHand } : p
    ),
  };
};
