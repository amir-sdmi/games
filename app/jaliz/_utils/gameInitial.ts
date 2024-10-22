import { PlayerType } from "../_types/types";

export const createNewPlayer = (id: number): PlayerType => {
  return {
    id,
    playerName: `player ${id + 1}`,
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
