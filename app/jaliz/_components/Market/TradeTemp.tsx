import { isEqual } from "lodash";
import {
  CardsType,
  CurrentPlayer,
  GameType,
  TradeOffer,
} from "../../_types/types";
import { cardName } from "../../_utils/utils";
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
    const newTradeTemp = { ...tradeTemp };
    const tempCard = newTradeTemp.cardsFromMarket.find((c) => c.id === cardId);
    if (tempCard) {
      if (tempCard.quantity > 0) {
        tempCard.quantity--;
      }
      if (tempCard.quantity === 0) {
        newTradeTemp.cardsFromMarket = newTradeTemp.cardsFromMarket.filter(
          (c) => c.id !== cardId
        );
      }
    }

    setTradeTemp(newTradeTemp);

    const newCurrentPlayer: CurrentPlayer = { ...game.currentPlayer };
    // newCurrentPlayer.markettingCards.push({ id: cardId, quantity: 1 });
    // setGame({ ...game, currentPlayer: newCurrentPlayer });

    const firstDisabledItem = newCurrentPlayer.markettingCards.find(
      (c) =>
        c.id === cardId &&
        selectedMarketCards[newCurrentPlayer.markettingCards.indexOf(c)] ===
          true
    );

    if (firstDisabledItem) {
      const newSelectedMarketCards = [...selectedMarketCards];
      newSelectedMarketCards[
        newCurrentPlayer.markettingCards.indexOf(firstDisabledItem)
      ] = false;
      setSelectedMarketCards(newSelectedMarketCards);
    }
  };
  const handleRemoveHandCardsFromTradeTemp = (cardId: CardsType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    const tempCard = newTradeTemp.cardsFromProposersHand.find(
      (c) => c.id === cardId
    );
    if (tempCard) {
      if (tempCard.quantity > 0) {
        tempCard.quantity--;
      }
      if (tempCard.quantity === 0) {
        newTradeTemp.cardsFromProposersHand =
          newTradeTemp.cardsFromProposersHand.filter((c) => c.id !== cardId);
      }
    }
    setTradeTemp(newTradeTemp);
  };
  const handleRemoveFromRequestCards = (cardId: CardsType["id"]) => {
    const newTradeTemp = { ...tradeTemp };
    const tempCard = newTradeTemp.requestCards.find((c) => c.id === cardId);
    if (tempCard) {
      if (tempCard.quantity > 0) {
        tempCard.quantity--;
      }
      if (tempCard.quantity === 0) {
        newTradeTemp.requestCards = newTradeTemp.requestCards.filter(
          (c) => c.id !== cardId
        );
      }
    }
    setTradeTemp(newTradeTemp);
  };

  const handleAddnewTradeOffer = () => {
    //TODO add better ux to inform user thay have to add at least one market card
    if (tradeTemp.cardsFromMarket.length === 0) return;
    const currentPlayer = game.currentPlayer;

    //if tradeTemp is empty, do nothing
    if (isEqual(tradeTemp, emptyTempTradeOffer(currentPlayer.id))) return;
    //if tradeTemp is already in tradeOffers, do nothing
    if (isEqual(currentPlayer.tradeOffer, tradeTemp)) return;

    //Todo: solve here next time
    // currentPlayer.tradeOffers.map((tradeOffer) => {
    //   if (
    //     tradeOffer.cardsFromProposersHand.length ===
    //     tradeTemp.cardsFromProposersHand.length
    //   ) {
    //     console.log("same length");
    //     const arr = tradeOffer.cardsFromProposersHand.filter((cOffer) =>
    //       tradeTemp.cardsFromProposersHand.some(
    //         (cTemp) => cOffer.id === cTemp.id
    //       )
    //     );
    //     if (isEqual(arr, tradeOffer)) return;
    //   }
    // });

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
        onClick={() => handleAddnewTradeOffer()}
      >
        Add Trade Offer
      </Button>
    </div>
  );
}
