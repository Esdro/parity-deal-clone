import React from 'react';
import BrandLogo from '@/components/BrandLogo';
import {UserButton} from '@clerk/nextjs';
import Link from 'next/link';
import {ThemeModeToggle} from "@/components/theme/themeToggler";
import ResponsiveNav from "@/components/responsive/mobile-nav";

function DashboardNavBar() {
    return (
        <header className='flex gap-8 shadow-md py-6 px-6 items-center bg-background '>
            <Link className='mr-auto' href={"/dashboard"}>
                <BrandLogo/>
            </Link>
            <ResponsiveNav side="right">
                <Link href="/dashboard/products"> Products </Link>
                <Link href="/dashboard/analytics"> Analytics </Link>
                <Link href="/dashboard/subscriptions"> Subscriptions </Link>
                <UserButton/>
                <ThemeModeToggle/>
            </ResponsiveNav>
        </header>
    );
}

export default DashboardNavBar;