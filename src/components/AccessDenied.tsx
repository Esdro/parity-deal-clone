"use client";
import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {DictionaryType} from "../../i18n-config";
import {env} from "@/data/env/client";


export type AccessNotPermittedProps = {
    fallbackMessage: string;
}

export  function AccessDenied({fallbackMessage}: AccessNotPermittedProps) {

    const lang = usePathname().split("/")[1] as "en" | "es" | "fr";
    const [dict, setDict] = useState<Partial<DictionaryType>>({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/intl`, {
                headers: {"lang": lang}
            });
            const dict = await response.json();
            setDict(dict);
        }
        fetchData();
    }, [lang]);

    if (!dict || !dict.dashboard?.accessDenied) {
        return null;
    }

    return (
        <Card  className='my-4 bg-destructive text-destructive-foreground '>
            <CardHeader>
            <CardTitle className='font-bold'> {dict.dashboard.accessDenied.title} </CardTitle>
            </CardHeader>
            <CardContent>
                {fallbackMessage}
            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link href={`/${lang}/dashboard/subscriptions`}>{dict.dashboard.accessDenied.ctaButtonText}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}