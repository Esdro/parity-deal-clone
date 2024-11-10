"use server";

import {PaidTierNames, subscriptionTiers} from "@/data/subscriptionTiers";
import {auth, currentUser, User} from "@clerk/nextjs/server";
import {getUserSubscription} from "@/server/db/subscription";
import {Stripe} from "stripe";
import {env as ServerEnv} from "@/data/env/server";
import {env as ClientEnv} from "@/data/env/client";
import {redirect} from "next/navigation";

const stripe = new Stripe(ServerEnv.STRIPE_SECRET_KEY)

export async function createStripeCheckoutSession(tier: PaidTierNames) {

    const user = await currentUser();

    if (!user) {
        return;
    }

    const subscription = await getUserSubscription(user.id);

    if (!subscription) {
        return;
    }

    if (subscription.stripeCustomerId == null) {
        const url = await getCheckoutSessionUrl(tier, user);

        if (!url) {
            return;
        }
        redirect(url);
    } else {

        const url = await getSubscriptionUpgradeSessionUrl(tier, subscription);

        if (!url) {
            return;
        }

        redirect(url);


    }

}


export async function createCancelSubscription() {

    const user = await currentUser();

    if (!user) {
        return;
    }
    const subscription = await getUserSubscription(user.id);

    if (!subscription) {
        return;
    }

    if (subscription.stripeSubscriptionId == null || subscription.stripeCustomerId == null) {
        return;
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
        flow_data: {
            type: "subscription_cancel",
            subscription_cancel: {
                subscription: subscription.stripeSubscriptionId,
            }
        }
    })

     redirect(portalSession.url);


}


export async function createCustomerPortalSession() {

    const {userId} = await auth();

    if (!userId) {
        return;
    }

    const subscription = await getUserSubscription(userId);


    if (!subscription) {
        return;
    }

    if (subscription.stripeCustomerId == null) {
        console.log("User does not have a stripe customer id")
        return;
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`
    })

    redirect(portalSession.url);


}


export async function getSubscriptionUpgradeSessionUrl(tier: PaidTierNames, subscription: {
    stripeSubscriptionId: string | null,
    stripeCustomerId: string | null,
    stripeSubscriptionItemId: string | null
}) {

    if (subscription.stripeCustomerId == null || subscription.stripeSubscriptionId == null || subscription.stripeSubscriptionItemId == null) {
        return null;
    }


    const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
        flow_data: {
            type: "subscription_update_confirm",
            subscription_update_confirm: {
                subscription: subscription.stripeSubscriptionId,
                items: [
                    {
                        id: subscription.stripeSubscriptionItemId,
                        price: subscriptionTiers[tier].stripePriceId,
                        quantity: 1
                    }
                ]
            }
        }
    })

    redirect(portalSession.url);

}


/**
 * Create a checkout session for the user and return the url
 * @param tier - the tier to subscribe to
 * @param user - the user who subscribes
 */
async function getCheckoutSessionUrl(tier: PaidTierNames, user: User): Promise<string | null> {

    /* const customerDetails = {
     }*/

    const session = await stripe.checkout.sessions.create({
        customer_email: user.primaryEmailAddress?.emailAddress,
        subscription_data: {
            metadata: {
                clerkUserId: user.id
            }
        },
        line_items: [
            {
                price: subscriptionTiers[tier].stripePriceId,
                quantity: 1
            }
        ],
        mode: "subscription",
        success_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
        cancel_url: `${ClientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
    })

    return session.url;

}


