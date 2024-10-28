import { BuyType, PlayerType } from "../_types/types";
import Button from "./ui/Button";

export default function PlayerBuyingActions({
  player,
  handleBuy,
}: {
  player: PlayerType;
  handleBuy: (
    player: PlayerType,
    type: BuyType,
    price: number,
    fieldId?: number
  ) => void;
}) {
  return (
    <div className="border border-purple-700 flex flex-col gap-2">
      <p>Buy :</p>

      {!player.hasBoughtCards && (
        <Button onClick={() => handleBuy(player, "cards", 1)}>Buy Cards</Button>
      )}
      {!player.tractor && (
        <Button onClick={() => handleBuy(player, "tractor", 2)}>
          Buy Tractor
        </Button>
      )}
    </div>
  );
}
