import {NextRequest, NextResponse} from "next/server";
import {headers} from "next/headers";
import {env} from "@/data/env/server";
import {getProductForBanner} from "@/server/db/products";
import {createProductView} from "@/server/db/productViews";
import {canRemoveBranding, canShowBanner} from "@/server/permissions";
import {createElement} from "react";
import {Banner} from "@/components/Banner";

export async function GET(request: NextRequest, {params}) {

    const {productId} = await params;

    const headersMap = await headers();

    const requestingUrl = headersMap.get('referer') || headersMap.get('origin');

    const countryCode = getCountryCode(request);
   //  console.log('requestingUrl', requestingUrl);

    if (!requestingUrl || !productId || !countryCode) return new NextResponse("Not Found", {status: 500});

    const {product, discount, country} = await getProductForBanner({
        id: productId,
        countryCode,
        url: requestingUrl
    })

     console.log('product', product);
    if (!product) return new NextResponse("Product not found or bad url ", {status: 401});

    const canShow = await canShowBanner(product.clerkUserId)

    await createProductView({
        productId: product.id,
        countryId: country?.id,
        userId: product.clerkUserId
    })


    if (!canShow) return new NextResponse("Maximum visits reached", {status: 400});

    if (!discount || !country) return new NextResponse("Not Found", {status: 404});

    const canRemove = await canRemoveBranding(product.clerkUserId);

    const jsContent = await getJsContent(discount, country, product, canRemove);

    return new NextResponse(jsContent, {status: 200, headers: {'Content-Type': 'text/javascript'}});
}

function getCountryCode(request: NextRequest) {
    // const headersMap = await headers();
    // const requestingUrl = headersMap.get('referer') || headersMap.get('origin');
    // const ip = request.headers.get('cf-connecting-ip');
    // const url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&ip_address=${ip}`;
    // const response = await fetch(url);
    // const data = await response.json();
    // return data.country_code;

    if (request["geo"]?.geo.country) return request["geo"].country as string;

    if (process.env.NODE_ENV === 'development') return env.TEST_COUNTRY_CODE as string;
}

async function getJsContent(
    discount: {
        coupon: string,
        percentage: number,
    },
    country: {
        name: string,
    },
    product: {
        id: string;
        clerkUserId: string;
        customization: {
            locationMessage: string,
            backgroundColor: string,
            bannerContainer: string,
            textColor: string,
            fontSize: string,
            isSticky: boolean
            classPrefix?: string | null
        }
    },
    canRemove: boolean
) {

    const {renderToStaticMarkup} = await import("react-dom/server");

    return `
            const banner = document.createElement('div');
            banner.id = 'custom-banner-from-cpp';
            banner.innerHTML = " ${renderToStaticMarkup(createElement(Banner, {
        message: product.customization.locationMessage,
        mappings: {
            country: country.name,
            coupon: discount.coupon,
            discount: (discount.percentage * 100).toString(),
        },
        customization: product.customization,
        canRemoveBranding: canRemove
    }))}"
    
    document.querySelector('${product.customization.bannerContainer}').prepend(...banner.children);
    `.replace(/(\r\n|\n\r)/g, '');
}