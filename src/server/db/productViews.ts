import {db} from "@/drizzle/db";
import {ProductTable, ProductViewTable} from "@/drizzle/schema";
import {and, count, eq, gte} from "drizzle-orm";
import {CACHE_TAGS, dbCache, getUserTag, revalidateDbCache} from "@/lib/cache";

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

export async function createProductView({productId, countryId, userId}: {
    productId: string,
    countryId?: string,
    userId: string
}) {

   const [newRow] = await db.insert(ProductViewTable).values({
        productId,
        countryId,
        visitedAt: new Date(),
    }).returning({
       id: ProductViewTable.id
   })

    if (newRow != null ){

        revalidateDbCache({
            tag: CACHE_TAGS.productViews,
            userId,
            id: newRow.id
        })
    }

}
/*

export async function countProductViews(userId: string, startDate: Date) {

    const cacheFn = dbCache(countProductViewsInternal, {
        tags: [
            getUserTag(CACHE_TAGS.productViews, userId)
        ],
    })

    return cacheFn(userId, startDate);

}

export async function countProductViewsInternal(userId: string, startDate: Date) {

    const counts = await db.select(
        {productViewsCount: count()}
    ).from(ProductViewTable).innerJoin(ProductTable, eq(ProductTable.id, ProductViewTable.productId)).where(
        and(
            eq(ProductTable.clerkUserId, userId),
            gte(ProductViewTable.visitedAt, startDate)
        )
    )

    return counts[0].productViewsCount ?? 0;
}*/
