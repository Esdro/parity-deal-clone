import { subscriptionTiers } from "@/data/subscriptionTiers"
import { db } from "@/drizzle/db"
import { UserSubscriptionTable } from "@/drizzle/schema"
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from "@/lib/cache"
import { SQL } from "drizzle-orm"

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