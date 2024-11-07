import {revalidateTag, unstable_cache} from "next/cache";
import {cache} from "react";

export const CACHE_TAGS = {
    products: "products",
    productViews: "productViews",
    subscription: "subscription",
    countries: "countries",
    countryGroups: "countryGroups",

} as const;

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
    return `global:${CACHE_TAGS[tag]}` as const;
}

export function getUserTag(tag: keyof typeof CACHE_TAGS, userId: string) {
    return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}
export function getIdTag (tag: keyof typeof CACHE_TAGS, id: string) {
    return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

export type ValidTags = ReturnType<typeof getGlobalTag> | ReturnType<typeof getUserTag> | ReturnType<typeof getIdTag>;


export function clearFullCache() {
    revalidateTag("*")
}
export function dbCache<T extends (...args: any[]) => Promise<any>>(
    cb: Parameters<typeof unstable_cache<T>>[0],
    {tags}: {tags: ValidTags[]}
) {
   return cache(unstable_cache<T>(cb, undefined, {tags: [...tags, "*"]}))
}



export function revalidateDbCache( {tag, id, userId} : {tag: keyof typeof CACHE_TAGS, id?: string, userId?: string
}) {
    if (id) {
        revalidateTag(getIdTag(tag, id))
    }
    if (userId) {
        revalidateTag(getUserTag(tag, userId))
    }
    revalidateTag(getGlobalTag(tag))
}