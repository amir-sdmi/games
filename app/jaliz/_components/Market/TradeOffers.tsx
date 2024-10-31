import { isEqual } from "lodash";
import { GameType, TradeOffer } from "../../_types/types";
import { cardName } from "../../_utils/utils";
import Button from "../ui/Button";

export default function TradeOffers({
  game,
  setGame,
}: {
  game: GameType;
  setGame: (game: GameType) => void;
}) {
  const { currentPlayer, players } = game;
  const handleRemoveTradeOffer = (tradeOfferToDelete: TradeOffer) => {
    setGame({
      ...game,
      currentPlayer: {
        ...currentPlayer,
        tradeOffers: currentPlayer.tradeOffers.filter(
          (tradeOffer) => !isEqual(tradeOffer, tradeOfferToDelete)
        ),
      },
    });
  };
  return (
    <div className="border-2 border-pink-500">
      <p>trade offers:</p>
      {currentPlayer.tradeOffers.map((tradeOffer, index) => (
        <div className="border-2 border-green-400" key={index}>
          cards from proposers hand:
          <ol>
            {tradeOffer.cardsFromProposersHand.map((card, i) => (
              <li key={i}>{cardName(card.id)}</li>
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
              <li key={i}>{cardName(card.id)}</li>
            ))}
          </ol>
          current player hat: {tradeOffer.includePlayerHat ? "yes" : "no"}
          <Button onClick={() => handleRemoveTradeOffer(tradeOffer)}>
            Discard
          </Button>
        </div>
      ))}
    </div>
  );
}
