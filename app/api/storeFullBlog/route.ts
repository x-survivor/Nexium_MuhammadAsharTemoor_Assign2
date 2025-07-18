import { NextResponse } from "next/server";
import { storeData } from "@/lib/insert";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await storeData(body);
  return NextResponse.json(result);
}
