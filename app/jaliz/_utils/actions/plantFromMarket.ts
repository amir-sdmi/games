import {
  CardsType,
  CurrentPlayer,
  FieldType,
  PlayerType,
} from "../../_types/types";

export const plantFromMarket = (
  currentPlayer: CurrentPlayer,
  fieldIndex: FieldType["id"],
  player: PlayerType,
  card: CardsType
) => {
  const newCurrentPlayer: CurrentPlayer = { ...currentPlayer };
  const newField: FieldType = {
    ...player.fields[fieldIndex],
  };

  //plant card
  if (newField.crops.quantity === 0 || newField.crops.id === card.id) {
    newField.crops.quantity++;
    newField.crops.id = card.id;
  } else {
    console.log(
      "you can not plant this card here, some other crops has been planted here before"
    );
    return { currentPlayer, player };
  }

  //remove card from market
  newCurrentPlayer.marketingCards.pop();

  return {
    currentPlayer: newCurrentPlayer,
    player: {
      ...player,
      fields: player.fields.map((f) => (f.id === fieldIndex ? newField : f)),
    },
  };
};
