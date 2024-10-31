type PlayerType = {
  id: number;
  playerName: string;
  money: number;
  hand: CardsType[];
  fields: FieldType[];
  thirdField: boolean;
  playerHat: HatType;
  tractor: boolean;
  otherPlayersHats: PlayerType["id"][];
  hasBoughtCards: boolean;
};

type HatType = {
  ownerId: number;
  ownedById: number;
};
type FieldType = {
  id: number;
  crops: CardsType;
  manure: boolean;
};

type CardInformationType = {
  id: number;
  name: string;
  totalQuantity: number;
  value: [
    2 | 3 | 4,
    3 | 4 | 5 | 6 | null,
    4 | 5 | 6 | 7 | 8,
    7 | 8 | 9 | 10 | null,
  ];
};
type CardsType = {
  id: number | null;
  quantity: number;
};

type GameType = {
  players: PlayerType[];
  currentPlayer: CurrentPlayer;
  deck: CardInformationType[];
  discardPile: CardsType[];
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
  markettingCards: CardsType[];
  tradeOffer: TradeOffer;
};

type TradeOffer = {
  proposerId: PlayerType["id"];
  cardsFromProposersHand: CardsType[];
  cardsFromMarket: CardsType[];
  requestCards: CardsType[];
  otherPlayersHats: PlayerType["id"][];
  includePlayerHat: boolean;
};
type BuyType = "manure" | "tractor" | "cards" | "field";
export type {
  BuyType,
  PlayerType,
  CardsType,
  CardInformationType,
  HatType,
  FieldType,
  GameType,
  CurrentPlayer,
  TradeOffer,
};
