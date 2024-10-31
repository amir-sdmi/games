import {
  CardInformationType,
  CardsType,
  CurrentPlayer,
  GameType,
  PlayerType,
} from "../_types/types";
import { addCardsToHand } from "../_utils/actions/addCardsToHand";
import { plantFromHand } from "../_utils/actions/plantFromHand";
import { nextRound } from "../_utils/gameMaster";
import { cardName } from "../_utils/utils";
import Button from "./ui/Button";
interface PlayerDetailsProps {
  player: PlayerType;
  game: GameType;
  setGame: (game: GameType) => void;
}

export default function PlayerDetails({
  player,
  game,
  setGame,
}: PlayerDetailsProps) {
  const { currentPlayer, players } = game;
  const handlePlantFromHand = (
    fieldIndex: number,
    card: CardsType,
    player: PlayerType
  ) => {
    const {
      hand: newHand,
      field: newField,
      currentPlayer: newCurrentPlayer,
    } = plantFromHand(
      player.hand,
      player.fields[fieldIndex],
      card,
      currentPlayer
    );

    setGame({
      ...game,
      players: players.map((p) =>
        p.id === player.id
          ? {
              ...p,
              hand: newHand,
              fields: p.fields.map((f, i) => (i === fieldIndex ? newField : f)),
            }
          : p
      ),
      currentPlayer: newCurrentPlayer,
    });
  };

  const handleAddCardsToHand = (player: PlayerType) => {
    let updatedGame = { ...game };
    if (updatedGame.deck.length < updatedGame.endTurnReceivingCardsCount) {
      console.log("next round");
      updatedGame = nextRound(updatedGame);
    }
    updatedGame = addCardsToHand(updatedGame, player);
    setGame(updatedGame);
  };

  const handleShowMarketCards = () => {
    let updatedGame = { ...game };
    if (updatedGame.deck.length < 2) {
      console.log("next round");
      updatedGame = nextRound(updatedGame);
    }
    const newDeck = [...updatedGame.deck];
    const newMarketingCards = updatedGame.currentPlayer.marketingCards;
    for (let i = 0; i < 2; i++) {
      const card = newDeck.pop() as CardInformationType;
      if (card) {
        const newCard: CardsType = {
          id: card.id,
          quantity: 1,
        };
        newMarketingCards.push(newCard);
      }
    }
    const newCurrentPlayer: CurrentPlayer = {
      ...updatedGame.currentPlayer,
      marketingCards: newMarketingCards,
      turnStatus: "marketing",
    };

    setGame({
      ...updatedGame,
      currentPlayer: newCurrentPlayer,
      deck: newDeck,
    });
  };

  return (
    <div>
      {player.id === currentPlayer.id && (
        <div>
          <Button
            onClick={() => handleShowMarketCards()}
            disabled={
              currentPlayer.turnStatus !== "planting" ||
              currentPlayer.plantCounts < 1
            }
          >
            start marketing
          </Button>
          <Button
            onClick={() => handleAddCardsToHand(player)}
            disabled={
              //TODO : this is not totally correct, later should change it
              (currentPlayer.marketingCards.length !== 0 &&
                currentPlayer.turnStatus === "marketing") ||
              currentPlayer.turnStatus === "planting"
            }
          >
            Add Cards To Hand
          </Button>
        </div>
      )}
      <p>id :{player.id}</p>
      <p>name :{player.playerName}</p>
      <p>tractor : {player.tractor ? "yes" : "no"}</p>
      <p>money : {player.money}</p>
      <p>
        hat :
        {player.playerHat.ownedById === player.playerHat.ownerId
          ? "here"
          : players[player.playerHat.ownedById].playerName}
      </p>
      <ol className="border border-blue-500">
        {player.hand.map((card, handIndex) => (
          <li key={handIndex}>
            {cardName(card.id)} {card.quantity}
            {player.id === currentPlayer.id &&
              currentPlayer.turnStatus === "planting" &&
              (currentPlayer.plantCounts < 2 ||
                (currentPlayer.plantCounts < 3 && player.tractor)) && (
                <div>
                  <Button onClick={() => handlePlantFromHand(0, card, player)}>
                    F1
                  </Button>
                  <Button onClick={() => handlePlantFromHand(1, card, player)}>
                    F2
                  </Button>
                  {player.fields.length > 2 && (
                    <Button
                      onClick={() => handlePlantFromHand(2, card, player)}
                    >
                      F3
                    </Button>
                  )}
                </div>
              )}
          </li>
        ))}
      </ol>
    </div>
  );
}
