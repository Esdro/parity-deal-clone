import React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {formatCompactNumber} from "@/lib/formatter";
import {SignUpButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import Feature from "@/components/Feature";
import {getDictionary} from "../../get-dictionary";
import {twMerge} from "tailwind-merge";

export type PricingCardProps = {
    name: string,
    canAccessAnalytics: boolean,
    canCustomizeBanner: boolean,
    canRemoveBranding: boolean,
    priceInCents: number,
    maxNumberOfProducts: number,
    maxNumberOfVisits: number
}

type PricingCardPropsWithLang = PricingCardProps & {
    lang: "en" | "es" | "fr"
}

export async function PricingCards({
                                 name,
                                 canAccessAnalytics,
                                 canCustomizeBanner,
                                 canRemoveBranding,
                                 priceInCents,
                                 maxNumberOfProducts,
                                 maxNumberOfVisits,
                                 lang
                             }: PricingCardPropsWithLang) {
    const isMostPopular = name == "Standard";

    const dict = await getDictionary(lang);
    return (
        <Card>
            <CardHeader>
                <div className="text-accent mb-8 font-semibold"> {name} </div>
                <CardTitle className="text-xl font-bold">
                    {" "}
                    ${priceInCents / 100} /mo{" "}
                </CardTitle>
                <CardDescription>
          <span className="font-bold">
            {" "}
              {formatCompactNumber(maxNumberOfVisits)}{" "}
          </span>{" "}
                    {dict.pricingCard.perMonth}{" "}
                </CardDescription>
            </CardHeader>
            <CardContent>

                <SignUpButton>
                    <Button
                        className={twMerge("text-lg w-full rounded-lg", isMostPopular ? "rounded-md" : "")}
                        variant={isMostPopular ? "accent" : "default"}
                    >
                        {" "}
                        {dict.pricingCard.ctaButtonText}{" "}
                    </Button>
                </SignUpButton>

            </CardContent>
            <CardFooter className="flex flex-col gap-4 items-start ">
                <Feature classname="font-bold">
                    {maxNumberOfProducts}{" "}
                    {maxNumberOfProducts === 1 ? dict.pricingCard.oneProduct : dict.pricingCard.multipleProducts}
                </Feature>
                <Feature>{dict.pricingCard.pppDiscount}</Feature>
                {canAccessAnalytics && <Feature>  {dict.pricingCard.canAccessAnalytics} </Feature>}
                {canRemoveBranding && <Feature>  {dict.pricingCard.canRemoveBranding} </Feature>}
                {canCustomizeBanner && <Feature>  {dict.pricingCard.canCustomizeBanner} </Feature>}
            </CardFooter>
        </Card>
    );
}
