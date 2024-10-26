import {
  CardType,
  CurrentPlayer,
  GameType,
  PlayerType,
} from "../../_types/types";

export const addCardsToHand = (game: GameType, player: PlayerType) => {
  const newDeck = [...game.deck];
  const newHand = [...player.hand];

  for (let i = 0; i < game.endTurnReceivingCardsCount; i++) {
    const card = newDeck.pop() as CardType;
    const newCard: CardType = { ...card, inHandOrMarketId: newHand.length };
    newHand.push(newCard);
  }

  const newCurrentPlayer: CurrentPlayer = {
    id:
      game.currentPlayer.id < game.players.length - 1
        ? game.currentPlayer.id + 1
        : 0,
    turnStatus: "planting",
    plantCounts: 0,
    markettingCards: [],
    tradeOffers: [],
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
