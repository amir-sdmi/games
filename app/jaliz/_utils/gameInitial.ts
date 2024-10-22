import { CardType, GameType, PlayerType } from "../_types/types";

const createNewPlayer = (id: number, playerName: string): PlayerType => {
  return {
    id,
    playerName,
    money: 0,
    hand: [],
    fields: [
      { id: 0, crops: [], manure: false },
      { id: 1, crops: [], manure: false },
    ],
    thirdField: false,
    playerHat: { ownerId: id, ownedById: id },
    tractor: false,
    otherPlayersHats: [],
  };
};

export const createNewGame = (
  playersNames: string[],
  cards: CardType[]
): GameType => {
  const players = playersNames.map((playerName, index) =>
    createNewPlayer(index, playerName)
  );
  const currentPlayer = players[Math.floor(Math.random() * players.length)].id;

  const filteredCards = cards.filter((card) => card.id >= 1 && card.id <= 9);
  const deck: CardType[] = [];

  filteredCards.forEach((card) => {
    for (let i = 0; i < card.totalQuantity; i++) {
      deck.push(card);
    }
  });
  return {
    players,
    currentPlayer,
    deck,
  };
};
