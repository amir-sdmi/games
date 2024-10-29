import { CardInformationType, CardsType } from "../_types/types";
import { cardData } from "./cardData";

export function fromDeckToHand(card: CardInformationType, hand: CardsType[]) {
  const updatedHand = [...hand];

  // Find if the card already exists in hand
  const cardInHand = updatedHand.find((c) => c.id === card.id);

  if (cardInHand) {
    // Increase quantity if card is already in hand
    cardInHand.quantity++;
  } else {
    // Add the card to hand with quantity 1 if not already present
    updatedHand.push({ ...card, quantity: 1 });
  }

  return updatedHand;
}

export function cardName(id: number | null) {
  if (id === null) return "No card";
  const foundCard = cardData.find((card) => card.id === id);
  return foundCard ? foundCard.name : "Unknown card";
}

export function showHandCardsSeperately(hand: CardsType[]) {
  const seperatedHand: CardsType[] = [];

  hand.forEach((card) => {
    for (let i = 0; i < card.quantity; i++) {
      seperatedHand.push({ ...card, quantity: 1 });
    }
  });
  return seperatedHand;
}
