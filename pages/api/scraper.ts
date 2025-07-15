import { JSDOM } from 'jsdom';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ScrapedData {
  url: string;
  title: string;
  content: string;
  metaDescription: string | null;
  author: string | null;
  publishDate: string | null;
  wordCount: number;
  readingTime: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url } = req.body as { url?: string };
    if (!url) {
      return res.status(400).json({ message: 'No URL provided' });
    }
    const fetchHtml = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    });
    const html = await fetchHtml.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const content = extractContent(document);
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    const scrapedData: ScrapedData = {
      url: url,
      title: extractTitle(document),
      content: content,
      metaDescription: extractMetaDescription(document),
      author: extractAuthor(document),
      publishDate: extractPublishDate(document),
      wordCount,
      readingTime,
    };

    return res.status(200).json(scrapedData);
  }

  // Handle non-POST methods
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

function extractTitle(document: Document): string {
  // Try multiple selectors for title
  const selectors = ['h1', 'title', '[property="og:title"]', '[name="twitter:title"]'];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const title = element.textContent || element.getAttribute('content');
      if (title && title.trim()) {
        return title.trim();
      }
    }
  }
  
  return 'Untitled';
}

function extractContent(document: Document): string {
  // Remove unwanted elements
  const unwantedSelectors = [
    'script', 'style', 'nav', 'header', 'footer', 
    '.sidebar', '.menu', '.navigation', '.ads',
    '.comments', '.social-share', '.related-posts'
  ];
  
  unwantedSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  // Try to find main content using common selectors
  const contentSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.entry-content',
    '.content',
    '.post-body',
    '.article-body',
    'main',
    '.main-content'
  ];

  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const content = extractTextFromElement(element);
      if (content && content.length > 100) { // Ensure substantial content
        return content;
      }
    }
  }

  // Fallback: extract from paragraphs
  const paragraphs = document.querySelectorAll('p');
  let content = '';
  paragraphs.forEach(p => {
    const text = p.textContent?.trim();
    if (text && text.length > 20) {
      content += text + '\n\n';
    }
  });

  return content.trim() || 'No content found';
}

function extractTextFromElement(element: Element): string {
  // Get text content while preserving paragraph breaks
  const walker = element.ownerDocument.createTreeWalker(
    element,
    element.ownerDocument.defaultView!.NodeFilter.SHOW_TEXT,
    null,
  );

  let text = '';
  let node: Node | null;
  let lastWasBlock = false;

  while ((node = walker.nextNode())) {
    const parentTag = node.parentElement ? node.parentElement.tagName.toLowerCase() : '';
    const isBlock = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote'].includes(parentTag);

    if (isBlock && !lastWasBlock) {
      text += '\n';
    }

    text += node.textContent;
    lastWasBlock = isBlock;

    if (isBlock) {
      text += '\n';
    }
  }

  return text.replace(/\n\s*\n/g, '\n\n').trim();
}

function extractMetaDescription(document: Document): string | null {
  const metaSelectors = [
    '[name="description"]',
    '[property="og:description"]',
    '[name="twitter:description"]'
  ];

  for (const selector of metaSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const content = element.getAttribute('content');
      if (content && content.trim()) {
        return content.trim();
      }
    }
  }

  return null;
}

function extractAuthor(document: Document): string | null {
  const authorSelectors = [
    '[name="author"]',
    '[property="article:author"]',
    '.author',
    '.byline',
    '.post-author',
    '[rel="author"]'
  ];

  for (const selector of authorSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const author = element.textContent || element.getAttribute('content');
      if (author && author.trim()) {
        return author.trim();
      }
    }
  }

  return null;
}

function extractPublishDate(document: Document): string | null {
  const dateSelectors = [
    '[property="article:published_time"]',
    '[name="publication_date"]',
    'time[datetime]',
    '.publish-date',
    '.post-date',
    '.date'
  ];

  for (const selector of dateSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const dateValue = element.getAttribute('datetime') || 
                       element.getAttribute('content') || 
                       element.textContent;
      if (dateValue && dateValue.trim()) {
        return dateValue.trim();
      }
    }
  }

  return null;
}
