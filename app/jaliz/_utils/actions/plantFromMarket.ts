import {
  CardType,
  CurrentPlayer,
  FieldType,
  PlayerType,
} from "../../_types/types";

export const plantFromMarket = (
  currentPlayer: CurrentPlayer,
  fieldIndex: FieldType["id"],
  player: PlayerType,
  card: CardType
) => {
  const newCurrentPlayer: CurrentPlayer = { ...currentPlayer };
  const newField: FieldType = {
    ...player.fields[fieldIndex],
  };

  //plant card
  if (newField.crops.quantity === 0 || newField.crops.cardId === card.id) {
    newField.crops.quantity++;
    newField.crops.cardId = card.id;
  } else {
    console.log(
      "you can not plant this card here, some other crops has been planted here before"
    );
    return { currentPlayer, player };
  }
  //remove card
  const indexOfCardInMarket = newCurrentPlayer.markettingCards.indexOf(card);
  if (indexOfCardInMarket !== -1) {
    newCurrentPlayer.markettingCards.splice(indexOfCardInMarket, 1);
  } else {
    console.log("card not found in market");
    return { currentPlayer, player };
  }

  return {
    currentPlayer: newCurrentPlayer,
    player: {
      ...player,
      fields: player.fields.map((f) => (f.id === fieldIndex ? newField : f)),
    },
  };
};
