"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";

export default function WordlePage() {
  const [answer, setAnswer] = useState("");
  const [word, setWord] = useState(new Array(5).fill(""));
  const [wordIndex, setWordIndex] = useState(0);
  const [isNotWord, setIsNotWord] = useState(false);
  const [lastChekcedWord, setLastCheckedWord] = useState("");

  const isValidWord = async (word: string) => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!res.ok) return false;
      const result = await res.json();
      return result[0]?.word ? true : false;
    } catch (error) {
      console.error("Error checking word:", error);
      return false;
    }
  };
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (word.every((letter) => letter !== "")) {
          const currentWord = word.join("");

          if (currentWord === lastChekcedWord) {
            setIsNotWord(true);
            return;
          }

          if (await isValidWord(currentWord)) {
            setAnswer(currentWord);
            setIsNotWord(false); //is it neccessary?
          } else {
            setIsNotWord(true);
            setLastCheckedWord(currentWord);
          }
        }
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (wordIndex < word.length && word[wordIndex] === "") {
          const newWord = [...word];
          newWord[wordIndex] = e.key.toUpperCase();
          setWord(newWord);
          if (wordIndex < word.length) {
            setWordIndex((prevIndex) => prevIndex + 1);
          }
        }
      } else if (e.key === "Backspace") {
        setIsNotWord(false);
        const newWord = [...word];
        newWord[wordIndex - 1] = "";
        setWord(newWord);
        if (wordIndex > 0) {
          setWordIndex((prevIndex) => prevIndex - 1);
        }
      }
    },
    [word, wordIndex, lastChekcedWord]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div className="flex justify-center items-center">
        {word.map((letter, index) => (
          <Square key={index}>{letter}</Square>
        ))}
      </div>
      <div>{isNotWord && <p>Is not a Valid Word</p>}</div>
    </>
  );
}

const Square = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-14 w-14 rounded border border-gray-600 bg-gray-200 flex justify-center items-center font-bold text-2xl">
      {children}
    </div>
  );
};
