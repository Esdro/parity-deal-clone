import React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {formatCompactNumber} from "@/lib/formatter";
import {SignUpButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import Feature from "@/components/Feature";

export type PricingCardProps = {
    name: string,
    canAccessAnalytics: boolean,
    canCustomizeBanner: boolean,
    canRemoveBranding: boolean,
    priceInCents: number,
    maxNumberOfProducts: number,
    maxNumberOfVisits: number,
}

export function PricingCards({
                                 name,
                                 canAccessAnalytics,
                                 canCustomizeBanner,
                                 canRemoveBranding,
                                 priceInCents,
                                 maxNumberOfProducts,
                                 maxNumberOfVisits,
                             }: PricingCardProps) {
    const isMostPopular = name == "Standard";
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
                    pricing page visits/month
                </CardDescription>
            </CardHeader>
            <CardContent>

                <SignUpButton>
                    <Button
                        className="text-lg w-full rounded-lg"
                        variant={isMostPopular ? "accent" : "default"}
                    >
                        {" "}
                        Get started{" "}
                    </Button>
                </SignUpButton>

            </CardContent>
            <CardFooter className="flex flex-col gap-4 items-start ">
                <Feature classname="font-bold">
                    {maxNumberOfProducts}{" "}
                    {maxNumberOfProducts === 1 ? "product" : "products"}
                </Feature>
                <Feature>PPP Discounts</Feature>
                {canAccessAnalytics && <Feature> Advanced Analytics </Feature>}
                {canRemoveBranding && <Feature> Remove Custom PPP branding </Feature>}
                {canCustomizeBanner && <Feature> Banner Customization </Feature>}
            </CardFooter>
        </Card>
    );
}
