import React from 'react';
import PageWithReturnButton from "@/app/dashboard/_components/page-with-return-button";
import AddProductForm from "@/app/dashboard/_components/AddProductForm";
import {canCreateProduct} from "@/server/permissions";
import {auth} from "@clerk/nextjs/server";
import {notFound} from "next/navigation";
import HasPermission from "@/components/HasPermission";



async function AddNewProductPage() {

    const {userId} = await auth();

    if (!userId) return notFound();

    const createProduct = await canCreateProduct(userId);

    return (
        <PageWithReturnButton pageTitle={"New Product"} returnButtonHref={"/dashboard"}>
            <HasPermission
                permission={createProduct}
                renderFallback={true}
                fallbackMessage={"You have reached the maximum number of products you can create. Try upgrading your account to create more."}
            >
                <div className={'bg-background p-8 rounded shadow  mb-12 '}>
                    <h2 className={"text-2xl pl-6 font-bold"}>Add New Product</h2>
                    <AddProductForm/>
                </div>
            </HasPermission>
        </PageWithReturnButton>
    );
}

export default AddNewProductPage;