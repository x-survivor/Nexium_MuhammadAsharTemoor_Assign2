import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  const response = await fetch("https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINHG_FACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_length: 130,
        min_length: 30,
        do_sample: false
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: data.error || "Summarization failed" });
  }

  return res.status(200).json({ summary: data[0]?.summary_text });
}
