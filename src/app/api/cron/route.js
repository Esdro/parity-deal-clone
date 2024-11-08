import {clearFullCache} from "@/lib/cache";

export async function GET() {
    return clearFullCache();
}