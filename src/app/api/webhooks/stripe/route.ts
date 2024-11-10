import {NextRequest} from "next/server";
import {Stripe} from "stripe";
import {env} from "@/data/env/server";
import {getTierByPriceId, subscriptionTiers} from "@/data/subscriptionTiers";
import {updateUsersSubscriptionTier} from "@/server/db/subscription";
import {eq} from "drizzle-orm";
import {UserSubscriptionTable} from "@/drizzle/schema";


const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {

    const event = stripe.webhooks.constructEvent(
        await request.text(),
        request.headers.get('stripe-signature') as string,
        env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {


        case "customer.subscription.created": {
            await handleCreate(event.data.object)
            break;

        }
        case "customer.subscription.updated" : {
            await handleUpdate(event.data.object)
            break
        }

        case "customer.subscription.deleted" : {
            await handleDelete(event.data.object)
            break;
        }
    }


    return new Response(null, {status: 200})

}

export async function handleCreate(subscription: Stripe.Subscription) {

    const tier = getTierByPriceId(subscription.items.data[0].price.id);
    const clerkUserId= subscription.metadata.clerkUserId

    if (!tier || !clerkUserId){
        throw new Response(null, {status: 500})
    }

    const customer = subscription.customer

    const customerId = typeof customer === "string" ? customer : customer.id;

    await updateUsersSubscriptionTier(eq(UserSubscriptionTable.clerkUserId, clerkUserId), {
        stripeCustomerId: customerId,
        tier: tier.name,
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionItemId: subscription.items.data[0].id
    })

}

export async function handleUpdate(subscription: Stripe.Subscription) {

    const tier = getTierByPriceId(subscription.items.data[0].price.id);

    if (!tier){
        throw new Response(null, {status: 500})
    }

    const customer = subscription.customer

    const customerId = typeof customer === "string" ? customer : customer.id;

    await updateUsersSubscriptionTier(eq(UserSubscriptionTable.stripeCustomerId, customerId), {
        tier: tier.name
    })
}

export async function handleDelete(subscription: Stripe.Subscription) {

    const customer = subscription.customer

    const customerId = typeof customer === "string" ? customer : customer.id;

    // console.log("i'm here haha")

    await updateUsersSubscriptionTier(eq(UserSubscriptionTable.stripeCustomerId, customerId), {
        tier: subscriptionTiers.Free.name,
        stripeSubscriptionId: null,
        stripeSubscriptionItemId: null,
    })
}