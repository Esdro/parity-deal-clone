import {CountryGroupDiscountTable, ProductCustomizationTable, ProductTable} from "@/drizzle/schema";
import {db} from "@/drizzle/db";
import {and, count, eq, inArray, sql} from "drizzle-orm";
import {CACHE_TAGS, dbCache, getGlobalTag, getIdTag, getUserTag, revalidateDbCache} from "@/lib/cache";
import {notFound} from "next/navigation";
import {BatchItem} from "drizzle-orm/batch";
import {removeTrailingSlash} from "@/lib/utils";


export async function addProduct(data: typeof ProductTable.$inferInsert) {

    const [newProduct] = await db.insert(ProductTable).values(data).returning({
        id: ProductTable.id,
        clerkUserId: ProductTable.clerkUserId
    })
    try {
        await db.insert(ProductCustomizationTable).values({
            productId: newProduct.id,
        }).onConflictDoNothing({
            target: ProductCustomizationTable.productId
        })
    } catch (e ) {
        await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id))
    }

    revalidateDbCache({
        tag: CACHE_TAGS.products,
        userId: newProduct.clerkUserId,
        id: newProduct.id
    });
    return newProduct
}

export async function deleteProduct(productId: string, userId: string) {

    const {rowCount} = await db.delete(ProductTable).where(and(eq(ProductTable.id, productId), eq(ProductTable.clerkUserId, userId)))

    if (rowCount > 0) {
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            userId,
            id: productId
        })
        return {
            error: false,
            message: "Product deleted successfully"
        }
    } else {
        return {
            error: true,
            message: "Product not found or you do not have permission to delete it"
        }
    }

}


/**
 * Get a single product by its id
 * @param productId -- the product id
 * @param userId -- the user id of the product owner
 */
export async function getOneProduct(productId: string, userId: string) {

    // clearFullCache();

    const cacheFn = dbCache(getOneProductInternal, {
        tags: [getIdTag(CACHE_TAGS.products, productId)]
    })
    return cacheFn({userId, productId})

}

export async function countAllUserProducts(userId: string) {

    const cacheFn = dbCache(countAllUserProductsInternal, {
        tags: [getUserTag(CACHE_TAGS.products, userId)]
    })
    return cacheFn(userId)

}


export async function getAllProductsFromUser(userId: string, {limit}: { limit?: number }) {
    const cacheFn = dbCache(getAllProductsFromUserInternal, {
        tags: [getUserTag(CACHE_TAGS.products, userId)]
    })
    return cacheFn(userId, {limit})
}

export async function updateProduct(data: Partial<typeof ProductTable.$inferInsert>, {productId, userId}: {
    productId: string,
    userId: string
}) {
    const {rowCount} = await db.update(ProductTable).set(data).where(and(eq(ProductTable.id, productId), eq(ProductTable.clerkUserId, userId)))

    if (rowCount > 0) {
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            userId,
            id: productId
        })
        return {
            error: false,
            message: "Product updated successfully"
        }
    } else {
        return {
            error: true,
            message: "Product not found or you do not have permission to update it"
        }
    }
}


async function getOneProductInternal({userId, productId}: { userId: string, productId: string }) {
    const results = await db.query.ProductTable.findFirst({
        where: ({id, clerkUserId}, {and, eq}) => and(eq(id, productId), eq(clerkUserId, userId)),
    })
    if (results != null) {
        return results
    } else {
        return notFound();
    }
}

export function getAllProductsFromUserInternal(userId: string, {limit}: { limit?: number }) {
    return db.query.ProductTable.findMany({
        where: ({clerkUserId}, {eq}) => eq(clerkUserId, userId),
        orderBy: ({createdAt}, {desc}) => desc(createdAt),
        limit
    })
}

export async function countAllUserProductsInternal(userId: string) {
    const data = await db.select({productCount: count()}).from(ProductTable).where(eq(ProductTable.clerkUserId, userId));

    return data[0].productCount ?? 0;
}


export function getProductCountryGroups({productId, userId,}: { productId: string; userId: string }) {
    const cacheFn = dbCache(getProductCountryGroupsInternal, {
        tags: [
            getIdTag(CACHE_TAGS.products, productId,),
            getGlobalTag(CACHE_TAGS.countries),
            getGlobalTag(CACHE_TAGS.countryGroups),
        ],
    })

    return cacheFn({productId, userId})
}


export async function getProductCountryGroupsInternal({productId, userId}: { productId: string, userId: string }) {

    const product = await getOneProduct(productId, userId);

    if (!product) return [];

    const data = await db.query.CountryGroupTable.findMany({
        with: {
            countries: {
                columns: {
                    name: true,
                    code: true,
                },
            },
            countryGroupDiscounts: {
                columns: {
                    coupon: true,
                    discountPercentage: true,
                },
                where: ({productId: id}, {eq}) => eq(id, productId),
                limit: 1,
            },
        },
    })


    return data.map(group => {
        return {
            id: group.id,
            name: group.name,
            recommendedDiscountPercentage: group.recommendedDiscountPercentage,
            countries: group.countries,
            discount: group.countryGroupDiscounts.at(0),
        }
    })


}


