type PlayerType = {
  id: number;
  playerName: string;
  money: number;
  hand: CardType[];
  fields: FieldType[];
  thirdField: boolean;
  playerHat: HatType;
  tractor: boolean;
  otherPlayersHats: PlayerType["id"][];
  hasBoughtCards: boolean;
  tradeOffersToCurrentPlayer: TradeOffer[];
};

type HatType = {
  ownerId: number;
  ownedById: number;
};
type FieldType = {
  id: number;
  crops: CropType;
  manure: boolean;
};

type CropType = {
  cardId: number | null;
  quantity: number;
};

type CardType = {
  id: number;
  name: string;
  totalQuantity: number;
  value: [
    2 | 3 | 4,
    3 | 4 | 5 | 6 | null,
    4 | 5 | 6 | 7 | 8,
    7 | 8 | 9 | 10 | null,
  ];
  inHandOrMarketId?: number | null;
};

type GameType = {
  players: PlayerType[];
  currentPlayer: CurrentPlayer;
  deck: CardType[];
  discardPile: CardType[];
  round: 1 | 2 | 3 | 4;
  availableManures: number;
  availableTractors: number;
  endTurnReceivingCardsCount: 2 | 3;
  gameStatus: "initial" | "playing" | "finished";
};

type CurrentPlayer = {
  id: PlayerType["id"];
  turnStatus: "planting" | "marketting" | "addingCardsToHand";
  plantCounts: number;
  markettingCards: CardType[];
  tradeOffers: TradeOffer[];
};

type TradeOffer = {
  proposerId: PlayerType["id"];
  cardsFromProposersHand: CardType[];
  cardsFromMarket: CardType[];
  otherPlayersHats: PlayerType["id"][];
  includePlayerHat: boolean;
};

export type {
  PlayerType,
  CardType,
  HatType,
  FieldType,
  CropType,
  GameType,
  CurrentPlayer,
  TradeOffer,
};
