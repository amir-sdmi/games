type Word = {
  char: string;
  charStatus: "empty" | "filled" | "correct" | "wrong" | "wrongPosition";
};

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

export default Square;
