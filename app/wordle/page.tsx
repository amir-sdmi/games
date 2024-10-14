"use client";
import { getRandomWord } from "./_utils/words";
import { useCallback, useEffect, useState } from "react";
type Word = {
  char: string;
  charStatus: "empty" | "filled" | "correct" | "wrong" | "wrongPosition";
};
const initialWord: Word = {
  char: "",
  charStatus: "empty",
};
export default function WordlePage() {
  const [pickedWord, setPickedWord] = useState(["H", "E", "L", "L", "O"]);
  // 6 rows and 5 columns
  const [answer, setAnswer] = useState<Word[][]>(
    new Array(6).fill(null).map(() =>
      Array(5)
        .fill(null)
        .map(() => ({ ...initialWord }))
    )
  );

  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [lastChecked, setLastCheckedWord] = useState("");

  const [isNotWord, setIsNotWord] = useState(false);
  // generate a new word when the page loads
  useEffect(() => {
    const newWord = getRandomWord().toUpperCase().split("");

    setPickedWord(newWord);
  }, []);

  const checkWord = useCallback(
    (word: Word[], pickedWord: string[]) => {
      const updatedWord = word.map((letter, index): Word => {
        if (letter.char === pickedWord[index]) {
          return { ...letter, charStatus: "correct" };
        } else if (pickedWord.includes(letter.char)) {
          return { ...letter, charStatus: "wrongPosition" };
        } else {
          return { ...letter, charStatus: "wrong" };
        }
      });

      const newAnswer = [...answer];
      newAnswer[row] = updatedWord;
      setAnswer(newAnswer);
      setRow((prevRow) => prevRow + 1);
      setColumn(0);
    },
    [answer, row]
  );

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
        if (answer[row].every((letter) => letter.charStatus !== "empty")) {
          const currentWord = answer[row].map((letter) => letter.char).join("");

          //prevent fetching the same word
          if (currentWord === lastChecked) {
            setIsNotWord(true);
            return;
          }

          if (await isValidWord(currentWord)) {
            setIsNotWord(false);

            checkWord(answer[row], pickedWord);
          } else {
            setIsNotWord(true);
            setLastCheckedWord(currentWord);
          }
        }
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (
          column < answer[row].length &&
          answer[row][column].charStatus === "empty"
        ) {
          const newAnswer = [...answer];

          newAnswer[row][column].char = e.key.toUpperCase();
          newAnswer[row][column].charStatus = "filled";
          setAnswer(newAnswer);

          if (column < answer[row].length) {
            setColumn((prevIndex) => prevIndex + 1);
          }
        }
      } else if (e.key === "Backspace") {
        if (column > 0) {
          setIsNotWord(false);

          const newAnswer = [...answer];
          newAnswer[row][column - 1].char = "";
          newAnswer[row][column - 1].charStatus = "empty";
          setAnswer(newAnswer);

          setColumn((prevIndex) => prevIndex - 1);
        }
      }
    },
    [answer, row, column, lastChecked, pickedWord, checkWord]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center">
        {answer.map((answerRow, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {answerRow.map((letter, index) => (
              <Square
                key={index}
                char={letter.char}
                charStatus={letter.charStatus}
              />
            ))}
          </div>
        ))}
      </div>
      <div>{isNotWord && <p>Is not a Valid Word</p>}</div>
    </>
  );
}

const Square = ({ char, charStatus }: Word) => {
  const backgroundColor =
    charStatus === "correct"
      ? "bg-green-500"
      : charStatus === "wrongPosition"
        ? "bg-yellow-500"
        : charStatus === "wrong"
          ? "bg-gray-500"
          : "bg-gray-200"; // Default for empty or filled but not checked

  return (
    <div
      className={`h-14 w-14 rounded border border-gray-500 ${backgroundColor} flex justify-center items-center font-bold text-2xl`}
    >
      {char}
    </div>
  );
};
