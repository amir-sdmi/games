import { CardType, FieldType } from "../_types/types";
import { cardData } from "./cardData";

export const plant = (
  hand: CardType[],
  field: FieldType,
  card: CardType
): { hand: CardType[]; field: FieldType } => {
  const newHand = [...hand];
  const newField = { ...field };

  //remove card from hand
  const indexOfCardInHand = newHand.indexOf(card);
  if (indexOfCardInHand !== -1) {
    newHand.splice(indexOfCardInHand, 1);
  } else {
    console.log("card not found in hand");
    return { hand, field };
  }

  //check if same card has been planted before, or field is empty, plant the card
  if (newField.crops.quantity === 0 || newField.crops.cardId === card.id) {
    newField.crops.quantity++;
    newField.crops.cardId = card.id;
  } else {
    console.log(
      "you can not plant this card here, some other crops has been planted here before"
    );
    return { hand, field };
  }

  return { hand: newHand, field: newField };
};

export const harvest = (
  field: FieldType
): { field: FieldType; money: number } => {
  const newField = { ...field };
  if (newField.crops.quantity === 0) {
    console.log("no crops to harvest");
    return { field, money: 0 };
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

    const money = closestIndex !== null ? closestIndex + 1 : 0;
    newField.crops.quantity = 0;
    newField.crops.cardId = null;
    return { field: newField, money };
  }
};
