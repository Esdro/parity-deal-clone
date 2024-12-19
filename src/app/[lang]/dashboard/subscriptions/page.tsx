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

async function SubscriptionPage() {

    const {userId, redirectToSignIn} = await auth();

    if (!userId) return redirectToSignIn();

    const tier = await getUserSubscriptionTier(userId);
    const productCount = await countAllUserProducts(userId);

    const pricingViewCount = await getProductViewCount(userId, startOfMonth(new Date()));

    return (
        <>
            <h1 className='mb-6 text-3xl font-semibold '> Your subscription </h1>

            <div className='flex flex-col gap-8 mb-8 '>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 '>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'> Monthly Usage </CardTitle>
                            <CardDescription>
                                {formatCompactNumber(pricingViewCount)} / {" "}
                                {formatCompactNumber(tier.maxNumberOfVisits)} pricing page visits this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={(pricingViewCount / tier.maxNumberOfVisits) * 100}
                                      max={tier.maxNumberOfVisits}/>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'> Number of Products </CardTitle>
                            <CardDescription>
                                {formatCompactNumber(productCount)} / {" "}
                                {formatCompactNumber(tier.maxNumberOfProducts)} products created
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
                            <CardTitle> You are currently on the {tier.name} Plan </CardTitle>
                            <CardDescription>
                                If you would like to upgrade, cancel, or change your payment method, you can do so here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>


                            <form
                                action={createCustomerPortalSession}
                            >
                                <Button variant="accent" className='text-lg rounded-lg ' size="lg"> Manage
                                    Subscription </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
                {subscriptionTiersInOrder.map((t) => (
                    <PricingCard key={t.name} currentTierName={tier.name} {...t} />
                ))}
            </div>
        </>
    );
}



type InternalPricingCardProps = PricingCardProps & {
    currentTierName: TierNames;
}

function PricingCard({name, canAccessAnalytics,currentTierName, canCustomizeBanner, canRemoveBranding, priceInCents, maxNumberOfProducts, maxNumberOfVisits,
                     }: InternalPricingCardProps) {
    const isCurrent = currentTierName == name;
    const isFree = "Free" == name;
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
               <form
                   action={ name == "Free" ? createCancelSubscription :  createStripeCheckoutSession.bind(null, subscriptionTiers[name].name)}
               >
                   <Button
                          disabled={isCurrent}
                          className="text-lg w-full rounded-lg"
                          size="lg"
                   >
                          {isCurrent ? "Current Plan" : isFree ? "Downgrade plan " : "Upgrade plan"}
                   </Button>
               </form>
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


export default SubscriptionPage;