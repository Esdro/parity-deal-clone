import React from 'react';
import NoProduct from './_components/NoProduct';
import {getAllProductsFromUser} from "@/server/db/products";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import ProductGridList from "@/app/dashboard/_components/ProductCardList";
import {PlusIcon} from "@radix-ui/react-icons";
import {auth} from "@clerk/nextjs/server";
import {notFound} from "next/navigation";


async function DashboardPage() {
    const {userId} = await auth();
    if (!userId) return notFound();

    const allProducts = await getAllProductsFromUser(userId, {limit: 8});

    return (
        <>
            {allProducts.length > 0 ? (
                <div className='mt-8 m-auto flex flex-col space-y-4 '>
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col gap-y-2'>
                            <h2 className='text-2xl font-bold'>Products</h2>
                            <p className='text-gray-500'>Here are all the products available</p>
                        </div>
                        <Button asChild>
                            <Link href={'/dashboard/products/new'}>
                                <PlusIcon className='size-6 '/>
                                New product
                            </Link>
                        </Button>
                    </div>
                    <ProductGridList products={allProducts}/>
                </div>
            ) : (
                <NoProduct/>
            )}
        </>
    );
}


export default DashboardPage;