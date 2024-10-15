import "./globals.css";

const games = [
  { name: "Wordle", href: "/wordle" },
  { name: "Capitals", href: "/capitals" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React Games</title>
      </head>
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">React Games</h1>
            <nav>
              <ul className="flex space-x-4 mt-4">
                <li>
                  <a href="/" className="text-blue-500 hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-blue-500 hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-blue-500 hover:underline">
                    Contact
                  </a>
                </li>
                {games.map((game) => (
                  <li key={game.href}>
                    <a
                      href={game.href}
                      className="text-blue-500 hover:underline"
                    >
                      {game.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
        <footer className="bg-white shadow mt-6">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-gray-500">
              &copy; {new Date().getFullYear()} React Games. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
