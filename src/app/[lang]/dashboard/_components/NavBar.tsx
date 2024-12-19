import React from 'react';
import BrandLogo from '@/components/BrandLogo';
import {UserButton} from '@clerk/nextjs';
import Link from 'next/link';
import {ThemeModeToggle} from "@/components/theme/themeToggler";
import ResponsiveNav from "@/components/responsive/mobile-nav";
import {LangToggle} from "@/components/theme/langToggler";
import {getDictionary} from "../../../../../get-dictionary";

async function DashboardNavBar({lang}: { lang: "fr"| "en" | "es" }) {

    const dict = await getDictionary(lang);
    return (
        <header className='flex gap-8 shadow-md py-6 px-6 items-center bg-background '>
            <Link className='mr-auto' href={`/${lang}/dashboard`}>
                <BrandLogo/>
            </Link>
            <ResponsiveNav side="right">
                <Link href={`/${lang}`}> {dict.navigation.home} </Link>
                <Link href={`/${lang}/dashboard/products`}> {dict.navigation.products} </Link>
                <Link href={`/${lang}/dashboard/analytics`}> {dict.navigation.analytics} </Link>
                <Link href={`/${lang}/dashboard/subscriptions`}> {dict.navigation.subscriptions} </Link>
                <UserButton/>
                <LangToggle/>
                <ThemeModeToggle/>
            </ResponsiveNav>
        </header>
    );
}

export default DashboardNavBar;