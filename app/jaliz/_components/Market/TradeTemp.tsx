import { isEqual } from "lodash";
import {
  CardsType,
  CurrentPlayer,
  GameType,
  TradeOffer,
} from "../../_types/types";
import { cardName, updateCardQuantityMinusOne } from "../../_utils/utils";
import Button from "../ui/Button";
import { emptyTempTradeOffer } from "../../_utils/gameInitial";

export default function TradeTempShow({
  tradeTemp,
  setTradeTemp,
  game,
  setGame,
  selectedMarketCards,
  setSelectedMarketCards,
}: {
  tradeTemp: TradeOffer;
  setTradeTemp: (tradeTemp: TradeOffer) => void;
  game: GameType;
  setGame: (game: GameType) => void;
  selectedMarketCards: boolean[];
  setSelectedMarketCards: (selectedMarketCards: boolean[]) => void;
}) {
  const handleRemoveMarketCardFromTempTrade = (cardId: CardsType["id"]) => {
    const newTradeTemp = {
      ...tradeTemp,
      cardsFromMarket: updateCardQuantityMinusOne(
        tradeTemp.cardsFromMarket,
        cardId
      ),
    };

    setTradeTemp(newTradeTemp);

    const newCurrentPlayer: CurrentPlayer = { ...game.currentPlayer };

    const firstDisabledItem = newCurrentPlayer.marketingCards.find(
      (c) =>
        c.id === cardId &&
        selectedMarketCards[newCurrentPlayer.marketingCards.indexOf(c)] === true
    );

    if (firstDisabledItem) {
      const newSelectedMarketCards = [...selectedMarketCards];
      newSelectedMarketCards[
        newCurrentPlayer.marketingCards.indexOf(firstDisabledItem)
      ] = false;
      setSelectedMarketCards(newSelectedMarketCards);
    }
  };
  const handleRemoveHandCardsFromTradeTemp = (cardId: CardsType["id"]) => {
    const newTradeTemp = {
      ...tradeTemp,
      cardsFromProposersHand: updateCardQuantityMinusOne(
        tradeTemp.cardsFromProposersHand,
        cardId
      ),
    };

    setTradeTemp(newTradeTemp);
  };
  const handleRemoveFromRequestCards = (cardId: CardsType["id"]) => {
    const newTradeTemp = {
      ...tradeTemp,
      requestCards: updateCardQuantityMinusOne(tradeTemp.requestCards, cardId),
    };
    setTradeTemp(newTradeTemp);
  };

  const handleAddNewTradeOffer = () => {
    //TODO add better ux to inform user thay have to add at least one market card
    if (tradeTemp.cardsFromMarket.length === 0) return;
    const currentPlayer = game.currentPlayer;

    //if tradeTemp is empty, do nothing
    if (isEqual(tradeTemp, emptyTempTradeOffer(currentPlayer.id))) return;
    //if tradeTemp is already in tradeOffers, do nothing
    if (isEqual(currentPlayer.tradeOffer, tradeTemp)) return;
    setGame({
      ...game,
      currentPlayer: {
        ...currentPlayer,
        tradeOffer: tradeTemp,
      },
    });
    setTradeTemp(emptyTempTradeOffer(currentPlayer.id));
    setSelectedMarketCards([false, false]);
  };
  return (
    <div className="border border-yellow-500">
      <p className="border border-yellow-400 text-red-600">TradeTemp :</p>
      <p className="border border-red-600">from Market:</p>
      <ul>
        {tradeTemp.cardsFromMarket.map((card, index) => (
          <div key={index}>
            <p>
              {cardName(card.id)} {card.quantity}
            </p>
            <Button
              onClick={() => handleRemoveMarketCardFromTempTrade(card.id)}
            >
              remove
            </Button>
          </div>
        ))}
      </ul>
      {tradeTemp.includePlayerHat && (
        <div>
          <p className="border border-red-600">HAT</p>
          <Button
            onClick={() =>
              setTradeTemp({ ...tradeTemp, includePlayerHat: false })
            }
          >
            remove
          </Button>
        </div>
      )}
      {tradeTemp.cardsFromProposersHand.length > 0 && (
        <div>
          <p className="border border-red-600">Hand :</p>
          {tradeTemp.cardsFromProposersHand.map((card, index) => (
            <div key={index}>
              <p>
                {cardName(card.id)} {card.quantity}{" "}
                <Button
                  onClick={() => handleRemoveHandCardsFromTradeTemp(card.id)}
                >
                  remove
                </Button>
              </p>
            </div>
          ))}
        </div>
      )}
      {tradeTemp.requestCards.length > 0 && (
        <div>
          <p className="border border-red-600">Request :</p>
          {tradeTemp.requestCards.map((card, index) => (
            <div key={index}>
              <p>
                {cardName(card.id)} {card.quantity}
              </p>
              <Button onClick={() => handleRemoveFromRequestCards(card.id)}>
                remove
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button
        disabled={tradeTemp.cardsFromMarket.length === 0 ? true : false}
        onClick={() => handleAddNewTradeOffer()}
      >
        Add Trade Offer
      </Button>
    </div>
  );
}
