import {
  ClerkProvider,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>React Games</title>
        </head>
        <body className="bg-black text-white">
          <SignedIn>
            <SignOutButton redirectUrl="/sign-in" />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <main className="container  px-4 py-6 mx-auto">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
