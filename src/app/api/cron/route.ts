import {clearFullCache} from "@/lib/cache";
import {NextRequest} from "next/server";



export async function GET(req:NextRequest) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", {
            status: 401,
        })
    }
    return clearFullCache();
}