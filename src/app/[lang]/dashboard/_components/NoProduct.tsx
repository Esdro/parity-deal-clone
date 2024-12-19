"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useLangContext} from "@/components/theme/langContext";
import {env} from "@/data/env/client";
import {DictionaryType} from "../../../../../i18n-config";

function NoProduct() {
    const {lang} = useLangContext();
    const [dict, setDict] = useState<Partial<DictionaryType>>({});
    useEffect( () => {
        const fetchData = async () => {
            const response =  await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/intl`, {
                headers: {"lang": lang}
            });
            const dict = await response.json();
            setDict(dict);
        }
        fetchData();
    }, [lang]);

    if (!dict || !dict.dashboard?.noProducts) {
        return null;
    }
  return (
    <div className="mt-32 text-center text-balance">
      <h1 className="text-4xl font-semibold mb-2">{dict.dashboard.noProducts.title}</h1>
      <p className="mb-4">
          {dict.dashboard.noProducts.subtitle}
      </p>
      <Button size="lg" asChild>
        <Link href={`/${lang}/dashboard/products/new`}>{dict.dashboard.noProducts.ctaButtonText}</Link>
      </Button>
    </div>
  );
}

export default NoProduct;
