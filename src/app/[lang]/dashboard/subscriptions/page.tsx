import React from 'react';
import {auth} from "@clerk/nextjs/server";
import {getUserSubscriptionTier} from "@/server/db/subscription";
import {countAllUserProducts} from "@/server/db/products";
import {startOfMonth} from "date-fns";
import {getProductViewCount} from "@/server/db/productViews";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {formatCompactNumber} from "@/lib/formatter";
import {Progress} from "@/components/ui/progress";
import {subscriptionTiers, subscriptionTiersInOrder, TierNames} from "@/data/subscriptionTiers";
import {Button} from "@/components/ui/button";
import {PricingCardProps} from "@/components/PricingCards";
import Feature from "@/components/Feature";
import {
    createCancelSubscription,
    createCustomerPortalSession,
    createStripeCheckoutSession
} from "@/server/actions/stripe";
import {formatDictionnaryText, getDictionary} from "../../../../../get-dictionary";
import {Locale} from "../../../../../i18n-config";

async function SubscriptionPage({params}) {
     const {lang} = await params;
    const {userId, redirectToSignIn} = await auth();

    const dict = await getDictionary(lang);

    if (!userId) return redirectToSignIn();

    const tier = await getUserSubscriptionTier(userId);
    const productCount = await countAllUserProducts(userId);

    const pricingViewCount = await getProductViewCount(userId, startOfMonth(new Date()));

    return (
        <>
            <h1 className='mb-2 text-3xl font-semibold '> {dict.dashboard.subscriptionPage.title} </h1>

            <div className='flex flex-col gap-8 mb-8 '>
                <div className='grid grid-cols-1  md:grid-cols-2 gap-8 '>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'> {dict.dashboard.subscriptionPage.monthly} </CardTitle>
                            <CardDescription>
                                {formatCompactNumber(pricingViewCount)} / {" "}
                                {formatCompactNumber(tier.maxNumberOfVisits)} {dict.dashboard.subscriptionPage.pageVisitThisMonth}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={(pricingViewCount / tier.maxNumberOfVisits) * 100}
                                      max={tier.maxNumberOfVisits}/>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'> {dict.dashboard.subscriptionPage.numberOfProducts} </CardTitle>
                            <CardDescription>
                                {formatCompactNumber(productCount)} / {" "}
                                {formatCompactNumber(tier.maxNumberOfProducts)} {productCount < 2 ?  dict.dashboard.subscriptionPage.productCreated : dict.dashboard.subscriptionPage.productsCreated}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={(productCount / tier.maxNumberOfProducts) * 100}
                                      max={tier.maxNumberOfProducts}/>
                        </CardContent>
                    </Card>
                </div>

                {tier != subscriptionTiers.Free && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{formatDictionnaryText(tier.name, dict.dashboard.subscriptionPage.currentPlan)} </CardTitle>
                            <CardDescription className='mb-6 text-muted-foreground'>
                                {dict.dashboard.subscriptionPage.subtitle}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>


                        <form
                                action={createCustomerPortalSession}
                            >
                                <Button variant="accent" className='text-lg rounded-lg ' size="lg"> {dict.pricingCard.manageSubscription} </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
                {subscriptionTiersInOrder.map((t) => (
                    <PricingCard lang={lang} key={t.name} currentTierName={tier.name} {...t} />
                ))}
            </div>
        </>
    );
}



type InternalPricingCardProps = PricingCardProps & {
    currentTierName: TierNames;
    lang: Locale;
}

async function PricingCard({name, canAccessAnalytics,currentTierName, lang, canCustomizeBanner, canRemoveBranding, priceInCents, maxNumberOfProducts, maxNumberOfVisits,
                     }: InternalPricingCardProps) {
    const isCurrent = currentTierName == name;
    const isFree = "Free" == name;

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
               <form
                   action={ name == "Free" ? createCancelSubscription :  createStripeCheckoutSession.bind(null, subscriptionTiers[name].name)}
               >
                   <Button
                          disabled={isCurrent}
                          className="text-lg w-full rounded-lg"
                          size="lg"
                   >
                          {isCurrent ? dict.pricingCard.currentPlan : isFree ? dict.pricingCard.downgrade : dict.pricingCard.upgrade}
                   </Button>
               </form>
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


export default SubscriptionPage;