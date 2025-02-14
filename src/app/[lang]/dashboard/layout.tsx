import React, {ReactNode} from "react";
import DashboardNavBar from "./_components/NavBar";
import {Locale} from "../../../../i18n-config";

type DashboardLayoutProps = {
    children: ReactNode;
    params: Promise<{
        lang: Locale;
    }
    >
};

async function DashboardLayout({children, params}: DashboardLayoutProps) {

    const {lang} = await params;

    if (!lang || lang !== "en" && lang !== "es" && lang !== "fr") {
        return <div className="flex w-full flex-col gap-8 h-screen items-center justify-center text-4xl ">
            <h1 className="font-bold">400 - Bad Request </h1>
            <p> Language <b className=" font-extrabold"> {lang} </b> not supported on this site</p>
        </div>;
    }


    return (
        <div className="bg-accent/5 min-h-screen">
            <DashboardNavBar lang={lang}/>
            <div className="container py-6">{children}</div>
        </div>
    );
}

export default DashboardLayout;
