import React from 'react';
import PageWithReturnButton from "@/app/dashboard/_components/page-with-return-button";
import AddProductForm from "@/app/dashboard/_components/AddProductForm";



function AddNewProductPage() {
    return (
        <PageWithReturnButton pageTitle={"New Product"} returnButtonHref={"/dashboard"}>
            <div className={'bg-background p-8 rounded shadow  mb-12 '}>
                <h2 className={"text-2xl pl-6 font-bold"}>Add New Product</h2>
                <AddProductForm/>
            </div>
        </PageWithReturnButton>
    );
}

export default AddNewProductPage;