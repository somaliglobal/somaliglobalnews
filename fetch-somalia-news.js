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

// Ensure output directory exists
const DATA_DIR = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read Gemini API key from environment
const apiKey = process.env.GEMINI_API_KEY;

// High-Definition Contextual Photo Pool by Topic
const TOPIC_IMAGES = {
  maritime: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80", // Container ships & ports
  diplomacy: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80", // International press conference
  finance: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80", // Digital banking & charts
  cityscape: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", // Modern skyscrapers
  trade: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80", // Logistics center
  energy: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80", // Solar panels / clean energy
  hornAfrica: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80" // East Africa landscape
};

function getFallbackArticles() {
  return [
    {
      id: "sgn-world-1",
      title: "Global Maritime Security Summit Reaches Accord on Critical Corridors",
      titleSo: "Shirweynaha Ammniga Baddaha Caalamka oo Lagaga Gaaray Heshiis Istaraatiijiyadeed",
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
      id: "sgn-kenya-1",
      title: "Kenya & Somalia Ratify Border Commerce Protocols and Security Agreements",
      titleSo: "Keniya iyo Soomaaliya oo Mideeyay Heshiisyada Ganacsiga Xadka iyo Ammniga",
      category: "Kenya",
      location: "Nairobi / Mandera",
      summary: "Bilateral trade discussions streamline agricultural exports, border checkpoints, and joint security patrols.",
      content: `NAIROBI — Bilateral trade discussions between Kenyan and Somali diplomatic delegations reached a milestone agreement in Nairobi.`,
      contentSo: `NAIROBI — Shirar taxane ah oo ka dhacay magaalada Nairobi oo ay yeesheen wafuud ka kala socota Keniya iyo Soomaaliya ayaa lagu gaaray heshiis.`,
      sources: ["SGN Nairobi Bureau"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.trade
    },
    {
      id: "sgn-ethiopia-1",
      title: "Horn of Africa Diplomatic Forum Concludes Talks in Addis Ababa",
      titleSo: "Shirkii Diblomaasiyadda Geeska Afrika oo ku Soo Gaba-gaboobay Addis Ababa",
      category: "Ethiopia",
      location: "Addis Ababa, Ethiopia",
      summary: "Regional ministers address trade routes, transit infrastructure, and diplomatic resolutions during the annual forum.",
      content: `ADDIS ABABA — The annual Horn of Africa Diplomatic Forum concluded in Addis Ababa with regional representatives reaffirming commitments to sovereign dialogue.`,
      contentSo: `ADDIS ABABA — Shirweynaha Nabadda iyo Iskaashiga Geeska Afrika oo ka dhacay magaalada Addis Ababa ayaa lagu soo gaba-gabeeyay go'aamo.`,
      sources: ["SGN Addis Ababa Desk"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.diplomacy
    },
    {
      id: "sgn-djibouti-1",
      title: "Djibouti Port Authority Unveils Modernized Shipping & Logistics Terminal",
      titleSo: "Magaalada Jabuuti oo Soo Bandhigtay Xarun Cusub oo Laga Maamulo Dekadaha Badda Cas",
      category: "Djibouti",
      location: "Djibouti City, Djibouti",
      summary: "Djibouti launches state-of-the-art container tracking and maritime cargo facilities near Bab-el-Mandeb.",
      content: `DJIBOUTI CITY — The Port Authority of Djibouti has officially commissioned a modernized maritime cargo hub equipped with real-time tracking systems.`,
      contentSo: `MAGAALADA JABUUTI — Maamulka Dekadaha ee Jabuuti ayaa daah-furay kabayaal casri ah oo loogu talagalay maareynta xamuulka badda cas.`,
      sources: ["SGN Djibouti Bureau"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.maritime
    },
    {
      id: "sgn-me-1",
      title: "Gulf Consortium Directs Clean Energy Capital into Horn Ports",
      titleSo: "Maalgashadayasha Bariga Dhexe oo Maalgelinaya Mashariicda Tamarta Cusboonaata",
      category: "Middle East",
      location: "Riyadh / Abu Dhabi",
      summary: "Consortium commits $450M toward solar arrays, coastal desalination, and cold-chain storage across East Africa.",
      content: `RIYADH — Renewable energy investment firms from Saudi Arabia and the UAE have signed multi-billion dollar framework development agreements.`,
      contentSo: `RIYADH — Shirkado waaweyn oo ka socda Saudi Arabia iyo UAE ayaa saxiixay heshiisyo lagu maalgelinayo tamarta qorraxda.`,
      sources: ["SGN Middle East Bureau"],
      publishedAt: new Date().toISOString(),
      imageUrl: TOPIC_IMAGES.energy
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
  console.log("🚀 Starting global & regional news aggregation for somaliglobalnews.com...");

  if (!apiKey) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is missing. Writing standard fallback news payload.");
    savePayload(getFallbackArticles());
    return;
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Act as Chief Editor of somaliglobalnews.com. Generate 6 breaking news items covering World Breaking News, Somalia, Ethiopia, Kenya, Djibouti, Middle East, and Somali Diaspora. 

For the "imageUrl" field, choose the best matching URL from this list based on the subject matter:
- Maritime/Ports/Shipping: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80"
- Summit/Diplomacy/Govt: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
- Banking/Economy/Tech: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80"
- City Infrastructure/Buildings: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
- Logistics/Trade: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
- Solar/Energy/Water: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80"
- Regional Landscape/Nature: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"

Output strictly a JSON array without markdown formatting:
[
  {
    "id": "slug-id",
    "title": "Article Title in English",
    "titleSo": "Article Title in Somali",
    "category": "World",
    "location": "Geneva / Mogadishu / Nairobi / Riyadh",
    "summary": "Short 2 sentence summary",
    "content": "Full multi-paragraph article body in English",
    "contentSo": "Full multi-paragraph article body in Somali",
    "sources": ["SGN Global Desk"],
    "publishedAt": "2026-10-24T00:00:00Z",
    "imageUrl": "https://images.unsplash.com/..."
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