/**
 * Update country groups Discounts for a product
 * @param insertedGroup
 * @param deletedGroup
 * @param productId
 * @param userId
 */

export async function updateCountryGroupsDiscountFromDB(
    insertedGroup: (typeof CountryGroupDiscountTable.$inferInsert)[] | undefined,
    deletedGroup: { countryGroupId: string }[],
    {productId, userId}: { productId: string; userId: string }) {

    const product = await getOneProduct(productId, userId);

    if (!product) return null;

    const statements: BatchItem<'pg'>[] = [];

    if (deletedGroup.length > 0) {
        statements.push(db.delete(CountryGroupDiscountTable).where(and(
            eq(CountryGroupDiscountTable.productId, productId),
            inArray(CountryGroupDiscountTable.countryGroupId, deletedGroup.map(({countryGroupId}) => countryGroupId))
        )))
    }

    if (insertedGroup && insertedGroup.length > 0) {
        statements.push(
            db.insert(CountryGroupDiscountTable).values(insertedGroup).onConflictDoUpdate(
                {
                    target: [
                        CountryGroupDiscountTable.countryGroupId,
                        CountryGroupDiscountTable.productId
                    ],
                    set: {
                        coupon: sql.raw(`excluded.${CountryGroupDiscountTable.coupon.name}`),
                        discountPercentage: sql.raw(`excluded.${CountryGroupDiscountTable.discountPercentage.name}`)
                    }
                }
            )
        )
    }

    if (statements.length > 0) {
        await db.batch(statements as [BatchItem<'pg'>]);
    }

    revalidateDbCache({
        tag: CACHE_TAGS.products,
        userId,
        id: productId
    })

}

export async function getProductCustomization({productId, userId}: { productId: string, userId: string }) {

    const cacheFn = dbCache(getProductCustomizationInternal, {
        tags: [
            getIdTag(CACHE_TAGS.products, productId,),
        ],
    })

    return cacheFn({productId, userId})

}

async function getProductCustomizationInternal({productId, userId}: { productId: string, userId: string }) {

    const product = await getOneProduct(productId, userId);

    if (!product) return null;

    const data = await db.query.ProductTable.findFirst({
        where: ({id, clerkUserId}, {eq, and}) => and(eq(id, productId), eq(clerkUserId, userId)),
        with: {productCustomization: true}
    })


    return data?.productCustomization;

}


export async function updateProductCustomization(data: Partial<typeof ProductCustomizationTable.$inferInsert>, {productId}: {
    productId: string
}) {
    const {rowCount} = await db.update(ProductCustomizationTable).set(data).where(eq(ProductCustomizationTable.productId, productId))

    if (rowCount > 0) {
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            id: productId
        })

    }


}


export async function getProductForBanner({id, countryCode, url}: { id: string, countryCode: string, url: string }) {

    const urlFormatted = removeTrailingSlash(url);

    const cacheFn = dbCache(getProductForBannerInternal, {
        tags: [
            getIdTag(CACHE_TAGS.products, id),
            getGlobalTag(CACHE_TAGS.countries),
            getGlobalTag(CACHE_TAGS.products),
            getGlobalTag(CACHE_TAGS.countryGroups),
        ],
    })

    return cacheFn({id, countryCode, url: urlFormatted})

}

async function getProductForBannerInternal({id, countryCode, url}: { id: string, countryCode: string, url: string }) {


      const data = await db.query.ProductTable.findFirst({
          where: ({ id: idCol, url: urlCol }, { and, eq }) =>and(eq(idCol, id), eq(urlCol, url)),
          columns: {
              id: true,
              clerkUserId: true,
              url: true
          },
          with: {
              productCustomization: true,
              countryGroupDiscounts: {
                  columns: {
                      coupon: true,
                      discountPercentage: true
                  },
                  with: {
                      countryGroup:{
                          columns: {},
                          with: {
                              countries:{
                                  columns: {
                                      id: true,
                                      name: true,
                                  },
                                  limit: 1,
                                  where: ({ code }, { eq }) => eq(code, countryCode)
                              }
                          }
                      }
                  }
              }
          }
      })

    const discount = data?.countryGroupDiscounts.find(discount => discount.countryGroup.countries.length > 0);
    const country = discount?.countryGroup.countries.at(0);
    const product = data == null || data.productCustomization == null ? undefined : {
        id: data.id,
        clerkUserId: data.clerkUserId,
        customization: data.productCustomization
    };

    return {
        product,
        discount: discount == null ? undefined : {
            coupon: discount.coupon,
            percentage: discount.discountPercentage
        },
        country
    }

}