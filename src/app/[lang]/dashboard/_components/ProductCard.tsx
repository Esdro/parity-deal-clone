import {ProductTable} from "@/drizzle/schema";
import React from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {DotsVerticalIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import AddProductToSiteDialogContent from "@/app/[lang]/dashboard/_components/AddProductToSiteDialogContent";
import {AlertDialog, AlertDialogTrigger} from "@/components/ui/alert-dialog"
import DeleteProductDialogContent from "@/app/[lang]/dashboard/_components/DeleteProductDialogContent";
import {auth} from "@clerk/nextjs/server";
import {Locale} from "../../../../../i18n-config";

type ProductCardProps = {
    product: typeof ProductTable.$inferInsert
    lang: Locale
};

/**
 * Component that displays a product as a card
 * @param product - the product to display
 * @param lang
 * @constructor
 */
export async function ProductCard({product, lang}: ProductCardProps) {

    const {userId} = await auth();

    return (
        <Card className='bg-white shadow-md p-2 rounded-lg'>
            <CardHeader>
                <CardTitle className='text-lg font-bold flex gap-x-4 justify-between items-start'>
                    <span className='text-balance '>{product.name}</span>
                    <Dialog>
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="size-8 p-0 min-w-[35px]">
                                        <div className="sr-only">Action Menu</div>
                                        <DotsVerticalIcon className="size-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions </DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem asChild>
                                        <Link className='cursor-pointer hover:bg-accent '
                                              href={`/${lang}/dashboard/products/${product.id}/edit?tab=details`}>Edit product</Link>
                                    </DropdownMenuItem>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem className='cursor-pointer'>Add to site </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuSeparator className='border-t-2'/>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className='cursor-pointer'>Delete</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DeleteProductDialogContent productId={product.id} userId={userId as string}/>
                        </AlertDialog>
                        <AddProductToSiteDialogContent productId={product.id}/>
                    </Dialog>
                </CardTitle>
                <CardDescription className='text-balance'>{product.url}</CardDescription>
            </CardHeader>
            {product.createdAt && <CardContent>Créé le : <b className='font-bold'> {new Date(product.createdAt).toLocaleDateString()}</b> </CardContent>}
        </Card>
    );
}

export default ProductCard;