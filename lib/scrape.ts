export async function scrape(url: string) {
  const fetchSummary = await fetch(`/api`, {
    method: "POST",
    body: JSON.stringify({
      url: url,
    }),
  });
  const response = await fetchSummary.json();
  return response;
}
