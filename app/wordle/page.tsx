"use client";
import Square from "./_components/Square";
import { getRandomWord } from "./_utils/words";
import { useCallback, useEffect, useState } from "react";
type Word = {
  char: string;
  charStatus: "empty" | "filled" | "correct" | "wrong" | "wrongPosition";
};

const initialState = {
  position: { row: 0, column: 0 },
  lastChecked: "",
  isNotWord: false,
  pickedWord: [""],
  initialWord: {
    char: "",
    charStatus: "empty",
  } as Word,
  gameState: "playing" as GameState,
};
type GameState = "playing" | "won" | "lost";
export default function WordlePage() {
  const [gameState, setGameState] = useState<GameState>(initialState.gameState);
  const [reset, setReset] = useState(false);
  const [pickedWord, setPickedWord] = useState(initialState.pickedWord);
  // 6 rows and 5 columns
  const [answer, setAnswer] = useState<Word[][]>(
    Array(6)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => ({ ...initialState.initialWord }))
      )
  );

  const [position, setPosition] = useState(initialState.position);

  const [lastChecked, setLastCheckedWord] = useState(initialState.lastChecked);

  const [isNotWord, setIsNotWord] = useState(initialState.isNotWord);
  useEffect(() => {
    if (reset) {
      setAnswer(
        Array(6)
          .fill(null)
          .map(() =>
            Array(5)
              .fill(null)
              .map(() => ({ ...initialState.initialWord }))
          )
      );
      setPosition(initialState.position);
      setIsNotWord(initialState.isNotWord);
      setLastCheckedWord(initialState.lastChecked);
      setGameState(initialState.gameState);
    }
    // generate a new word when the page loads
    const newWord = getRandomWord().toUpperCase().split("");
    setPickedWord(newWord);
    setReset(false);
  }, [reset]);

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
      newAnswer[position.row] = updatedWord;
      setAnswer(newAnswer);
      if (updatedWord.every((letter) => letter.charStatus === "correct")) {
        setGameState("won");
      } else if (position.row === answer.length - 1) {
        setGameState("lost");
      }

      setPosition((prevPosition) => ({
        row: prevPosition.row + 1,
        column: 0,
      }));
    },
    [answer, position]
  );

  const isValidWord = async (word: string) => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (res.status === 404) return false;
      if (!res.ok) throw new Error("Error fetching word");

      const result = await res.json();
      return result[0]?.word ? true : false;
    } catch (error) {
      console.error("Error checking word:", error);
      return false;
    }
  };
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (gameState === "won" || gameState === "lost") return;

      if (e.key === "Enter") {
        if (
          answer[position.row].every((letter) => letter.charStatus !== "empty")
        ) {
          const currentWord = answer[position.row]
            .map((letter) => letter.char)
            .join("");

          //prevent fetching the same word
          if (currentWord === lastChecked) {
            setIsNotWord(true);
            return;
          }

          if (await isValidWord(currentWord)) {
            setIsNotWord(false);
            checkWord(answer[position.row], pickedWord);
          } else {
            setIsNotWord(true);
            setLastCheckedWord(currentWord);
          }
        }
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (
          position.column < answer[position.row].length &&
          answer[position.row][position.column].charStatus === "empty"
        ) {
          const newAnswer = [...answer];

          newAnswer[position.row][position.column].char = e.key.toUpperCase();
          newAnswer[position.row][position.column].charStatus = "filled";
          setAnswer(newAnswer);

          if (position.column < answer[position.row].length) {
            setPosition((prevPosition) => ({
              ...prevPosition,
              column: prevPosition.column + 1,
            }));
          }
        }
      } else if (e.key === "Backspace") {
        if (position.column > 0) {
          setIsNotWord(false);

          const newAnswer = [...answer];
          newAnswer[position.row][position.column - 1].char = "";
          newAnswer[position.row][position.column - 1].charStatus = "empty";
          setAnswer(newAnswer);

          setPosition((prevPosition) => ({
            ...prevPosition,
            column: prevPosition.column - 1,
          }));
        }
      }
    },
    [answer, position, lastChecked, pickedWord, checkWord, gameState]
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
      <div className="text-lg">
        {gameState === "won" ? (
          <p className="bg-green-500 p-4">You won!</p>
        ) : gameState === "lost" ? (
          <p className="bg-red-500 p-4">You lost!</p>
        ) : null}
      </div>
      <button
        className="rounded bg-gray-200 border border-blue-400 px-4 py-1"
        onClick={() => setReset(true)}
      >
        RESET
      </button>
    </>
  );
}
