import {getUserSubscriptionTier} from "@/server/db/subscription";

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