import { GameType } from "../../_types/types";
import { cardName } from "../../_utils/utils";
import Button from "../ui/Button";
import { emptyTempTradeOffer } from "../../_utils/gameInitial";

export default function TradeOffers({
  game,
  setGame,
}: {
  game: GameType;
  setGame: (game: GameType) => void;
}) {
  const { currentPlayer, players } = game;
  const { tradeOffer } = currentPlayer;
  const handleRemoveTradeOffer = () => {
    setGame({
      ...game,
      currentPlayer: {
        ...currentPlayer,
        tradeOffer: emptyTempTradeOffer(currentPlayer.id),
      },
    });
  };
  return (
    <div className="border-2 border-pink-300">
      <p>trade offer:</p>

      <div className="border-2 border-green-400">
        cards from proposers hand:
        <ol>
          {tradeOffer.cardsFromProposersHand.map((card, i) => (
            <li key={i}>
              {cardName(card.id)} {card.quantity}
            </li>
          ))}
        </ol>
        cards from market:
        <ol>
          {tradeOffer.cardsFromMarket.map((card, i) => (
            <li key={i}>{cardName(card.id)}</li>
          ))}
        </ol>
        other players hats:
        <ol>
          {tradeOffer.otherPlayersHats.map((hat, i) => (
            <li key={i}>{players[hat].playerName}</li>
          ))}
        </ol>
        requested cards:
        <ol>
          {tradeOffer.requestCards.map((card, i) => (
            <li key={i}>
              {cardName(card.id)} {card.quantity}
            </li>
          ))}
        </ol>
        current player hat: {tradeOffer.includePlayerHat ? "yes" : "no"}
        <Button onClick={handleRemoveTradeOffer}>Discard</Button>
      </div>
    </div>
  );
}
