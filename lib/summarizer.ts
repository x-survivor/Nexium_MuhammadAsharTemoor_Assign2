export async function Summarize(text: string): Promise<string> {
  const response = await fetch("/api/summarizer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
  });
  const data = await response.json();
  console.log(data.summary);
  return data.summary;
}
