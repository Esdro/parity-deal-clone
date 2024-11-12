import {getUserSubscriptionTier} from "@/server/db/subscription";
import {countAllUserProducts} from "@/server/db/products";
import {startOfMonth} from "date-fns";
import {getProductViewCount} from "@/server/db/productViews";

export async function canRemoveBranding(userId: string | null) {

    if (!userId) return false;

    const subscription = await getUserSubscriptionTier(userId);

    return subscription.canRemoveBranding
}

export async function canCustomizeBanner(userId: string | null) {

    if (!userId) return false;

    const subscription = await getUserSubscriptionTier(userId);

    return subscription.canCustomizeBanner
}

export async function canAccessAnalytics(userId: string | null) {

    if (userId == null) return false;

    const subscription = await getUserSubscriptionTier(userId);

    return subscription.canAccessAnalytics
}

export async function canCreateProduct(userId: string) {

    if (userId == null) return false;

    const subscription = await getUserSubscriptionTier(userId);

    const productsCreated = await countAllUserProducts(userId);

    return productsCreated < subscription.maxNumberOfProducts
}

export async function canShowBanner(userId: string | null) {

        if (userId == null) return false;

    const subscription = await getUserSubscriptionTier(userId);

    const productsCreated = await getProductViewCount(userId, startOfMonth(new Date()));

    return productsCreated < subscription.maxNumberOfVisits
}