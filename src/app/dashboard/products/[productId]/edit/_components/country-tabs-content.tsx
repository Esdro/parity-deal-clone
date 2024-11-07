import {getProductCountryGroups} from "@/server/db/products";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {InfoIcon} from "lucide-react";
import CountryGroupsDiscountForm from "@/app/dashboard/_components/CountryGroupForm";
import React from "react";

/**
 * CountryTabsContent
 * @param productId
 * @param userId
 * @constructor
 */
async function CountryTabsContent({productId, userId}: { productId: string, userId: string }) {

    const countryGroups = await getProductCountryGroups({productId, userId});


    // console.log(countryGroups);
    /* [
         {id: "1", name: "Country Group 1", recommendedDiscountPercentage: 10, countries: [{name: "France", code: "FR"}, {name: "Germany", code: "DE"},{name: "Italy", code: "IT"} ], discount: {coupon: "EUROPE10", discountPercentage: 0.1}},
         {id: "2", name: "Country Group 2", recommendedDiscountPercentage: 30, countries: [ {name: "Bénin", code: "BJ"}, {name: "Cameroon", code: "CM"}, {name: "Algérie", code: "DZ"} ], discount: {coupon: "AFRO30", discountPercentage: 0.2}},
         {id: "3", name: "Country Group 3", recommendedDiscountPercentage: 20, countries: [{name: "India", code: "IN"}, {name: "China", code: "CN"}], discount: {coupon: "ASIA20", discountPercentage: 0.3}},
     ]*/

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl'>Country Discounts</CardTitle>
                <Alert  className='!my-4 flex gap-8 items-center justify-between '>
                    <InfoIcon className='size-6 text-red-600 '/>
                    <div>
                        <AlertTitle>Country Groups Discount</AlertTitle>
                        <AlertDescription> Leave the discount field blank if you do not want to display deals for specific parity group </AlertDescription>
                    </div>
                </Alert>
            </CardHeader>
            <CardContent>
                <CountryGroupsDiscountForm productId={productId} countryGroups={countryGroups}/>
            </CardContent>
        </Card>
    )
}

export default CountryTabsContent;