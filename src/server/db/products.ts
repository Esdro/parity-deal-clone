import {ProductCustomizationTable, ProductTable} from "@/drizzle/schema";
import {db} from "@/drizzle/db";
import {and, desc, eq} from "drizzle-orm";
import {CACHE_TAGS, dbCache, getUserTag, revalidateDbCache} from "@/lib/cache";


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
    } catch (e) {
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
    }else {
        return {
            error: true,
            message: "Product not found or you do not have permission to delete it"
        }
    }

}

export async function getAllProductsFromUser(userId: string, {limit}: { limit?: number }) {
    const cacheFn = dbCache(getAllProductsFromUserInternal, {
        tags: [getUserTag(CACHE_TAGS.products, userId)]
    })
    return cacheFn(userId, {limit})
}

/**
 * Get a single product by its id
 * @param productId
 */
export async function getOneProduct(productId: string) {
    const results = await db.select().from(ProductTable).where(
        eq(ProductTable.id, productId)).orderBy(
        desc(ProductTable.createdAt)
    )

    return results[0]
}

export function getAllProductsFromUserInternal(userId: string, {limit}: { limit?: number }) {
    return db.query.ProductTable.findMany({
        where: ({clerkUserId}, {eq}) => eq(clerkUserId, userId),
        orderBy: ({createdAt}, {desc}) => desc(createdAt),
        limit
    })
}
