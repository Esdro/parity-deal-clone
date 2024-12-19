import BrandLogo from "@/components/BrandLogo";
import {Button} from "@/components/ui/button";
import {SignedIn, SignedOut, SignInButton} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import {ThemeModeToggle} from "@/components/theme/themeToggler";
import ResponsiveNav from "@/components/responsive/mobile-nav";
import {LangToggle} from "@/components/theme/langToggler";
import {getDictionary} from "../../../../../get-dictionary";

async function NavBar({lang}: { lang: "fr" | "en" | "es" }) {

   const dict = await getDictionary(lang);

  //  console.log('dict', dict);
    return (
        <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
            <nav className="flex items-center gap-10 container font-semibold ">
                <Link href={`/${lang}`} className="mr-auto">
                    <BrandLogo/>
                </Link>
                <ResponsiveNav side='left'>
                    <Link href={`/${lang}`}> {dict.navigation.home} </Link>
                    <Link href={`/${lang}/#features`} className="text-lg">
                        {dict.navigation.features}
                    </Link>
                    <Link href={`/${lang}/#pricing`} className="text-lg">
                        {dict.navigation.pricing}
                    </Link>
                    <Link href={`/${lang}/#about`} className="text-lg">
                        {dict.navigation.about}
                    </Link>
                    <span className="text-lg">

                       <SignedIn>
                        <Link href={`/${lang}/dashboard`}>{dict.navigation.dashboard}</Link>
                       </SignedIn>
                       <SignedOut>
                        <SignInButton>
                            <Button variant="accent" className="text-balance  text-xl p-4 ">{dict.navigation.login} </Button>
                        </SignInButton>
                       </SignedOut>
                    </span>
                    <ThemeModeToggle/>
                    <LangToggle/>
                </ResponsiveNav>
            </nav>
        </header>

    );
}

export default NavBar;
