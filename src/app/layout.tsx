import type {Metadata} from "next";
import {Fredoka} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster";
import React, {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme/themeProvider";

const googleFredoka = Fredoka({
    subsets: ["latin"],
    display: "swap",
    weight: ["300"],
});

export const metadata: Metadata = {
    title: "Custom PPP",
    description: "Ceci est un projet React avec Next.js à travers lequel j'apprends à cloner le site de Parity Deal. Il est important de noter que j'ai suivi un tutoriel YouTube pour réaliser ce projet.",
    openGraph: {
        title: "Custom PPP",
        description: "Ceci est un projet React avec Next.js à travers lequel j'apprends à cloner le site de Parity Deal. Il est important de noter que j'ai suivi un tutoriel YouTube pour réaliser ce projet.",
        type: "website",
        locale: "fr_FR",
        url: "https://p-clone.vercel.app/",
        images: ['../../public/icon.png']

    },
    authors:[
        {
            name: "Esdras Onionkiton",
            url: "https://github.com/Esdro"
        }
    ]
}


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body
                className={`${googleFredoka.className} antialiased bg-background  `}
            >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster/>
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}
