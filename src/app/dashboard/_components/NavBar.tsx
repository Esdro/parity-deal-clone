import React from 'react';
import BrandLogo from '@/components/BrandLogo';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

function DashboardNavBar() {
    return (
        <header className='flex gap-8 shadow-md container py-6 px-6 items-center bg-background '>
            <Link className='mr-auto' href={"/dashboard"}>
                <BrandLogo/>
            </Link>
            <Link href="/dashboard/products"> Products  </Link>
            <Link href="/dashboard/discounts"> Analytics  </Link>
            <Link href="/dashboard/suscriptions"> Suscribtions  </Link>
            <UserButton/>
        </header>
    );
}

export default DashboardNavBar;