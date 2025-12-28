import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GLM Slide Agent | AI-Powered Pitch Deck",
  description: "Generate professional slides and posters in seconds through conversation.",
  openGraph: {
    title: "GLM Slide Agent | Nano Banana",
    description: "AI-powered presentation and poster generation in seconds.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLM Slide Agent | Nano Banana",
    description: "AI-powered presentation and poster generation in seconds.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${outfit.variable} antialiased bg-background text-foreground selection:bg-brand selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
