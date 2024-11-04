import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold ">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link href={"/#features"} className="text-lg">
          Features
        </Link>
        <Link href={"/#pricing"} className="text-lg">
          Pricing
        </Link>
        <Link href={"/#about"} className="text-lg">
          About
        </Link>
           {/* <UserButton/> */}
        <span className="text-lg">

           <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
           </SignedIn>
           <SignedOut>
            <SignInButton >
                <Button variant="accent" className="text-balance  text-xl p-4 ">Login </Button>
            </SignInButton>
           </SignedOut>
        </span>
      </nav>
    </header>
  );
}

export default NavBar;
