import React, {ReactNode} from 'react';
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import PageWithReturnButton from "@/app/dashboard/_components/page-with-return-button";
import {getProductById} from "@/server/actions/product";
import {notFound} from "next/navigation";
import {auth} from "@clerk/nextjs/server";
import AddProductForm from "@/app/dashboard/_components/AddProductForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ProductTable} from "@/drizzle/schema";
import CountryGroupsDiscountForm from "@/app/dashboard/_components/CountryGroupForm";
import {getProductCountryGroups, getProductCustomization} from "@/server/db/products";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {InfoIcon} from "lucide-react";
import {canCustomizeBanner, canRemoveBranding} from "@/server/permissions";
import ProductCustomizationForm from "@/app/dashboard/_components/ProductCustomizationForm";
import CountryTabsContent from "@/app/dashboard/products/[productId]/edit/_components/country-tabs-content";

// Pas bien de le faire dans la nouvelle version 15 de Next.js
/*
type  EditProductPageProps = {
    params: {
        productId: string;
    }
};
*/

async function EditProductPage({params, searchParams}) {

    const {productId} = await params;
    const {tab} = await searchParams;

    const {userId} = await auth();

    if (!userId) return notFound();

    const product = await getProductById(productId, userId);

    if (!product) return notFound();


    return (
        <PageWithReturnButton pageTitle={` Edit " ${product.name} " `} returnButtonHref={"/dashboard"}>
            <Tabs defaultValue={tab} orientation='vertical' className=" rounded-lg m-auto ">
                <TabsList className=' min-h-[40px] bg-card-foreground text-card '>
                    <TabsTrigger className='min-h-[30px] ' value="details">Product Details</TabsTrigger>
                    <TabsTrigger className='min-h-[30px] ' value="country">Countries Discount </TabsTrigger>
                    <TabsTrigger className='min-h-[30px] ' value="customization">Banner Customization</TabsTrigger>
                </TabsList>
                <div className='mt-8'>
                    <TabsContent value="details">
                        <DetailsTabsContent product={product}/>
                    </TabsContent>
                    <TabsContent value="country">
                       <CountryTabsContent productId={productId} userId={userId}/>
                    </TabsContent>
                    <TabsContent value="customization">
                        <CustomizationTabsContent product={product} userId={userId}/>
                    </TabsContent>
                </div>
            </Tabs>
        </PageWithReturnButton>
    );
}




/**
 * DetailsTabsContent
 * @param product
 * @constructor
 */
function DetailsTabsContent({product}: { product: typeof ProductTable.$inferInsert }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl'>Product Details</CardTitle>
                <CardDescription className='text-xl'> Update your product details </CardDescription>
            </CardHeader>
            <CardContent>
                <AddProductForm product={product}/>
            </CardContent>
        </Card>
    )
}


 async function CustomizationTabsContent({product, userId}: {
    product: typeof ProductTable.$inferInsert,
    userId: string
}) {

    const {id: productId} = product;

    if (!productId) return null;

    const customization = await getProductCustomization({productId, userId});

    if (!customization) return notFound();

    const canCustomize = await canCustomizeBanner(userId);
    const canRemove = await canRemoveBranding(userId);

    // console.log(canCustomize, canRemove);

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl'>Top Banner Customization</CardTitle>
                <CardDescription className='text-xl'> Customize your product </CardDescription>
            </CardHeader>
            <CardContent>
                <ProductCustomizationForm
                    customization={customization}
                    canCustomizeBanner={canCustomize}
                    canRemoveBranding={canRemove}
                />
            </CardContent>
        </Card>
    )
}


export default EditProductPage;