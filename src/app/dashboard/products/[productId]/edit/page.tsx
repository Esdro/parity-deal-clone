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


/**
 * CountryTabsContent
 * @param productId
 * @param userId
 * @constructor
 */
export async function CountryTabsContent({productId, userId}: { productId: string, userId: string }) {

    const countryGroups = await getProductCountryGroups({productId, userId});


    // console.log(countryGroups);
    /* [
         {id: "1", name: "Country Group 1", recommendedDiscountPercentage: 10, countries: [{name: "France", code: "FR"}, {name: "Germany", code: "DE"},{name: "Italy", code: "IT"} ], discount: {coupon: "EUROPE10", discountPercentage: 0.1}},
         {id: "2", name: "Country Group 2", recommendedDiscountPercentage: 30, countries: [ {name: "Bénin", code: "BJ"}, {name: "Cameroon", code: "CM"}, {name: "Algérie", code: "DZ"} ], discount: {coupon: "AFRO30", discountPercentage: 0.2}},
         {id: "3", name: "Country Group 3", recommendedDiscountPercentage: 20, countries: [{name: "India", code: "IN"}, {name: "China", code: "CN"}], discount: {coupon: "ASIA20", discountPercentage: 0.3}},
     ]*/

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl'>Country Discounts</CardTitle>
                <Alert  className='!my-4 flex gap-8 items-center justify-between '>
                    <InfoIcon className='size-6 text-red-600 '/>
                    <div>
                        <AlertTitle>Country Groups Discount</AlertTitle>
                        <AlertDescription> Leave the discount field blank if you do not want to display deals for specific
                            parity group </AlertDescription>
                    </div>
                </Alert>
            </CardHeader>
            <CardContent>
                <CountryGroupsDiscountForm productId={productId} countryGroups={countryGroups}/>
            </CardContent>
        </Card>
    )
}


export async function CustomizationTabsContent({product, userId}: {
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