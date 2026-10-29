const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const CATEGORY_IMAGES = {
    Somalia: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    "Horn of Africa": "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80",
    Ethiopia: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80",
    "Middle East": "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80",
    Europe: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    Americas: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80",
    Sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    World: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80"
};

async function generateLatestNews() {
    const apiKey = process.env.GEMINI_API_KEY;
    const outputDir = path.join(__dirname, 'public', 'data');
    const outputPath = path.join(outputDir, 'news.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Load existing news to preserve manual admin posts
    let existingData = { updatedAt: new Date().toISOString(), articles: [] };
    if (fs.existsSync(outputPath)) {
        try {
            existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        } catch (e) {
            console.warn("Could not parse existing news.json, initializing fresh structure.");
        }
    }

    // Preserve manual posts made through admin.html
    const manualArticles = (existingData.articles || []).filter(art => art.isManual === true);

    if (!apiKey) {
        console.warn("GEMINI_API_KEY missing. Keeping existing data.");
        return;
    }

    console.log("Fetching and generating latest news wire feeds with Gemini 2.5 Flash...");

    try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are the chief editorial director for Somali Global News (SGN).
Search real-time international news sources (BBC, Al Jazeera, Reuters, France 24, Anadolu Agency, Al Arabiya English) for today's top developments.

Generate a JSON array of 5 to 6 structured news articles covering:
1. Somalia & Türkiye bilateral pacts, defense, naval security, and trade investments.
2. Horn of Africa diplomatic engagements and regional developments (Ethiopia, Kenya, Djibouti).
3. Red Sea & Strait of Hormuz maritime security, Yemen developments, and commercial shipping.
4. Middle East regional geopolitics and diplomatic initiatives.
5. World & Diaspora news involving Somali communities in North America or Europe.
6. Weekend Global Sports Wire (Premier League, La Liga, Serie A, NBA).

CRITICAL REQUIREMENTS:
- Output MUST be valid JSON only.
- Strict newsdesk tone: SomaliGlobalNews:NewsDesk.
- Do NOT cite Horn Cable TV or Universal TV.
- Each article object MUST contain:
  - "id": unique string starting with "wire-"
  - "title": English headline
  - "title_so": Accurate Somali headline
  - "category": One of ["Somalia", "Horn of Africa", "Middle East", "Europe", "Americas", "Sports", "World"]
  - "location": Bureau location (e.g. "Mogadishu Bureau", "Ankara Desk", "Nairobi Bureau", "Washington Desk")
  - "summary": 2-sentence English summary
  - "summary_so": 2-sentence Somali summary
  - "content": 2-3 paragraph detailed news report in English
  - "content_so": 2-3 paragraph detailed news report in Af-Soomaali`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json"
            }
        });

        let responseText = (response.text || '').trim();
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        const arrayStart = responseText.indexOf('[');
        const arrayEnd = responseText.lastIndexOf(']');

        let freshArticles = [];
        if (jsonStart !== -1 && (arrayStart === -1 || jsonStart < arrayStart)) {
            const parsed = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
            freshArticles = parsed.articles || [];
        } else if (arrayStart !== -1) {
            freshArticles = JSON.parse(responseText.substring(arrayStart, arrayEnd + 1));
        }

        if (!Array.isArray(freshArticles) || freshArticles.length === 0) {
            throw new Error("Model returned invalid or empty articles list.");
        }

        const now = new Date().toISOString();
        const formattedFreshArticles = freshArticles.map((art, idx) => ({
            ...art,
            id: art.id || `wire-${Date.now()}-${idx}`,
            isManual: false,
            imageUrl: CATEGORY_IMAGES[art.category] || CATEGORY_IMAGES.Somalia,
            publishedAt: now
        }));

        // Merge: Manual articles stay at the very top, followed by automated wire stories
        const combinedArticles = [...manualArticles, ...formattedFreshArticles];

        const finalPayload = {
            updatedAt: now,
            articles: combinedArticles
        };

        fs.writeFileSync(outputPath, JSON.stringify(finalPayload, null, 2));
        console.log(`Successfully published ${formattedFreshArticles.length} automated wire stories, preserving ${manualArticles.length} manual stories.`);

    } catch (err) {
        console.error("Error generating news wire:", err.message);
        // Do not overwrite manual posts if the API fails
    }
}

generateLatestNews();
