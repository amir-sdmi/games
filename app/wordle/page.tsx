"use client";
import { ReactNode, useEffect, useState } from "react";

export default function WordlePage() {
  const [answer, setAnswer] = useState("");
  const [word, setWord] = useState(new Array(5).fill(""));
  const [wordIndex, setWordIndex] = useState(0);
  const [isNotWord, setIsNotWord] = useState(false);

  useEffect(() => {
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

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (word.every((letter) => letter !== "")) {
          //TODO if user didnt changed the word and pressed enter again, dont send request, just say this is not a valid word !
          if (await isValidWord(word.join(""))) {
            setAnswer(word.join(""));
          } else {
            setIsNotWord(true);
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
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [word, wordIndex]);

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
