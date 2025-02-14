import {getDictionary} from "../../../../get-dictionary";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest){

    if (!req.headers.get('lang') || req.method !== 'GET') {
        return NextResponse.json({ message: "Language not found or method not accepted "}, {status: 400});
    }
   const lang = req.headers.get('lang') as "fr" | "en" | "es";

   // console.log('lang from here', lang);

  const data = await getDictionary(lang);

    if (data) {
        return NextResponse.json(data);
    }else {
        return NextResponse.json({ message: "Data not found"});
    }

}