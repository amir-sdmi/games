import { CardType, CurrentPlayer, GameType, PlayerType } from "../_types/types";
import { addCardsToHand } from "../_utils/actions/addCardsToHand";
import { plantFromHand } from "../_utils/actions/plantFromHand";
import { nextRound } from "../_utils/gameMaster";
import Button from "./ui/Button";

export default function PlayerDetails({
  player,
  game,
  setGame,
}: {
  player: PlayerType;
  game: GameType;
  setGame: (game: GameType) => void;
}) {
  const { currentPlayer, players, deck } = game;
  const handlePlantFromHand = (
    fieldIndex: number,
    card: CardType,
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
    const newDeck = [...deck];
    const newMarkettingCards = currentPlayer.markettingCards;
    for (let i = 0; i < 2; i++) {
      const card = newDeck.pop() as CardType;
      const newCard = {
        ...card,
        inHandOrMarketId: newMarkettingCards.length,
      };
      newMarkettingCards.push(newCard);
    }
    const newCurrentPlayer: CurrentPlayer = {
      ...currentPlayer,
      markettingCards: newMarkettingCards,
      turnStatus: "marketting",
    };

    setGame({
      ...game,
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
            start marketting
          </Button>
          <Button
            onClick={() => handleAddCardsToHand(player)}
            disabled={
              //TODO : this is not totally correct, later should change it
              (currentPlayer.markettingCards.length !== 0 &&
                currentPlayer.turnStatus === "marketting") ||
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
            {card.name} {card.inHandOrMarketId}
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
