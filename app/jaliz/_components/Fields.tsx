import { BuyType, GameType, PlayerType } from "../../../server/types/types";
import { harvest } from "../../../server/utils/actions/harvest";
import { cardData } from "@/server/data/cardData";
import Button from "./ui/Button";
interface FieldsProps {
  player: PlayerType;
  game: GameType;
  setGame: (game: GameType) => void;
  handleBuy: (
    player: PlayerType,
    type: BuyType,
    price: number,
    fieldId?: number
  ) => void;
}
export default function Fields({
  player,
  game,
  setGame,
  handleBuy,
}: FieldsProps) {
  const handleHarvest = (fieldIndex: number, player: PlayerType) => {
    const {
      field: newField,
      money,
      discardPile: newDiscardPile,
    } = harvest(player.fields[fieldIndex], game.discardPile);
    setGame({
      ...game,
      players: game.players.map((p) =>
        p.id === player.id
          ? {
              ...p,
              fields: p.fields.map((f, i) => (i === fieldIndex ? newField : f)),
              money: p.money + money,
            }
          : p
      ),
      discardPile: newDiscardPile,
    });
  };
  return (
    <ul className="border border-yellow-700 flex gap-4 ">
      {player.fields.map((field, fieldIndex) => (
        <li className="border border-green-600 w-32" key={fieldIndex}>
          <p>id: {field.id}</p>
          <Button
            onClick={() => handleHarvest(fieldIndex, player)}
            disabled={field.crops.quantity === 0}
          >
            Harvest
          </Button>

          <p>manure : {field.manure ? "yes" : "no"}</p>
          {!field.manure && game.availableManures > 0 && (
            <Button onClick={() => handleBuy(player, "manure", 2, field.id)}>
              Buy manure
            </Button>
          )}
          {field.crops.quantity > 0 && (
            <div>
              <p>id: {field.crops.id}</p>
              <p>name: {cardData.find((c) => c.id === field.crops.id)?.name}</p>
              <p>quantity: {field.crops.quantity}</p>
            </div>
          )}
        </li>
      ))}
      {player.fields.length < 3 && (
        <Button onClick={() => handleBuy(player, "field", 3)}>
          + Buy Field for 3 coins
        </Button>
      )}
    </ul>
  );
}
