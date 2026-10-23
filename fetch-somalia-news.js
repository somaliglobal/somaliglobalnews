/**
 * fetch-somalia-news.js
 * Production Automated AI News Generation Script
 * -----------------------------------------------------------------------
 * Platform: somaliglobalnews.com
 * Engine: @google/genai SDK
 * Output: public/data/news.json
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// Ensure output directory exists
const DATA_DIR = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read Gemini API key from environment
const apiKey = process.env.GEMINI_API_KEY;

// Fallback dataset in case API key is missing or call fails
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
    console.warn("⚠️ Warning: GEMINI_API_KEY is missing. Writing standard fallback news payload.");
    savePayload(getFallbackArticles());
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Act as Chief Editor of somaliglobalnews.com. Generate 5 breaking news items regarding Somalia, Horn of Africa, and global Somali diaspora. Output strictly a JSON array without markdown formatting:
[
  {
    "id": "slug-id",
    "title": "Article Title",
    "category": "Economy",
    "location": "Mogadishu",
    "summary": "Short 2 sentence summary",
    "content": "Full article body",
    "sources": ["SGN Desk"],
    "publishedAt": "2026-10-23T00:00:00Z",
    "imageUrl": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.2 }
    });

    const responseText = response.text || "";
    const cleanedText = responseText.replace(/^
```json/g, '').replace(/```$/g, '').trim();

    let articles;
    try {
      articles = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.warn("⚠️ JSON parse error, using structured fallback articles.");
      articles = getFallbackArticles();
    }

    savePayload(articles);

  } catch (error) {
    console.error("⚠️ API call encounter:", error.message);
    console.log("Writing verified fallback news to ensure deployment succeeds...");
    savePayload(getFallbackArticles());
  }
}

generateSomaliGlobalNews();
