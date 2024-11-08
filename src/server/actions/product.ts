"use server";
import {z} from "zod";
import {ProductFormSchema} from "@/schemas/products";
import {auth} from "@clerk/nextjs/server";
import {
    addProduct,
    deleteProduct,
    getOneProduct,
    updateProduct,
    updateCountryGroupsDiscountFromDB, updateProductCustomization} from "@/server/db/products";
import {CountryGroupsDiscountSchema} from "@/schemas/countryGroups";
import {productCustomizationSchema} from "@/schemas/productCustomization";
import {canCustomizeBanner} from "@/server/permissions";


export async function createProduct(values: z.infer<typeof ProductFormSchema>): Promise<{
    error: boolean;
    message: string
} | undefined> {
    const {data, success} = ProductFormSchema.safeParse(values);

    const {userId} = await auth();

    if (!success || !userId) {
        return {error: true, message: "There was an error creating your product"};
    }

    const {id} = await addProduct({...data, clerkUserId: userId});

    return {error: false, message: " Product created successfully. "};

    // redirect(`/dashboard/products/${id}/edit?tab=countries`)

}


export async function updateOneProduct(productId: string, values: z.infer<typeof ProductFormSchema>) {

    const {userId} = await auth();

    const {data, success} = ProductFormSchema.safeParse(values);


    if (!success || !userId) {
        return {error: true, message: "There was an error updating your product"};
    }

    await updateProduct(data, {productId, userId});


    return {error: false, message: "Product updated successfully"};
}


export async function deleteOneProduct(productId: string, userId: string) {
    return await deleteProduct(productId, userId);
}

export async function getProductById(productId: string, userId: string) {
    return  await getOneProduct(productId, userId)
}


export async function updateCountryGroups(unsafeData: z.infer<typeof CountryGroupsDiscountSchema>, productId: string) {

    const {userId} = await auth();

    const {data, success} = CountryGroupsDiscountSchema.safeParse(unsafeData);

    if (!success || !userId) {
        return {error: true, message: " There was an error updating your product country groups "};
    }

    const insertedData: {
        countryGroupId: string;
        coupon: string;
        discountPercentage: number;
        productId: string;
    }[] = [];

    const deleteIds: {
        countryGroupId: string;
    }[] = [];


    for (const group of data.groups) {

        if ((group.discountPercentage != null && group.discountPercentage > 0) && (group.coupon != null && group.coupon.trim().length > 0)) {

            insertedData.push({
                countryGroupId: group.countryGroupId,
                coupon: group.coupon,
                discountPercentage: group.discountPercentage / 100,
                productId
            })
        } else {
            deleteIds.push({
                countryGroupId: group.countryGroupId
            })
        }
    }

    await updateCountryGroupsDiscountFromDB(insertedData, deleteIds, {productId, userId})

    return {error: false, message: "Country groups discount updated successfully"};

}


export async function updateProductCustomizationFromDB(productId: string, values: z.infer<typeof productCustomizationSchema>) {

    const {userId} = await auth();

    const {data, success} = productCustomizationSchema.safeParse(values);

    const canCustomize = await canCustomizeBanner(userId);

    if (!success || !userId || !canCustomize) {
        return {error: true, message: "There was an error updating your product customization"};
    }

    await updateProductCustomization(data, {productId});

    return {error: false, message: "Product customization updated successfully"};

}
