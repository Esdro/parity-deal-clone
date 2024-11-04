"use client";
import React, {useState} from 'react';
import {DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {env} from "@/data/env/client";
import {Button} from "@/components/ui/button";
import {CopyCheckIcon, CopyXIcon, CopyIcon} from "lucide-react";

type CopyState = "idle" | "error" | "copied";

function AddProductToSiteDialogContent({productId}: { productId: string | undefined }) {

    const [copyState, setCopyState] = useState<CopyState>("idle");

    const code = ` <script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}/banner"></script>`;

    const Icon = getIcon(copyState);
    const children = getChildren(copyState);

    function handleCopy() {
        navigator.clipboard.writeText(code).then(
            () => {
                setCopyState("copied");
                setTimeout(() => setCopyState("idle"), 2000);
            }).catch(() => {
            setCopyState("error");
            setTimeout(() => setCopyState("idle"), 2000);
        })

    }

    function getIcon(copyState: CopyState) {
        switch (copyState) {
            case "copied":
                return CopyCheckIcon;
            case "error":
                return CopyXIcon;
            default:
                return CopyIcon;
        }
    }

    function getChildren(copyState: CopyState) {
        switch (copyState) {
            case "copied":
                return "Copied successfully";
            case "error":
                return "Error while copying";
            default:
                return " Copy the script ";
        }
    }

    return (
        <DialogContent className='max-w-max'>
            <DialogHeader>
                <DialogTitle className='text-xl font-bold'>Add Product to Site</DialogTitle>
                <DialogDescription className='text-gray-500'>Choose a site to add this product
                    to</DialogDescription>
            </DialogHeader>
            <pre className='bg-secondary mb-4 text-secondary-foreground rounded max-w-screen-lg p-4 overflow-x-auto'>
                <code>
                    {code}
                </code>
            </pre>
            <div className='flex gap-2 mt-4'>
                <Button onClick={handleCopy} variant={'default'}>
                    {<Icon className='size-6 mr-2'/>}
                    {children}
                </Button>
                <DialogClose asChild>
                    <Button variant='outline'>Close</Button>
                </DialogClose>
            </div>
        </DialogContent>
    );
}

export default AddProductToSiteDialogContent;