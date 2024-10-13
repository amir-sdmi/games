import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Games",
  description: "some simple games challanges in react",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
