"use client";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

async function summarize(url: string) {
  const fetchSummary = await fetch(`/api`, {
    method: "POST",
    body: JSON.stringify({
      url: url,
    }),
  });
  const response = await fetchSummary.json();
  return response;
}

export default function Home() {
  const [Url, setUrl] = useState("");
  const [result, setResult] = useState({
    url: "",
    title: "",
    content: "",
    metaDescription: "",
    author: "",
    publishDate: "",
    wordCount: 0,
    readingTime: 0,
  });

  async function fetchData() {
    const summary = await summarize(Url);
    setResult(summary);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  return (
    <div className="min-h-screen overflow-hidden p-10">
      <Toaster richColors />
      <div>
        <Input
          id="url"
          type="text"
          name="url"
          value={Url}
          onChange={handleChange}
        />
      </div>
      <div className="w-1/3 overflow-y-scroll h-[75vh]">
        <p className="text-sm">{result.content}</p>
      </div>
      <Button onClick={fetchData}> Summarize </Button>
    </div>
  );
}
