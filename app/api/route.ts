import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const fetchResponse = await fetch("http://localhost:5678/webhook-test/8642c374-468a-4a80-a11b-9d5d67b2bf42?123=https://muhammadasher183.blogspot.com/2024/07/hello-just-getting-to-know-about-blogs.html", {
    method: "GET",
  });
  if (!fetchResponse.ok) {
    return NextResponse.json({ error: "Failed to fetch the n8n workflow" }, { status: 500 });
  }
    const workflowData = await fetchResponse.json();
    return NextResponse.json(workflowData);
}