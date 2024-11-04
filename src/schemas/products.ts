import {z} from "zod";

export const  ProductFormSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
    description: z.string(),
    url: z.string().url({message: "Invalid URL : type a valid URL"}),
})
export const ProductFormValues =  {
    name: "",
    description: "",
    url: ""
}