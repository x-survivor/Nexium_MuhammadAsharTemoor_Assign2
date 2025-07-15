"use client";
import { useState } from "react";
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

  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);

  async function fetchData() {
    setScrapeLoading(true);
    setSummary("");
    setTranslated("");
    try {
      const scraped = await scrape(Url);
      setResult(scraped);
      setScrapeLoading(false);

      const Store_Full_Blog = await fetch(`${location.href}/api/storeFullBlog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: scraped.content,
        }),
      });

      const Mongo_Insert_response = await Store_Full_Blog.json();
      toast.success("Blog is stored at " + Mongo_Insert_response._id);

      setSummarizeLoading(true);
      const summarizedText = await Summarize(scraped.content);
      setSummary(summarizedText);
      setSummarizeLoading(false);

      const Store_Summary = await fetch(`${location.href}/api/storeSummary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: summarizedText,
        }),
      });
      const Summary_Insert_Response = await Store_Summary.json();
      toast.success(Summary_Insert_Response.id);
    } catch (error) {
      setScrapeLoading(false);
      setSummarizeLoading(false);
      toast.error("An error occurred: " + error);
    }
  }

  async function translate() {
    setTranslateLoading(true);
    try {
      const response = await TranslateSummary(summary);
      setTranslated(response);
    } catch {
      toast.error("Translation failed.");
    }
    setTranslateLoading(false);
  }

  function validateURL() {
    try {
      new URL(Url);
      setUrl(Url);
      fetchData();
    } catch  {
      setUrl(Url);
      toast.error("Please enter a valid URL.");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  return (
    <div className="min-h-screen w-full scrollbar-hide p-10 px-20 bg-radial-[at_80%_30%] from-red-500/20 via-white/0  to-white/0 flex flex-col justify-center items-center gap-10">
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
          <Button onClick={validateURL} disabled={scrapeLoading || summarizeLoading}> {scrapeLoading || summarizeLoading ? "Loading..." : "Summarize"} </Button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-10">
        <div className="w-1/2 h-[75vh] overflow-hidden backdrop-blur-xl shadow-2xl p-7 rounded-2xl border-2 flex flex-col gap-5 border-red-300">
          <span className="text-xl font-bold flex flex-col">Full Blog:</span>
          <div className="h-11/12 overflow-y-scroll scrollbar-hide">
            {scrapeLoading ? (
              <p className="text-sm text-gray-400">Scraping blog...</p>
            ) : (
              <p className="text-sm">{result.content}</p>
            )}
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center h-[75vh] gap-y-10">
          <div className="w-full h-1/2 overflow-hidden backdrop-blur-xl shadow-2xl p-7 rounded-2xl border-2 flex flex-col gap-5 border-red-300">
            <span className="text-xl font-bold flex flex-col">Summary:</span>
            <div className="h-11/12 overflow-y-scroll scrollbar-hide">
              {summarizeLoading ? (
                <p className="text-sm text-gray-400">Summarizing...</p>
              ) : (
                <p className="text-sm">{summary}</p>
              )}
            </div>
          </div>
          <div className="w-full h-1/2 overflow-y-scroll scrollbar-hide backdrop-blur-xl shadow-2xl p-7 rounded-2xl border-2 flex flex-col gap-5 border-red-300">
            <span className="text-xl font-bold flex justify-between">
              Translation:
              <Button onClick={translate} disabled={translateLoading || !summary}>{translateLoading ? "Translating..." : "Translate"}</Button>
            </span>
            <div className="h-11/12 overflow-y-scroll scrollbar-hide">
              {translateLoading ? (
                <p className="text-sm text-gray-400">Translating...</p>
              ) : (
                <p className="text-sm">{translated}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
