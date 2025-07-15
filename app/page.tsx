"use client";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TranslateSummary } from "@/lib/translate";
import { Summarize } from "@/lib/summarizer";
import { scrape } from "@/lib/scrape";



export default function Home() {
  const [Url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
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
    const scraped = await scrape(Url);
    setResult(scraped);
    const summarizedText = await Summarize(scraped.content);
    setSummary(summarizedText);
    const response = TranslateSummary(summarizedText);
    console.log(response);
    setTranslated(response);
  }
  function validateURL(){
    try {
    // Try to construct a URL object
    new URL(Url);
    setUrl(Url);
    fetchData();
  } catch {
    setUrl(Url); // Optionally, you can skip this line to only set valid URLs
    toast.error("Please enter a valid URL.");
  }

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  return (
    <div className="min-h-screen w-full scrollbar-hide p-10 px-20 bg-radial-[at_80%_30%] from-red-500/20 via-white  to-white flex flex-col justify-center items-center gap-10">
      <Toaster richColors />
      <div className="w-full flex flex-col justify-center items-center gap-y-5">
        <div>
          <h1 className="text-[5rem] uppercase font-bold">Blog Summarizer</h1>
        </div>
        <div className="w-full flex justify-center items-center gap-4 backdrop-blur-lg">
          <Input
            className="w-1/2"
            id="url"
            type="text"
            name="url"
            value={Url}
            onChange={handleChange}
            placeholder="Enter Blog URL"
          />
          <Button onClick={validateURL}> Summarize </Button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-10">
        <div className="w-1/2 h-[75vh] overflow-hidden backdrop-blur-xl shadow-2xl p-7 rounded-2xl border-2 flex flex-col gap-5 border-red-300">
          <span className="text-xl font-bold flex flex-col">Full Blog:</span>
          <div className="h-11/12 overflow-y-scroll scrollbar-hide">
            <p className="text-sm">{result.content}</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center h-[75vh] gap-y-10">
          <div className="w-full h-1/2 overflow-hidden backdrop-blur-xl shadow-2xl p-7 rounded-2xl border-2 flex flex-col gap-5 border-red-300">
            <span className="text-xl font-bold flex flex-col">Summary:</span>
            <div className="h-11/12 overflow-y-scroll scrollbar-hide">
              <p className="text-sm">{summary}</p>
            </div>
          </div>
          <div className="w-full h-1/2 overflow-y-scroll scrollbar-hide backdrop-blur-xl shadow-2xl p-7 rounded-2xl border-2 flex flex-col gap-5 border-red-300">
            <span className="text-xl font-bold flex flex-col">
              Translation:
            </span>
            <div className="h-11/12 overflow-y-scroll scrollbar-hide">
              <p className="text-sm">{translated}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
