import { CardType, PlayerType } from "../../_types/types";

export const buy = (
  player: PlayerType,
  deck: CardType[],
  availableManures: number,
  availableTractors: number,
  type: "field" | "manure" | "tractor" | "cards",
  price: number,
  fieldId?: number
) => {
  const updatedPlayer = { ...player };
  const updatedDeck = [...deck];
  let updatedManures = availableManures;
  let updatedTractors = availableTractors;
  switch (type) {
    case "field":
      if (updatedPlayer.money >= price && updatedPlayer.fields.length < 3) {
        updatedPlayer.money -= price;
        updatedPlayer.fields.push({
          id: updatedPlayer.fields.length,
          crops: { cardId: null, quantity: 0 },
          manure: false,
        });
      }
      break;

    case "manure":
      if (typeof fieldId === "number" && updatedPlayer.fields[fieldId]) {
        if (updatedPlayer.money >= price) {
          updatedPlayer.money -= price;
          updatedPlayer.fields[fieldId].manure = true;
          updatedManures -= 1;
        }
      } else {
        console.error("Invalid fieldId or field does not exist");
      }
      break;

    case "tractor":
      if (updatedPlayer.money >= price && !updatedPlayer.tractor) {
        updatedPlayer.money -= price;
        updatedPlayer.tractor = true;
        updatedTractors -= 1;
      }

      break;

    case "cards":
      if (updatedPlayer.money >= price && !updatedPlayer.hasBoughtCards) {
        updatedPlayer.money -= price;
        updatedPlayer.hasBoughtCards = true;
        for (let i = 0; i < 3; i++) {
          updatedPlayer.hand.push(updatedDeck.pop() as CardType);
        }
      }
      break;

    default:
      console.error("Unknown purchase type");
  }

  return {
    updatedPlayer,
    updatedDeck,
    updatedManures,
    updatedTractors,
  };
};
