import {db} from "@/drizzle/db";
import {ProductTable, ProductViewTable} from "@/drizzle/schema";
import {and, count, eq, gte} from "drizzle-orm";
import {CACHE_TAGS, dbCache, getUserTag} from "@/lib/cache";

export async function getProductViewCount(userId: string, startDate: Date) {

    const cacheFn = dbCache(getProductViewCountInternal, {
        tags: [
            getUserTag(CACHE_TAGS.productViews, userId)
        ],
    })

    return cacheFn(userId, startDate);

}

export async function getProductViewCountInternal(userId: string, startDate: Date) {

    const counts = await db.select(
        {pricingViewCount: count()}
    ).from(ProductViewTable).innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId)).where(
        and(
            eq(ProductTable.clerkUserId, userId),
            gte(ProductViewTable.visitedAt, startDate)
        )
    )

    return counts[0].pricingViewCount ?? 0;
}