import React, {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {CheckIcon} from "lucide-react";

export default function Feature({
                     children,
                     classname,
                 }: {
    children: ReactNode;
    classname?: string;
}) {
    return (
        <div className={cn("flex items-center gap-2", classname)}>
            <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
            <span> {children} </span>
        </div>
    );
}