import {z} from "zod";

export const productCustomizationSchema = z.object({
    classPrefix: z.string().optional(),
    backgroundColor: z.string().min(1, "Required"),
    textColor: z.string().min(1, "Required"),
    fontSize: z.string().min(1, "Required"),
    locationMessage: z.string().min(1, "Required"),
    bannerContainer: z.string().min(1, "Required"),
    isSticky: z.boolean(),
})