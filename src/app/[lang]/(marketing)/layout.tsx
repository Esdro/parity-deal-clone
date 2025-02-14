import React, {ReactNode} from "react";
import NavBar from "./_components/NavBar";
import {Locale} from "../../../../i18n-config";

type Props = {
    children: ReactNode;
    params: Promise<{
        lang: Locale;
    }>;
};

async function MarketingLayout({children, params}: Props) {

    const {lang} = await params;

    if (!lang || lang !== "en" && lang !== "es" && lang !== "fr") {
        return <div className="flex w-full flex-col gap-8 h-screen items-center justify-center text-4xl ">
            <h1 className="font-bold">400 - Bad Request </h1>
            <p> Language  <b className=" font-extrabold"> {lang} </b> not  supported on this site</p>
        </div>;
    }


    return <div className="selection:bg-[hsl(320,65%,52%,20%)]">
        <NavBar lang={lang}/>
        {children}
    </div>;
}

export default MarketingLayout;
