import { subscriptionTiers } from "@/data/subscriptionTiers"
import { db } from "@/drizzle/db"
import { UserSubscriptionTable } from "@/drizzle/schema"
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from "@/lib/cache"
import {eq} from "drizzle-orm"

export async function createUserSubscription(
    data: typeof UserSubscriptionTable.$inferInsert
) {
    const [newSubscription] = await db
        .insert(UserSubscriptionTable)
        .values(data)
        .onConflictDoNothing({
            target: UserSubscriptionTable.clerkUserId,
        })
        .returning({
            id: UserSubscriptionTable.id,
            userId: UserSubscriptionTable.clerkUserId,
        })

    if (newSubscription != null) {
        revalidateDbCache({
            tag: CACHE_TAGS.subscription,
            id: newSubscription.id,
            userId: newSubscription.userId,
        })
    }

    return newSubscription
}

export async function getUserSubscription(userId: string) {
    const cacheFn = dbCache(getUserSubscriptionInternal, {
        tags: [getUserTag(CACHE_TAGS.subscription, userId)],
    })

    return cacheFn(userId)
}

export async function getUserSubscriptionInternal(userId: string) {
    return db.query.UserSubscriptionTable.findFirst({
        where: ({clerkUserId}) => eq(clerkUserId, userId),
    })
}

export async function getUserSubscriptionTier(userId: string) {
    const subscription = await getUserSubscription(userId)

    if (subscription == null) {
       throw new Error("User does not have a subscription")
    }

    return subscriptionTiers[subscription.tier]
}