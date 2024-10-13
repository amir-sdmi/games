import Link from "next/link";

const games = [
  { name: "Wordle", href: "/wordle" },
  { name: "Capitals", href: "/capitals" },
];
export default function Home() {
  return (
    <div>
      <ul className="flex gap-2">
        {games.map((game) => (
          <li key={game.href}>
            <Link href={game.href}>{game.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
