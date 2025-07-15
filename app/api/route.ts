import { getOriginFromHeaders } from "@/utils/getOrigin";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest){
    const url = await request.json();
    if(!url){
        return NextResponse.json({
            data: "URL is required"
        })
    }
    const getOrigin = await getOriginFromHeaders();
    const scrapeData = await fetch (`${getOrigin}/api/scraper`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url.url }),
    });
    const responseFromScraper = await scrapeData.json();
    return NextResponse.json(responseFromScraper)
    
}