import { BuyType, GameType, PlayerType } from "../_types/types";
import { buy } from "../_utils/actions/buy";
import Fields from "./Fields";
import PlayerBuyingActions from "./PlayerBuyingActions";
import PlayerDetails from "./PlayerDetails";
interface PlayerProps {
  player: PlayerType;
  game: GameType;
  setGame: (game: GameType) => void;
}
export default function Player({ player, game, setGame }: PlayerProps) {
  const { deck, availableManures, availableTractors } = game;

  const handleBuy = (
    player: PlayerType,
    type: BuyType,
    price: number,
    fieldId?: number
  ) => {
    const { updatedPlayer, updatedDeck, updatedManures, updatedTractors } = buy(
      player,
      deck,
      availableManures,
      availableTractors,
      type,
      price,
      fieldId
    );

    setGame({
      ...game,
      players: game.players.map((p) =>
        p.id === player.id ? updatedPlayer : p
      ),
      deck: updatedDeck,
      availableManures: updatedManures,
      availableTractors: updatedTractors,
    });
  };
  return (
    <>
      <PlayerDetails player={player} game={game} setGame={setGame} />

      <PlayerBuyingActions player={player} handleBuy={handleBuy} />

      <Fields
        player={player}
        handleBuy={handleBuy}
        game={game}
        setGame={setGame}
      />
    </>
  );
}
