"use server";
import {z} from "zod";
import {ProductFormSchema} from "@/schemas/products";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {addProduct, deleteProduct, getOneProduct} from "@/server/db/products";


export async function createProduct(values: z.infer<typeof ProductFormSchema>): Promise<{
    error: boolean;
    message: string
} | undefined> {
    const {data, success} = ProductFormSchema.safeParse(values);
    // @ts-expect-error
    const {userId} = await auth();

    if (!success || !userId) {
        return {error: true, message: "There was an error creating your product"};
    }

    const {id} = await addProduct({...data, clerkUserId: userId});

     return {error: false, message: " Product created successfully. "};

     // redirect(`/dashboard/products/${id}/edit?tab=countries`)



}

export async function deleteOneProduct(productId: string, userId: string) {
    return await deleteProduct(productId, userId);
}

export async function getProductById(productId: string) {
    return (await getOneProduct(productId));
}