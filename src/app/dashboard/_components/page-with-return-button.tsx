import React, {ReactNode} from 'react';
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {CaretLeftIcon} from "@radix-ui/react-icons";

type PageWithReturnButtonProps = {
    children: ReactNode;
    pageTitle: string;
    returnButtonHref: string;

};


export default function PageWithReturnButton({children,pageTitle, returnButtonHref}: PageWithReturnButtonProps) {

    return (
        <div className={'grid grid-cols-[auto,1fr] gap-x-4 gap-y-8'}>
            <Button size="icon" variant="outline" className="rounded-full" asChild>
                <Link href={returnButtonHref}>
                    <div className="sr-only">Back</div>
                    <CaretLeftIcon className="size-8"/>
                </Link>
            </Button>
            <h1 className="text-2xl font-semibold self-center">{pageTitle}</h1>
            <div className="col-start-2">{children}</div>
        </div>
    )

}