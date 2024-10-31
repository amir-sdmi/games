import { useState } from "react";
import { emptyTempTradeOffer } from "../../../../server/services/gameInitial";

import TradeSetting from "./TradeSetting";
import TradeTemp from "./TradeTemp";
import TradeOffers from "./TradeOffers";
import MarketCards from "./MarketCards";
import { GameAndSetGameProps } from "../../props";

export default function Marketing({ game, setGame }: GameAndSetGameProps) {
  const { currentPlayer, players } = game;
  const [tradeTemp, setTradeTemp] = useState(
    emptyTempTradeOffer(currentPlayer.id)
  );
  const [selectedMarketCards, setSelectedMarketCards] = useState<boolean[]>([
    false,
    false,
  ]);

  //handlers

  return (
    <div className="flex gap-2 border border-green-700">
      <MarketCards
        game={game}
        setGame={setGame}
        selectedMarketCards={selectedMarketCards}
        setSelectedMarketCards={setSelectedMarketCards}
        tradeTemp={tradeTemp}
        setTradeTemp={setTradeTemp}
      />
      <TradeSetting
        currentPlayer={currentPlayer}
        players={players}
        setTradeTemp={setTradeTemp}
        tradeTemp={tradeTemp}
      />
      <TradeTemp
        tradeTemp={tradeTemp}
        setTradeTemp={setTradeTemp}
        game={game}
        setGame={setGame}
        selectedMarketCards={selectedMarketCards}
        setSelectedMarketCards={setSelectedMarketCards}
      />
      <TradeOffers game={game} setGame={setGame} />
    </div>
  );
}
