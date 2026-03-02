import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wybe OS Local",
  description: "Self-hosted Wybe voice + chat system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
