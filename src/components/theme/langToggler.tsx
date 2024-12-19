"use client"

import * as React from "react"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useLangContext} from "@/components/theme/langContext";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {useEffect} from "react";

export function LangToggle() {
    const {lang, toggleLang} = useLangContext();
    const pathName = usePathname();

    useEffect(() => {
        if (pathName.startsWith("/en")) {
            toggleLang("en");
        } else if (pathName.startsWith("/es")) {
            toggleLang("es");
        } else {
            toggleLang("fr");
        }
    }, [pathName,toggleLang]);

    const router = useRouter();

    let lang2: "fr" | "en" | "es"  = lang;
    let lang3 : "fr" | "en" | "es"  = lang;
    if (lang === "en") {
        lang2 = "es";
        lang3 = "fr";
    } else if (lang === "es") {
        lang2 = "fr";
        lang3 = "en";
    } else {
        lang2 = "en";
        lang3 = "es";
    }
  const handleLangChange = (lang: "fr" | "en" | "es") => {

        toggleLang(lang);

    router.replace(`/${lang}/${pathName.slice(4)}`, {
        scroll: true
    });

    };



    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className='flex justify-center items-center w-[50px] gap-2'>
                    <Image
                        key={lang}
                        width={22}
                        height={14}
                        alt={`Drapeau de ${lang}`}
                        title={`Drapeau de ${lang}`}
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${lang === "en" ? "US" : lang.toUpperCase()}.svg`}
                        className="border"/>
                    <span className="sr-only">Change Language</span>
                    {lang === "fr" &&(<span> Fr </span>) }
                    {lang === "en" &&(<span> En </span>) }
                    {lang === "es" &&(<span> Es </span>) }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer flex justify-center items-center w-[50px] hover:bg-accent/5" onClick={() => handleLangChange(lang2)}>
                    <Image
                        key={lang}
                        width={22}
                        height={14}
                        alt={`Drapeau de ${lang2}`}
                        title={`Drapeau de ${lang2}`}
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${lang2 === "en" ? "US" : lang2.toUpperCase()}.svg`}
                        className="border"
                    />
                    <span> {lang2} </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex justify-center items-center w-[50px] hover:bg-accent/5" onClick={() => handleLangChange(lang3)}>
                    <Image
                        key={lang3}
                        width={22}
                        height={14}
                        alt={`Drapeau de ${lang3}`}
                        title={`Drapeau de ${lang3}`}
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${lang3 === "en" ? "US" : lang3.toUpperCase()}.svg`}
                        className="border"
                    />
                    <span> {lang3} </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
