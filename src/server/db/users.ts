import {db} from "@/drizzle/db";
import {ProductCustomizationTable, ProductTable, UserSubscriptionTable} from "@/drizzle/schema";
import {eq} from "drizzle-orm";
import {CACHE_TAGS, revalidateDbCache} from "@/lib/cache";

export async function deleteUser(userId: string) {

    const [products, subscriptions] =  await db.batch([
        db.delete(ProductTable).where(eq(ProductTable.clerkUserId, userId)).returning({id: ProductTable.id}),
        db.delete(UserSubscriptionTable).where(eq(UserSubscriptionTable.clerkUserId, userId)).returning({id: UserSubscriptionTable.id})
    ])

    products.forEach((prod: {id: string}) => {

        db.delete(ProductCustomizationTable).where(eq(ProductCustomizationTable.productId, prod.id))

        revalidateDbCache({
            tag: CACHE_TAGS.products,
            id: prod.id,
        })
    })

    subscriptions.forEach((sub: {id: string}) => {
        revalidateDbCache({
            tag: CACHE_TAGS.subscription,
            id: sub.id,
        })
    })



}