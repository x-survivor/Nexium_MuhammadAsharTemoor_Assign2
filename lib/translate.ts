// lib/manualTranslate.ts

import { englishToUrduDict } from "@/lib/translateDic";

export function TranslateSummary(input: any) {
  const sentence = String(input);
  return sentence
    .split(/\s+/)
    .map((word) => {
      const cleaned = word.toLowerCase().replace(/[^\w]/g, ""); // Remove punctuation
      return englishToUrduDict[cleaned] ? englishToUrduDict[cleaned] : word;
    })
    .join(" ");
}
