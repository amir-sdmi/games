type PlayerType = {
  id: number;
  playerName: string;
  money: number;
  hand: CardType[];
  fields: FieldType[];
  thirdField: boolean;
  playerHat: HatType;
  tractor: boolean;
  otherPlayersHats: HatType[];
};

type HatType = {
  ownerId: number;
  ownedById: number;
};
type FieldType = {
  id: number;
  crops: CropType[];
  manure: boolean;
};

type CropType = {
  cardId: number;
  quantity: number;
};

type CardType = {
  id: number;
  name: string;
  totalQuantity: number;
  oneCoinPrice: 2 | 3 | 4;
  twoCoinPrice: 3 | 4 | 5 | 6 | null;
  threeCoinPrice: 4 | 5 | 6 | 7 | 8;
  fourCoinPrice: 7 | 8 | 9 | 10 | null;
};

export type { PlayerType, CardType, HatType, FieldType, CropType };
