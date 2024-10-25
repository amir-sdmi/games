import { CardType, FieldType } from "../../_types/types";
import { cardData } from "../cardData";

export const harvest = (
  field: FieldType,
  discardPile: CardType[]
): { field: FieldType; money: number; discardPile: CardType[] } => {
  const newField = { ...field };
  const newDiscardPile = [...discardPile];
  if (newField.crops.quantity === 0) {
    console.log("no crops to harvest");
    return { field, money: 0, discardPile };
  } else {
    //find the price of the card
    const cardDetails = cardData.find(
      (card) => card.id === newField.crops.cardId
    );
    let closestIndex = null;
    let closestValue = 0;
    cardDetails?.value.forEach((value, index) => {
      if (
        value !== null &&
        value <= newField.crops.quantity &&
        value > closestValue
      ) {
        closestValue = value;
        closestIndex = index;
      }
    });

    //add cards to discard pile
    for (let i = 0; i < newField.crops.quantity; i++) {
      newDiscardPile.push(cardDetails as CardType);
    }
    const money = closestIndex !== null ? closestIndex + 1 : 0;
    newField.crops.quantity = 0;
    newField.crops.cardId = null;
    return { field: newField, money, discardPile: newDiscardPile };
  }
};
