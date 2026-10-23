/**
 * fetch-somalia-news.js
 * Production Automated AI News Generation Script
 * -----------------------------------------------------------------------
 * Platform: somaliglobalnews.com
 * Output: public/data/news.json
 */

const fs = require('fs');
const path = require('path');

// Ensure output directory exists
const DATA_DIR = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read Gemini API key from environment
const apiKey = process.env.GEMINI_API_KEY;

function getFallbackArticles() {
  return [
    {
      id: "sgn-breaking-" + Date.now(),
      title: "Somalia Expands Regional Trade & Infrastructure Initiatives",
      category: "Economy",
      location: "Mogadishu, Somalia",
      summary: "New commercial and infrastructural agreements aim to boost maritime trade, digital financial platforms, and regional connectivity across East Africa.",
      content: "Somalia continues its strategic development roadmap focusing on economic resilience, digital transaction infrastructure, and regional trade integration.",
      sources: ["SGN Network Desk"],
      publishedAt: new Date().toISOString(),
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "sgn-diaspora-" + Date.now(),
      title: "Global Somali Diaspora Innovation Hub Expands Digital Investment",
      category: "Diaspora",
      location: "London, UK",
      summary: "Delegates gathered to discuss cross-border investment, venture funding, renewable energy initiatives, and diaspora-backed educational technology.",
      content: "Entrepreneurs and community leaders from North America and Europe highlighted new venture capital initiatives focused on tech and economic development.",
      sources: ["SGN Diaspora Desk"],
      publishedAt: new Date().toISOString(),
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
    }
  ];
}

function savePayload(articles) {
  const payload = {
    lastUpdated: new Date().toISOString(),
    site: "somaliglobalnews.com",
    count: articles.length,
    articles: articles
  };
  const jsonPath = path.join(DATA_DIR, 'news.json');
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log("✅ Successfully written news payload to " + jsonPath);
}

async function generateSomaliGlobalNews() {
  console.log("🚀 Starting news aggregation for somaliglobalnews.com...");

  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing. Saving fallback dataset.");
    savePayload(getFallbackArticles());
    return;
  }

  try {
    const promptText = `Act as Chief Editor of somaliglobalnews.com. Output ONLY a valid JSON array of 5 breaking news items regarding Somalia and the Somali diaspora with this structure:
[
  {
    "id": "slug-id",
    "title": "Article Title",
    "category": "Economy",
    "location": "Mogadishu",
    "summary": "Short 2 sentence summary",
    "content": "Full article body content",
    "sources": ["SGN Desk"],
    "publishedAt": "2026-10-23T00:00:00Z",
    "imageUrl": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
  }
]`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let cleanedText = rawText.trim();
    cleanedText = cleanedText.replace(/^
```(?:json)?/i, '').replace(/```$/g, '').trim();

    let articles;
    try {
      articles = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.warn("⚠️ JSON parse error, using standard fallback dataset.");
      articles = getFallbackArticles();
    }

    savePayload(articles);

  } catch (error) {
    console.error("⚠️ API call issue:", error.message);
    savePayload(getFallbackArticles());
  }
}

generateSomaliGlobalNews();
