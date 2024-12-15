import {db} from "@/drizzle/db";
import {CountryGroupTable, CountryTable, ProductTable, ProductViewTable} from "@/drizzle/schema";
import {and, count, desc, eq, gte, sql} from "drizzle-orm";
import {CACHE_TAGS, dbCache, getGlobalTag, getIdTag, getUserTag, revalidateDbCache} from "@/lib/cache";
import {startOfDay} from "date-fns";
import {CHART_INTERVALS} from "@/lib/constants";
import {tz} from "@date-fns/tz";

export async function getProductViewCount(userId: string, startDate: Date) {

    const cacheFn = dbCache(getProductViewCountInternal, {
        tags: [
            getUserTag(CACHE_TAGS.productViews, userId)
        ],
    })

    return cacheFn(userId, startDate);

}

export async function getViewsByDayChartData({timezone, productId, userId, interval}: CountryChartDataProps) {

    const cacheFn = dbCache(getViewsByDayChartDataInternal, {
        tags: [
            getUserTag(CACHE_TAGS.productViews, userId),
            !productId ? getUserTag(CACHE_TAGS.products, userId) : getIdTag(CACHE_TAGS.products, productId),
        ],
    })

    return cacheFn({timezone, productId, userId, interval});

}

export async function getViewsByCountryChartData({timezone, productId, userId, interval}: CountryChartDataProps) {

    const cacheFn = dbCache(getViewsByCountryChartDataInternal, {
        tags: [
            getUserTag(CACHE_TAGS.productViews, userId),
            !productId ? getUserTag(CACHE_TAGS.products, userId) : getIdTag(CACHE_TAGS.products, productId),
            getGlobalTag(CACHE_TAGS.countries)
        ],
    })

    return cacheFn({timezone, productId, userId, interval});

}

export async function getViewsByPPPChartData({timezone, productId, userId, interval}: CountryChartDataProps) {

    const cacheFn = dbCache(getViewsByPPPChartDataInternal, {
        tags: [
            getUserTag(CACHE_TAGS.productViews, userId),
            !productId ? getUserTag(CACHE_TAGS.products, userId) : getIdTag(CACHE_TAGS.products, productId),
            getGlobalTag(CACHE_TAGS.countryGroups)
        ],
    })

    return cacheFn({timezone, productId, userId, interval});

}

/**
 * Get the number of product views for a user
 * @param userId
 * @param startDate
 */
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

    if (newRow != null) {

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

async function getViewsByDayChartDataInternal({timezone, productId, userId, interval,}: CountryChartDataProps) {
    const productsSq = getProductSubQuery(productId, userId)
    const productViewSq = db.$with("productViews").as(
        db
            .with(productsSq)
            .select({
                visitedAt: sql`${ProductViewTable.visitedAt}
                AT TIME ZONE
                ${timezone}`
                    .inlineParams()
                    .as("visitedAt"),
                productId: productsSq.id,
            })
            .from(ProductViewTable)
            .innerJoin(productsSq, eq(productsSq.id, ProductViewTable.productId))
    )

    return await db
        .with(productViewSq)
        .select({
            date: interval
                .dateGrouper(sql.raw("series"))
                .mapWith(dateString => interval.dateFormatter(new Date(dateString))),
            views: count(productViewSq.visitedAt),
        })
        .from(interval.sql)
        .leftJoin(productViewSq, ({date}) =>
            eq(interval.dateGrouper(productViewSq.visitedAt), date)
        )
        .groupBy(({date}) => [date])
        .orderBy(({date}) => date)
}


/**
 * Get the number of product views to construct a chart
 * @param timezone timezone of the user
 * @param productId id of the product
 * @param userId id of the user
 * @param interval interval to get the data for
 */
export async function getViewsByCountryChartDataInternal({
                                                             timezone,
                                                             productId,
                                                             userId,
                                                             interval
                                                         }: CountryChartDataProps) {

    const startDate = startOfDay(interval.startDate, {in: tz(timezone)});

    const productsSq = getProductSubQuery(productId, userId);
    return db.with(productsSq).select({
        views: count(ProductViewTable.visitedAt),
        countryName: CountryTable.name,
        countryCode: CountryTable.code
    }).from(ProductViewTable).innerJoin(
        productsSq, eq(productsSq.id, ProductViewTable.productId)
    ).innerJoin(
        CountryTable, eq(CountryTable.id, ProductViewTable.countryId)
    ).where(
        gte(
            sql`${ProductViewTable.visitedAt}
            AT TIME ZONE
            ${timezone}`.inlineParams(),
            startDate
        )
    ).groupBy(
        ({countryName, countryCode}) => [countryCode, countryName]
    ).orderBy(
        ({views}) => desc(views)
    ).limit(25)


}

export async function getViewsByPPPChartDataInternal({timezone, productId, userId, interval}: CountryChartDataProps) {

    const startDate = startOfDay(interval.startDate, {in: tz(timezone)});

    const productsSq = getProductSubQuery(productId, userId);
    const productViewsSq = db.$with("productViews").as(
        db.with(productsSq).select({
            visitedAt: sql`${ProductViewTable.visitedAt}
            AT TIME ZONE
            ${timezone}`.inlineParams().as("visitedAt"),
            countryGroupId: CountryTable.countryGroupId
        }).from(ProductViewTable).innerJoin(
            productsSq, eq(productsSq.id, ProductViewTable.productId)
        ).innerJoin(
            CountryTable, eq(CountryTable.id, ProductViewTable.countryId)
        ).where(({visitedAt}) => gte(visitedAt, startDate)))

    return db.with(productViewsSq).select({
        views: count(productViewsSq.visitedAt),
        pppName: CountryGroupTable.name
    }).from(
        CountryGroupTable
    ).leftJoin(
        productViewsSq,
        eq(productViewsSq.countryGroupId, CountryGroupTable.id)
    ).groupBy(
        ({pppName}) => [pppName]
    ).orderBy(
        ({pppName}) => pppName
    )

}


function getProductSubQuery(productId: string | undefined, userId: string) {
    return db.$with("products").as(
        db.select().from(ProductTable).where(and(eq(ProductTable.clerkUserId, userId), !productId ? undefined : eq(ProductTable.id, productId)))
    )
}

type CountryChartDataProps = {
    timezone: string,
    productId?: string,
    userId: string,
    interval: (typeof CHART_INTERVALS)[keyof typeof CHART_INTERVALS]
}