import {clearFullCache} from "../../../lib/cache.js";

export async function GET() {
    return clearFullCache();
}