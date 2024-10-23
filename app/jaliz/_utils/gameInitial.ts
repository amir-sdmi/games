import { shuffleArray } from "@/utils/utils";
import { CardType, GameType, PlayerType } from "../_types/types";

const createNewPlayer = (id: number, playerName: string): PlayerType => {
  return {
    id,
    playerName,
    money: 0,
    hand: [],
    fields: [
      { id: 0, crops: { cardId: null, quantity: 0 }, manure: false },
      { id: 1, crops: { cardId: null, quantity: 0 }, manure: false },
    ],
    thirdField: false,
    playerHat: { ownerId: id, ownedById: id },
    tractor: false,
    otherPlayersHats: [],
  };
};

//TODO: chnage game for not having undefined here ! i did it by adding default to them
const activeCardsPerPlayer = (
  playerCount: number
): { from: number; to: number } => {
  switch (playerCount) {
    case 3:
      return { from: 1, to: 9 };
    case 4:
      return { from: 0, to: 9 };
    case 5:
      return { from: 0, to: 10 };
    case 6:
      return { from: 0, to: 11 };
    case 7:
      return { from: 0, to: 12 };
    default:
      return { from: 0, to: 12 };
  }
};
//TODO: chnage game for not having undefined here ! i did it by adding default to them
const endTurnReceivingCards = (playerCount: number) => {
  switch (playerCount) {
    case 3:
      return 2;
    case 4:
      return 2;
    case 5:
      return 3;
    case 6:
      return 3;
    case 7:
      return 3;
    default:
      return 3;
  }
};

export const createNewGame = (
  playersNames: string[],
  cards: CardType[]
): GameType => {
  const players = playersNames.map((playerName, index) =>
    createNewPlayer(index, playerName)
  );
  //choosing initial player randomly
  const currentPlayer = players[Math.floor(Math.random() * players.length)].id;
  //create deck of cards, randomly but with some rules, about number of players
  const filteredCards = cards.filter(
    (card) =>
      card.id >= activeCardsPerPlayer(players.length).from &&
      card.id <= activeCardsPerPlayer(players.length).to
  );
  const tempDeck: CardType[] = [];
  filteredCards.forEach((card) => {
    for (let i = 0; i < card.totalQuantity; i++) {
      tempDeck.push(card);
    }
  });
  const deck = shuffleArray(tempDeck);

  //giving five card to each player
  players.forEach((player) => {
    for (let i = 0; i < 5; i++) {
      player.hand.push(deck.pop() as CardType);
    }
  });

  const discardPile: CardType[] = [];
  //manures, one more than players
  const availableManures = players.length + 1;

  //availableTractors
  const availableTractors = players.length;

  const endTurnReceivingCardsCount = endTurnReceivingCards(players.length);
  return {
    players,
    currentPlayer,
    deck,
    discardPile,
    availableManures,
    availableTractors,
    endTurnReceivingCardsCount,
  };
};
