"use client";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { storeData } from "@/lib/insert";

async function summarize(url: string){
  const fetchSummary = await fetch(`/api`, {
    method: "POST",
    body: JSON.stringify({
      url: url,
    }),
  })
  const response = await fetchSummary.json();
  return response;
}

export default function Home() {
  const [result, setResult] = useState<string | null>(null);

  const url = "https://www.sparringmind.com/successful-blogs/";
  useEffect(() => {
    async function fetchData() {
      const summary = await summarize(url);
      setResult(summary);
      console.log(summary)
    }
    fetchData();
  }, [url]);
  
  return (
    <div>
      <Toaster richColors />
      <Button onClick={() => toast.info("Button Clicked")}> Show Toast </Button>
    </div>
  );
}
