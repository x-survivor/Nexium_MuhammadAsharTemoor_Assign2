// For App Router (uses headers() API)
import { headers } from "next/headers"

export async function getOriginFromHeaders() {
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}
