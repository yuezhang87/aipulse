import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "aiPulse — AI Stories Discovery",
  description: "Discover the latest AI stories, breakthroughs, and insights curated for you.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-navy text-foreground">
        {children}
      </body>
    </html>
  );
}
