"use client"

import {Button} from "@/components/ui/button"
import {
    Sheet,
    SheetContent, SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {ReactNode} from "react"
import {useMediaQuery} from "usehooks-ts";

type ResponsiveNavProps = {
    side: "left" | "right";
    children: ReactNode;
}


function ResponsiveNav({side, children}: ResponsiveNavProps) {

    const matches = useMediaQuery('(min-width: 768px)')

    if (matches) return (
        <>{children}</>
    )

    return (
        <Sheet key={side}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    Open Nav
                </Button>
            </SheetTrigger>
            <SheetContent side={side}>
                    <SheetTitle> Menu on mobile  </SheetTitle>
                <div className="flex flex-col gap-4 p-4">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    )
}


export default ResponsiveNav;
