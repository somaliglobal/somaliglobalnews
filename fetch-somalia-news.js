
/**
 * fetch-somalia-news.js
 * Production Automated AI News Generation Script
 * -----------------------------------------------------------------------
 * Platform: somaliglobalnews.com
 * Output: public/data/news.json
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'public', 'data');

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
      imageUrl: "[https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80)"
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
      imageUrl: "[https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80)"
    }
  ];
}

function savePayload(articles) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
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

function cleanMarkdownJson(text) {
  let cleaned = text.trim();
  // Using \x60 for backticks to completely prevent copy-paste formatting issues
  const tick3The error is caused by hidden line breaks (`\n`) being injected into the quote marks (`"`) when copying the markdown snippet.

Here is a version of **`fetch-somalia-news.js`** that contains **zero newline strings, zero quotes with backticks, and zero regex patterns**. It uses `String.fromCharCode(96)` for backticks so literal line breaks or backticks can never break JavaScript parsing.

```javascript
/**
 * fetch-somalia-news.js
 * Production Automated AI News Generation Script
 * -----------------------------------------------------------------------
 * Platform: somaliglobalnews.com
 * Output: public/data/news.json
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'public', 'data');

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
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
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

function cleanMarkdownJson(text) {
  let cleaned = text.trim();
  const bt = String.fromCharCode(96);
  const tripleBt = bt + bt + bt;
  
  if (cleaned.startsWith(tripleBt + "json")) {
    cleaned = cleaned.substring(tripleBt.length + 4);
  } else if (cleaned.startsWith(tripleBt)) {
    cleaned = cleaned.substring(tripleBt.length);
  }
  if (cleaned.endsWith(tripleBt)) {
    cleaned = cleaned.substring(0, cleaned.length - tripleBt.length);
  }
  return cleaned.trim();
}

async function main() {
  try {
    console.log("🚀 Starting news aggregation for somaliglobalnews.com...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. Using fallback news data.");
      savePayload(getFallbackArticles());
      return;
    }

    const promptText = "Act as Chief Editor of somaliglobalnews.com. Output ONLY a raw JSON array of 5 news articles regarding Somalia and the Somali diaspora. Do not include markdown code block syntax. Format: [{\"id\":\"slug\",\"title\":\"Title\",\"category\":\"Economy\",\"location\":\"Mogadishu\",\"summary\":\"Summary text\",\"content\":\"Full content\",\"sources\":[\"SGN Desk\"],\"publishedAt\":\"2026-10-23T00:00:00Z\",\"imageUrl\":\"https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80\"}]";

    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!res.ok) {
      console.warn("⚠️ API call returned status " + res.status + ". Using fallback news.");
      savePayload(getFallbackArticles());
      return;
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanedText = cleanMarkdownJson(rawText);

    let articles;
    try {
      articles = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.warn("⚠️ JSON parse error. Using fallback articles.");
      articles = getFallbackArticles();
    }

    savePayload(articles);

  } catch (error) {
    console.error("⚠️ Execution error caught:", error.message);
    savePayload(getFallbackArticles());
  }
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error("⚠️ Global error caught:", err);
  savePayload(getFallbackArticles());
  process.exit(0);
});
```

### Steps:
1. Open `fetch-somalia-news.js` in GitHub.
2. Select all and delete everything.
3. Paste this exact code.
4. Click **Commit changes...** and re-run your workflow.
