import { CardInformationType, CardsType } from "../types/types";
import { cardData } from "@/server/data/cardData";

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

export const updateCardQuantityMinusOne = (
  cards: CardsType[],
  cardId: CardsType["id"]
) => {
  if (!cards || !Array.isArray(cards)) {
    throw new Error("Cards parameter must be an array");
  }
  if (cardId === undefined || cardId === null) {
    throw new Error("CardId parameter is required");
  }
  return cards
    .map((c) => (c.id === cardId ? { ...c, quantity: c.quantity - 1 } : c))
    .filter((c) => c.quantity > 0);
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
