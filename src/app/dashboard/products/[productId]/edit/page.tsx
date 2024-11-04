import React from 'react';
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import PageWithReturnButton from "@/app/dashboard/_components/page-with-return-button";
import {getProductById} from "@/server/actions/product";
import {notFound} from "next/navigation";

// Pas bien de le faire dans la nouvelle version 15 de Next.js
/*
type  EditProductPageProps = {
    params: {
        productId: string;
    }
};
*/

// @ts-ignore
async function EditProductPage({params, searchParams}) {

    const { productId } = await params;
    const { tab } = await searchParams;

    const { name, description}  = await getProductById(productId);



    if (!name) return notFound();

    return (
       <PageWithReturnButton pageTitle={` Edit " ${name} " `} returnButtonHref={"/dashboard"}>
           <Tabs defaultValue="account" orientation='vertical' className=" p-8 rounded-lg m-auto bg-background">
               <TabsList className="grid min-h-[70px] w-full grid-cols-3">
                   <TabsTrigger className='h-[60px] text-xl'  value="account">Details</TabsTrigger>
                   <TabsTrigger className='h-[60px] text-xl' value="password">Integrations</TabsTrigger>
                   <TabsTrigger className='h-[60px] text-xl' value="countries">Countries</TabsTrigger>
               </TabsList>
               <div className='mt-8'>
                   <TabsContent value="account">Make changes to your {productId} account here.</TabsContent>
                   <TabsContent value="password">{description}</TabsContent>
                   <TabsContent value="countries">Update countries list here.</TabsContent>
               </div>
           </Tabs>
       </PageWithReturnButton>
    );
}

export default EditProductPage;