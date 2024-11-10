import React from 'react';
import {auth} from "@clerk/nextjs/server";
import {getAllProductsFromUser} from "@/server/db/products";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PlusIcon} from "@radix-ui/react-icons";
import ProductGridList from "@/app/dashboard/_components/ProductCardList";
import NoProduct from "@/app/dashboard/_components/NoProduct";

async function Page() {
    const {userId, redirectToSignIn} = await auth();


    if (!userId) return redirectToSignIn();

    const allProducts = await getAllProductsFromUser(userId, {});

    if (allProducts.length === 0) {
        return <NoProduct/>
    }

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

export default Page;