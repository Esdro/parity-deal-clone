import type { Metadata } from "next";
import {Fredoka} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster";
import React, {ReactNode} from "react";

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
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="scroll-smooth" suppressHydrationWarning >
      <body
        className={`${googleFredoka.className} antialiased bg-background  `}
      >
        {children}
      <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
