import { CardInformationType, PlayerType } from "../../types/types";
import { fromDeckToHand } from "../utils";

export const buy = (
  player: PlayerType,
  deck: CardInformationType[],
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
          crops: { id: null, quantity: 0 },
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
        let newHand = [...updatedPlayer.hand];
        for (let i = 0; i < 3; i++) {
          const newCard = updatedDeck.pop() as CardInformationType;
          newHand = fromDeckToHand(newCard, newHand);
        }
        updatedPlayer.hand = newHand;
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
