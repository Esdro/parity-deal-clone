import BrandLogo from "@/components/BrandLogo";
import {Button} from "@/components/ui/button";
import {SignedIn, SignedOut, SignInButton} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import {ThemeModeToggle} from "@/components/theme/themeToggler";
import ResponsiveNav from "@/components/responsive/mobile-nav";

function NavBar() {
    return (
        <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
            <nav className="flex items-center gap-10 container font-semibold ">
                <Link href="/" className="mr-auto">
                    <BrandLogo/>
                </Link>
                <ResponsiveNav side='left'>
                    <Link href={"/#features"} className="text-lg">
                        Features
                    </Link>
                    <Link href={"/#pricing"} className="text-lg">
                        Pricing
                    </Link>
                    <Link href={"/#about"} className="text-lg">
                        About
                    </Link>
                    <span className="text-lg">

                       <SignedIn>
                        <Link href="/dashboard">Dashboard</Link>
                       </SignedIn>
                       <SignedOut>
                        <SignInButton>
                            <Button variant="accent" className="text-balance  text-xl p-4 ">Login </Button>
                        </SignInButton>
                       </SignedOut>
                    </span>
                    <ThemeModeToggle/>
                </ResponsiveNav>
            </nav>
        </header>

    );
}

export default NavBar;
