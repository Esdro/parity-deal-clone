"use client";
import React, {useTransition} from 'react';
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {deleteOneProduct} from "@/server/actions/product";
import {useToast} from "@/hooks/use-toast";

function DeleteProductDialogContent({productId, userId}: {
    productId: string | undefined,
    userId: string | undefined
}) {

    const [isDeleting, startDeleteTransition] = useTransition();

    const {toast} = useToast();

    function handleDeletion() {
        startDeleteTransition(async () => {
            // delete product
            const data = await deleteOneProduct(productId as string, userId as string);
            toast({
                title: data.error ? "Error" : "Success",
                description: data.message,
                variant: data.error ? "destructive" : "default",
            })
        })
    }

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className='text-lg text-center'>Delete product </AlertDialogTitle>
                <AlertDialogDescription> This action cannot be undone! You will permanently delete this
                    product. </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel> Cancel </AlertDialogCancel>
                <AlertDialogAction
                    className='bg-destructive'
                    onClick={handleDeletion}
                    disabled={isDeleting}> Delete </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

export default DeleteProductDialogContent;