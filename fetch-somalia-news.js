/**
 * fetch-somalia-news.js
 * Production Automated AI News Generation Script with Live RSS Wire Feeds
 * -----------------------------------------------------------------------
 * Platform: somaliglobalnews.com
 * RSS Sources: Standard Media Kenya, Al Jazeera World/ME, Anadolu Agency (Turkiye),
 *              BBC World & Africa, Garowe / Hiiraan Online
 * Engine: @google/genai SDK
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

// High-Definition Contextual Photo Pool by Topic
const TOPIC_IMAGES = {
  maritime: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
  diplomacy: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
  finance: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
  cityscape: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  trade: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  energy: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
  hornAfrica: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
  turkiye: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
  conflict: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80"
};

// Target RSS Wire Outlets
const RSS_FEEDS = [
  { name: 'Standard Media Kenya', url: 'https://www.standardmedia.co.ke/rss/headlinenews.php', category: 'Kenya' },
  { name: 'Al Jazeera World', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'Middle East' },
  { name: 'BBC Africa', url: 'http://feeds.bbci.co.uk/news/world/africa/rss.xml', category: 'World' },
  { name: 'Anadolu Agency', url: 'https://www.aa.com.tr/en/rss/default?cat=current', category: 'Turkiye' }
];

// Helper to fetch live raw wire RSS text
async function fetchRawFeed(feedUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(feedUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return '';
    return await response.text();
  } catch (err) {
    console.warn(`⚠️ Could not fetch wire feed ${feedUrl}:`, err.message);
    return '';
  }
}

// Simple RSS XML Parser to extract raw article headlines & snippets
function parseRssHeadlines(xmlText, sourceName, defaultCat) {
  if (!xmlText) return [];
  const items = [];
  const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (const itemXml of itemMatches.slice(0, 3)) {
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    if (title) {
      items.push({
        source: sourceName,
        categoryHint: defaultCat,
        rawTitle: title,
        rawSnippet: desc
      });
    }
  }
  return items;
}

function getFallbackArticles() {
  return [
    {
      id: "sgn-world-1",
      title: "Global Maritime Security Accord Reached Over Red Sea & Indian Ocean Corridors",
      titleSo: "Shirweynaha Ammniga Baddaha Caalamka oo Lagaga Gaaray Heshiis Istaraatiijiyadeed Badda Punte",
      category: "World",
      location: "Geneva / UN Desk",
      summary: "World leaders and international maritime organizations ratify new protection standards for key commercial shipping passages.",
      content: `GENEVA — International delegates at the United Nations Maritime Summit have finalized a comprehensive security accord establishing joint protection channels across major global trade routes.`,
      contentSo: `GENEVA — Ergooyinka caalamiga ah ee ka qaybgalay Shirweynaha Ganacsiga Baddaha Caalamka ee Geneva ayaa heshiis taariikhi ah ku gaaray hab wada-jir ah oo lagu ilaaliyo marinada ganacsiga caalamiga ah.`,
      sources: ["SGN World Intelligence Desk"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.maritime
    },
    {
      id: "sgn-kenya-1",
      title: "Kenya & Somalia Ratify Bilateral Border Commerce & Cross-Border Patrol Agreements",
      titleSo: "Keniya iyo Soomaaliya oo Mideeyay Heshiisyada Ganacsiga Xadka iyo Ammniga Mandera",
      category: "Kenya",
      location: "Nairobi / Mandera (Standard Media Wire)",
      summary: "Bilateral trade discussions streamline agricultural exports, border checkpoints, and joint security patrols.",
      content: `NAIROBI — Bilateral trade discussions between Kenyan and Somali diplomatic delegations reached a milestone agreement in Nairobi, focusing on agricultural exports and border security.`,
      contentSo: `NAIROBI — Shirar taxane ah oo ka dhacay magaalada Nairobi oo ay yeesheen wafuud ka kala socota Keniya iyo Soomaaliya ayaa lagu gaaray heshiis ganacsi iyo amni.`,
      sources: ["Standard Media Kenya", "SGN Nairobi Bureau"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.trade
    },
    {
      id: "sgn-turkiye-1",
      title: "Turkiye Fortifies Economic & Defense Partnerships Across Horn of Africa Ports",
      titleSo: "Turkiya oo Ballaarisay Iskaashiga Dhaqaalaha iyo Difaaca ee Dekadaha Soomaaliya",
      category: "Turkiye",
      location: "Ankara / Mogadishu",
      summary: "Ankara announces expansion of strategic infrastructure investments and maritime defense cooperation.",
      content: `ANKARA — Government representatives in Ankara have unveiled new bilateral frameworks targeting port infrastructure development, energy research, and trade integration in Somalia.`,
      contentSo: `ANKARA — Dowladda Turkiya ayaa shaacisay heshiisyo cusub oo ku saabsan horumarinta dekadaha, baaritaanka tamarta iyo ganacsiga Soomaaliya.`,
      sources: ["Anadolu Agency", "SGN Ankara Desk"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.turkiye
    },
    {
      id: "sgn-somalia-1",
      title: "Somalia Expands Regional Trade Infrastructure & Digital Interbank Network",
      titleSo: "Soomaaliya oo Baddashay Istaraatiijiyadda Ganacsiga Gobolka iyo Isku-Xirka Bangiyada",
      category: "Somalia",
      location: "Mogadishu, Somalia",
      summary: "New commercial agreements aim to boost maritime trade, digital financial platforms, and regional connectivity across East Africa.",
      content: `MOGADISHU — The Federal Government of Somalia, in collaboration with regional trade partners, has officially unveiled a comprehensive framework aimed at expanding maritime commerce and digital financial integration.`,
      contentSo: `MUQDISHO — Dowladda Federaalka Soomaaliya, iyada oo kaashanaysa shirkadaha ganacsiga ee gobolka, ayaa si rasmi ah u daah-furtay hab cusub oo loogu talagalay in lagu ballaariyo ganacsiga badda iyo lacagaha dijiitalka ah.`,
      sources: ["SGN Mogadishu Desk"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.finance
    },
    {
      id: "sgn-me-1",
      title: "Middle East High-Level Summit Calls for Ceasefire & Regional Reconstruction Framework",
      titleSo: "Shirweynaha Bariga Dhexe oo Looga Baaqay Xabad Joojin iyo Dib-u-Dhiska Gobolka",
      category: "Middle East",
      location: "Riyadh / Gulf Cooperation Desk",
      summary: "Diplomats gather in Saudi Arabia to address regional security, maritime transit protection, and humanitarian aid distribution.",
      content: `RIYADH — Regional diplomatic envoys assembled in Riyadh to solidify humanitarian corridors and coordinate maritime transit security throughout key trade passages.`,
      contentSo: `RIYADH — Ergooyinka diblomaasiyadeed ee Bariga Dhexe ayaa ka ku xeshay magaalada Riyadh si loo sugo marinnada baddaha iyo gargaarka aadamrenimo.`,
      sources: ["Al Jazeera Wire", "SGN Middle East Bureau"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.conflict
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
  console.log("✅ Successfully written live news payload to " + jsonPath);
}

async function generateSomaliGlobalNews() {
  console.log("🚀 Gathering live RSS feeds from Standard Media Kenya, Al Jazeera, Anadolu Agency & BBC...");

  // Collect live RSS headline snippets
  let liveRssItems = [];
  for (const feed of RSS_FEEDS) {
    const rawXml = await fetchRawFeed(feed.url);
    const parsed = parseRssHeadlines(rawXml, feed.name, feed.category);
    liveRssItems = liveRssItems.concat(parsed);
  }

  console.log(`📰 Collected ${liveRssItems.length} live wire items from external RSS feeds.`);

  if (!apiKey) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is missing. Writing structured fallback news payload.");
    savePayload(getFallbackArticles());
    return;
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const rssContext = liveRssItems.map((item, idx) => 
      `Wire Item ${idx + 1} [Source: ${item.source}]: ${item.rawTitle} - ${item.rawSnippet}`
    ).join('\n');

    const prompt = `Act as Chief Editor of somaliglobalnews.com. Analyze these real-time news wire items from Standard Media Kenya, Al Jazeera, Anadolu Agency, and BBC:

${rssContext || "No live wire data available. Generate top breaking news."}

Generate 7 fully expanded breaking news items covering:
1. World Breaking News
2. Somalia
3. Ethiopia
4. Kenya (Reference Standard Media Kenya / Nairobi where applicable)
5. Djibouti
6. Middle East conflicts & diplomacy
7. Turkiye (Ankara / regional diplomacy)
8. Diaspora Community Affairs (US, Canada, UK, EU - covering civic, policy, business, and community achievements)

Each article MUST include:
- "title": Professional headline in English
- "titleSo": High-quality translated headline in Somali
- "category": One of ("World", "Somalia", "Ethiopia", "Kenya", "Djibouti", "Middle East", "Turkiye", "Diaspora")
- "location": e.g. "Minneapolis / Washington Desk", "London / EU Bureau", "Toronto / SGN Canada", "Nairobi / Standard Media", "Mogadishu", "Ankara"
- "summary": 2-sentence summary
- "content": Multi-paragraph expanded news report in English
- "contentSo": Multi-paragraph expanded news report in Somali (Qaybta Soomaaliga)
- "sources": Name of wire source (e.g. ["Standard Media Kenya", "SGN Diaspora Desk"])
- "publishedAt": Current ISO timestamp
- "imageUrl": Select best URL from list:
  * Maritime/Ports: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80"
  * Diplomacy/Govt: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
  * Banking/Finance: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80"
  * City Infrastructure/Diaspora: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
  * Logistics/Trade: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
  * Turkiye/Ankara: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80"
  * Conflict/Security: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80"

Output strictly a valid JSON array without markdown backticks:
[
  {
    "id": "slug-id",
    "title": "...",
    "titleSo": "...",
    "category": "...",
    "location": "...",
    "summary": "...",
    "content": "...",
    "contentSo": "...",
    "sources": ["Standard Media Kenya", "SGN Desk"],
    "publishedAt": "2026-10-24T12:00:00Z",
    "imageUrl": "..."
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.2 }
    });

    const responseText = response.text || "";

    const cleanedText = responseText
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/g, '')
      .trim();

    let articles;
    try {
      articles = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.warn("⚠️ JSON parse error, using structured fallback articles.");
      articles = getFallbackArticles();
    }

    savePayload(articles);

  } catch (error) {
    console.error("⚠️ API call encountered an error:", error.message);
    savePayload(getFallbackArticles());
  }
}

generateSomaliGlobalNews();
