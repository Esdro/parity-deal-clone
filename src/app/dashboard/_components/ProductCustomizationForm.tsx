"use client";

import {productCustomizationSchema} from "@/schemas/productCustomization";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {AccessNotPermitted} from "@/components/AccessDeniedComponent";
import {Banner} from "@/components/Banner";
import {updateProductCustomizationFromDB} from "@/server/actions/product";
import {useToast} from "@/hooks/use-toast";

type ProductCustomizationFormProps = {
    customization: {
        productId: string;
        locationMessage: string;
        textColor: string;
        backgroundColor: string;
        fontSize: string;
        bannerContainer: string;
        isSticky: boolean;
        classPrefix: string | null;
    };
    canRemoveBranding: boolean;
    canCustomizeBanner: boolean;
}

export default function ProductCustomizationForm({canCustomizeBanner, customization, canRemoveBranding}: ProductCustomizationFormProps) {

    const {toast } = useToast();

    const form = useForm<z.infer<typeof productCustomizationSchema>>({
        resolver: zodResolver(productCustomizationSchema),
        mode: "onSubmit",
        defaultValues: {
            ...customization,
            classPrefix: customization.classPrefix ?? "",
        }
    })

    const formValues = form.watch();

    async function handleSubmit(values: z.infer<typeof productCustomizationSchema>) {

       const {error, message} =  await updateProductCustomizationFromDB( customization.productId, values);

       if (message) {
           toast({
                title: error ? "Error" : "Success",
                description: message,
                variant: error ? "destructive" : "default",
           })
       }
    }



    return (
        <>

            <Banner
                customization={formValues}
                mappings={{
                country: "United States",
                discount: "10",
                coupon: "US2024"
                }}
                message={formValues.locationMessage?? ""}
                canRemoveBranding={canRemoveBranding}
            />

            {!canCustomizeBanner && <AccessNotPermitted accessName={ " Banner Customization " } />}

            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className='grid grid-cols-1 md:grid-cols-2 mt-8  gap-8'>
                        <FormField
                            control={form.control}
                            name="locationMessage"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='font-bold'>Banner Message</FormLabel>
                                    <FormControl>
                                        <Textarea className='min-h-32 resize-none ' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the message that will be displayed on the banner <br/>
                                        {" Data Parameters: {country}, {coupon} ,{code} "}
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                            <FormField
                                control={form.control}
                                name="fontSize"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Font Size</FormLabel>
                                        <FormControl>
                                            <Input disabled={!canCustomizeBanner}  {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="backgroundColor"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Background Color</FormLabel>
                                        <FormControl>
                                            <Input disabled={!canCustomizeBanner}  {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='isSticky'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Sticky Banner ?</FormLabel>
                                        <FormControl>
                                            <Switch
                                                className='block'
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={!canCustomizeBanner}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={'bannerContainer'}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Banner Container </FormLabel>
                                        <FormControl>
                                            <Input disabled={!canCustomizeBanner} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The HTML element that will be used as the banner container.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={'classPrefix'}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Class Prefix</FormLabel>
                                        <FormControl>
                                            <Input disabled={!canCustomizeBanner} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is the class prefix that will be added to the banner container.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    {canCustomizeBanner && (
                        <div className="self-end mt-4">
                            <Button disabled={form.formState.isSubmitting} type="submit">
                                Update Customization
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </>
    )

}


