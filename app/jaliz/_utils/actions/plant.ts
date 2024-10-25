import { CardType, CurrentPlayer, FieldType } from "../../_types/types";

export const plant = (
  hand: CardType[],
  field: FieldType,
  card: CardType,
  currentPlayer: CurrentPlayer
): { hand: CardType[]; field: FieldType; currentPlayer: CurrentPlayer } => {
  const newHand = [...hand];
  const newField = { ...field };
  const newCurrentPlayer = { ...currentPlayer };

  //remove card from hand
  const indexOfCardInHand = newHand.indexOf(card);
  if (indexOfCardInHand !== -1) {
    newHand.splice(indexOfCardInHand, 1);
  } else {
    console.log("card not found in hand");
    return { hand, field, currentPlayer };
  }

  //check if same card has been planted before, or field is empty, plant the card
  if (newField.crops.quantity === 0 || newField.crops.cardId === card.id) {
    newField.crops.quantity++;
    newField.crops.cardId = card.id;
    newCurrentPlayer.plantCounts++;
  } else {
    console.log(
      "you can not plant this card here, some other crops has been planted here before"
    );
    return { hand, field, currentPlayer };
  }

  return { hand: newHand, field: newField, currentPlayer: newCurrentPlayer };
};
