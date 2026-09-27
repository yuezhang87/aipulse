import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "aiPulse — Notification & Agent Trends",
  description: "Tracking how mobile notifications and AI agents are evolving, before it becomes obvious.",
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
