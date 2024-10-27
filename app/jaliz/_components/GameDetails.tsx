import { GameType } from "../_types/types";

export default function GameDetails({ game }: { game: GameType }) {
  const {
    round,
    deck,
    discardPile,
    players,
    currentPlayer,
    availableManures,
    availableTractors,
    endTurnReceivingCardsCount,
  } = game;

  return (
    <div>
      <h1>Gameboard</h1>
      <p>round : {round}</p>
      <p>deck : {deck.length} cards</p>
      <p>discards : {discardPile.length}</p>
      <p>players number: {players.length}</p>
      <p>
        current player: {currentPlayer.id} : {currentPlayer.turnStatus}
      </p>
      <p>available manures: {availableManures}</p>
      <p>available tractors: {availableTractors}</p>
      <p>end turn receiving cards count: {endTurnReceivingCardsCount}</p>
      <hr />
    </div>
  );
}
