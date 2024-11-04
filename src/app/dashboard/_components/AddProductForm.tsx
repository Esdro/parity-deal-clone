"use client";
import React from 'react';
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormLabel, FormControl, FormItem, FormDescription, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {createProduct} from "@/server/actions/product";
import {ProductFormSchema, ProductFormValues} from "@/schemas/products";
import {useToast} from "@/hooks/use-toast";


function AddProductForm() {

    const form =  useForm<z.infer<typeof ProductFormSchema>>({
        resolver: zodResolver(ProductFormSchema),
        mode: "onSubmit",
        defaultValues: ProductFormValues
    })

    const { toast } = useToast();

    async function OnSubmitFormHandler(values : z.infer<typeof ProductFormSchema> ) {

        // console.log(data)
      const data = await createProduct(values);

        if (data?.message) {
            toast({
                title: data.error ? "Error" : "Success",
                description: data.message,
                variant: data.error ? "destructive" : "default",
            })
        }

        form.reset(ProductFormValues);


    }

    return (
        <div className='flex flex-col mt-8'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(OnSubmitFormHandler)} className='space-y-8'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='font-bold'>Name </FormLabel>
                                    <FormControl>
                                        <Input className='border-l-input' {...field} />
                                    </FormControl>
                                    <FormDescription> Enter the name of your Product  </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='font-bold'> Product Url </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription className='font-semibold'> Make sure to type here the url of your product page.  </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='grid grid-cols-1'>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='font-bold'> Description </FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className='resize-none min-h-20 ' />
                                    </FormControl>
                                    <FormDescription> Describe your product here. </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex justify-end'>
                        <Button type='submit' className='w-full sm:w-auto sm: ' variant='accent'> Add Product </Button>
                    </div>
                </form>
            </Form>

        </div>
    );
}

export default AddProductForm;