"use client";
import React from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import { CountryGroupsDiscountSchema} from "@/schemas/countryGroups";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {useToast} from "@/hooks/use-toast";
import {updateCountryGroups} from "@/server/actions/product";

type CountryGroupFormProps = {
    productId: string;
    countryGroups: {
        id: string;
        name: string;
        recommendedDiscountPercentage: number | null
        countries: {
            name: string;
            code: string;
        }[]
        discount: {
            coupon: string;
            discountPercentage: number;
        } | undefined
    }[]
}

export default function CountryGroupsDiscountForm({productId, countryGroups}: CountryGroupFormProps) {

    const form = useForm<z.infer<typeof CountryGroupsDiscountSchema>>({
        resolver: zodResolver(CountryGroupsDiscountSchema),
        mode: "onSubmit",
        defaultValues: {
            groups: countryGroups.map(group => {

                const discount = group.discount?.discountPercentage ?? group.recommendedDiscountPercentage

                return {
                    countryGroupId: group.id,
                    coupon: group.discount?.coupon ?? "",
                    discountPercentage: discount != null ? discount * 100 : undefined,
                }
            })
        }
    })

    const {toast} = useToast();


    const submitHandler = async (values: z.infer<typeof CountryGroupsDiscountSchema>) => {


        const {error, message} = await updateCountryGroups(values, productId);

        if (message) {
            toast({
                title: error ? "Error" : "Success",
                description: message,
                variant: error ? "destructive" : "default",
            })
        }



    }


    return (
        <div className='flex flex-col mt-8'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(submitHandler)} className='space-y-4' data-element={productId}>
                    {countryGroups.map((group, index) => (
                        <Card key={index}>

                            <CardContent className='pt-4'>
                                <div className='mt-4 flex flex-col space-y-2'>
                                    <h2 className='text-xl text-muted-foreground '>{group.name}</h2>
                                    <div className="flex gap-2 flex-wrap">
                                        {group.countries.map(country => (
                                            <Image
                                                key={country.code}
                                                width={24}
                                                height={16}
                                                alt={country.name}
                                                title={country.name}
                                                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`}
                                                className="border"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className=' mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4'>
                                    <FormField
                                        control={form.control}
                                        name={`groups.${index}.discountPercentage`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className='font-bold'>Discount Percentage </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        {...field}
                                                        onChange={e => field.onChange(e.target.valueAsNumber ?? "")}
                                                        min={"0"}
                                                        max={"100"}
                                                    />
                                                </FormControl>
                                                <FormDescription> {form.formState.errors.groups?.[index]?.root?.message} </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`groups.${index}.coupon`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className='font-bold'>Coupon Code </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormDescription> {form.formState.errors.groups?.[index]?.root?.message} </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>

                        </Card>
                    ))}

                    <div className='flex justify-end'>
                        <Button type="submit" disabled={form.formState.isSubmitting}> Update and Save </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}