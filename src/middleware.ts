import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server"
import {NextResponse} from "next/server";
import {env} from "@/data/env/client";
/* import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';



 
const locales = ["fr-FR",'en-US'];

const headers = {"accept-language": "fr-FR,fr;q=0.5"}

const langs = new Negotiator({ headers }).language() as unknown as string[];

const defaultLocale = "fr-FR";

match(langs,locales,defaultLocale); */

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api(.*)",
    "/fr",
    "/en",
    "/es",
])

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect()
    }

    const url = req.nextUrl;
    if (url.pathname === "/") {
        return NextResponse.redirect(`${env.NEXT_PUBLIC_SERVER_URL}/${env.NEXT_PUBLIC_DEFAULT_LANGUAGE}`);
    }
})


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}