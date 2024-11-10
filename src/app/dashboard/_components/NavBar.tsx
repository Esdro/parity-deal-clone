import React from 'react';
import BrandLogo from '@/components/BrandLogo';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import {ThemeModeToggle} from "@/components/theme/themeToggler";

function DashboardNavBar() {
    return (
        <header className='flex gap-8 shadow-md py-6 px-6 items-center bg-background '>
            <Link className='mr-auto' href={"/dashboard"}>
                <BrandLogo/>
            </Link>
            <Link href="/dashboard/products"> Products  </Link>
            <Link href="/dashboard/analytics"> Analytics  </Link>
            <Link href="/dashboard/subscriptions"> Subscriptions  </Link>
            <UserButton/>
            <ThemeModeToggle/>
        </header>
    );
}

export default DashboardNavBar;