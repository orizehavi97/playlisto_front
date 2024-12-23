import { ThemeProvider } from "@/components/themeProvider";
import { ThemeToggle } from "@/components/themeToggle";
import { GameProvider } from "@/context/gameContext/GameProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Playlisto",
  description: "A multiplayer song guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeToggle />
          <GameProvider>{children}</GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
