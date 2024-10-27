import type { Metadata } from "next";
import {Fredoka} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const googleFredoka = Fredoka( {
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
}); 

export const metadata: Metadata = {
  title: "Custom PPP",
  description: "A clone of Parity Deal site"
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="scroll-smooth" suppressHydrationWarning >
      <body
        className={`${googleFredoka.className} antialiased bg-background  `}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
