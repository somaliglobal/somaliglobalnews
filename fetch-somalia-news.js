const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CATEGORY_IMAGES = {
    Somalia: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    Ethiopia: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80",
    "Middle East": "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80",
    Diaspora: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    Sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    World: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80"
};

const DEFAULT_FALLBACK_PAYLOAD = {
    updatedAt: new Date().toISOString(),
    articles: [
        {
            id: "art-1",
            title: "Ankara and Mogadishu Deepen Strategic Defense and Maritime Security Agreements",
            title_so: "Ankara iyo Muqdisho oo Adkeeyey Heshiisyada Difaaca iyo Amniga Badda",
            category: "Somalia",
            location: "Mogadishu / Ankara Bureau",
            summary: "Turkey and Somalia strengthen bilateral cooperation focusing on naval patrol agreements, economic investments, and regional stability.",
            summary_so: "Turkiga iyo Soomaaliya ayaa sii qoto dheereeyay iskaashiga istiraatiijiyadeed ee ku aaddan ilaalinta badda iyo maalgashiga dhaqaalaha.",
            content: "MOGADISHU — High-level delegations from Mogadishu and Ankara have reviewed robust bilateral pacts encompassing joint maritime security, naval defense training, and economic investments. Turkish defense firms continue working closely with Somali federal institutions to secure vital shipping lanes and expand commercial port capacity along the Indian Ocean coast. Both governments emphasized mutual commitment to regional stability, counter-terrorism operations, and long-term economic prosperity.\n\nIn tandem with defense agreements, trade volume between the two nations has witnessed steady growth, with Turkish investments spanning education, infrastructure construction, and healthcare modernization across the Somali federal states.",
            content_so: "MUQDISHO — Wufuud ka socota dowladaha Soomaaliya iyo Turkiga ayaa dib u eegis ku sameeyay heshiisyada iskaashi ee labada dal oo ay ku jiraan amniga badda, tababarka ciidamada iyo maalgashiga dhaqaalaha. Shirkadaha difaaca ee Turkiga ayaa si dhow u la shaqeynaya hay'adaha federaalka Soomaaliya si loo sugo amniga marin-biyoodka muhiimka ah.",
            imageUrl: CATEGORY_IMAGES.Somalia,
            publishedAt: new Date().toISOString()
        },
        {
            id: "art-2",
            title: "Regional Diplomacy: Monitoring Somaliland Developments and Neighboring Horn of Africa Reactions",
            title_so: "Diblomaasiyadda Geeska Afrika: Korjoogteynta Xiriirka Somaliland iyo Aragtida Deriska",
            category: "World",
            location: "Addis Ababa / Hargeisa Desk",
            summary: "Diplomatic circles closely monitor developments regarding Somaliland international recognition debates, bilateral understandings, and neighboring Horn responses.",
            summary_so: "Waddamada Gobolka iyo Beesha Caalamka ayaa si dhow u la socda horumarka ku aaddan dooda aqoonsiga diblomaasiyadeed ee Somaliland.",
            content: "ADDIS ABABA — Diplomatic analysts across the Horn of Africa are closely evaluating ongoing discussions surrounding Somaliland's international diplomatic engagements, prospective bilateral understandings, and regional sovereignty debates. Neighboring states, including federal authorities in Mogadishu, Ethiopia, Djibouti, and Kenya, continue to emphasize territorial integrity, stability, and peaceful dialogue across the region.",
            content_so: "ADDIS ABABA — Falanqeeyayaasha diblomaasiyadeed ee Geeska Afrika ayaa si dhow u qiimeynaya wadahadallada ku saabsan dhaqdhaqaaqyada diblomaasiyadeed ee Somaliland iyo mowqifyada waddamada deriska ah.",
            imageUrl: CATEGORY_IMAGES.Ethiopia,
            publishedAt: new Date().toISOString()
        },
        {
            id: "art-3",
            title: "Middle East Maritime Security: Red Sea Trade Corridors, Yemen Developments, and Strait of Hormuz",
            title_so: "Amniga Badda Bariga Dhexe: Marinada Badda Cas, Xaaladda Yemen iyo Hormuz",
            category: "Middle East",
            location: "Riyadh / Sana'a Bureau",
            summary: "Naval coalitions and international shipping lines navigate evolving security protocols in the Red Sea, Bab el-Mandeb, and the Strait of Hormuz.",
            summary_so: "Isbahaysiga badda iyo shirkadaha maraakiibta caalamiga ah ayaa la qabsanaya xeerarka amniga ee Badda Cas iyo marin-biyoodka Hormuz.",
            content: "RIYADH — International maritime shipping agencies and regional defense commands remain on high alert across the Red Sea, the Bab el-Mandeb strait, and the Strait of Hormuz. Escalating geopolitical tensions involving Yemen and maritime transit security have necessitated continuous monitoring by GCC states, Western naval task forces, and global energy carriers.",
            content_so: "RIYADH — Hay'adaha maraakiibta caalamiga ah iyo talisyada difaaca ee gobolka ayaa ku jira feejignaan sare oo ku aaddan Badda Cas, marin-biyoodka Bab el-Mandeb iyo Hormuz.",
            imageUrl: CATEGORY_IMAGES["Middle East"],
            publishedAt: new Date().toISOString()
        },
        {
            id: "art-4",
            title: "Global Sports Wire: Comprehensive Weekend Scores — NBA, NFL, Premier League, La Liga, and Serie A",
            title_so: "Natiijooyinka Ciyaaraha Adduunka: NBA, NFL, Premier League, La Liga iyo Serie A",
            category: "Sports",
            location: "Sports Desk",
            summary: "Complete breakdown of weekend fixtures, match results, standings, and playoff pushes across the NBA, NFL, Premier League, La Liga, and Serie A.",
            summary_so: "Warbixin buuxda oo ku saabsan natiijooyinka ciyaaraha NBA, NFL, Premier League, La Liga iyo Serie A ee todobaadkan.",
            content: "SPORTS DESK — A massive weekend of global sports action delivers decisive results across football and basketball leagues worldwide.\n\n⚽ PREMIER LEAGUE:\n• Arsenal 2 - 1 Chelsea\n• Manchester City 3 - 0 Tottenham Hotspur\n• Liverpool 1 - 1 Aston Villa\n\n⚽ LA LIGA:\n• Real Madrid 2 - 0 Barcelona\n• Atletico Madrid 3 - 1 Valencia\n\n⚽ SERIE A:\n• Inter Milan 1 - 0 AC Milan\n• Juventus 2 - 1 Napoli\n\n🏀 NBA RESULTS:\n• Los Angeles Lakers 118 - 112 Boston Celtics\n• Golden State Warriors 124 - 119 Denver Nuggets\n\n🏈 NFL SCORES:\n• Kansas City Chiefs 27 - 24 Buffalo Bills",
            content_so: "SPORTS DESK — Todobaadkan waxaa dhacay ciyaaro aad u xiiso badan oo ka tirsan horyaallada kubadda cagta iyo kolayga adduunka.\n\n⚽ PREMIER LEAGUE: Arsenal 2-1 Chelsea • Man City 3-0 Tottenham\n⚽ LA LIGA: Real Madrid 2-0 Barcelona\n⚽ SERIE A: Inter Milan 1-0 AC Milan\n🏀 NBA: Lakers 118-112 Celtics",
            imageUrl: CATEGORY_IMAGES.Sports,
            publishedAt: new Date().toISOString()
        }
    ]
};

async function generateLatestNews() {
    console.log("Fetching and generating the latest global and regional news using Gemini 3.8 Flash...");

    const prompt = `
    You are the Chief Editor and Wire Engine for "Somali Global News" (SGN Wire).
    Generate 6 breaking, high-impact news articles covering current events as of October 2026.
    
    You must cover the following categories:
    1. Somalia ("Somalia"): Somalia-Türkiye relations, defense agreements, security, and humanitarian updates.
    2. World / Horn of Africa ("World"): Somaliland diplomatic discussions, neighboring countries (Ethiopia, Kenya, Djibouti) relations.
    3. Middle East ("Middle East"): Yemen developments, Red Sea maritime corridors, and Strait of Hormuz dynamics.
    4. Sports ("Sports"): Complete summary of NBA, NFL, Premier League, La Liga, and Serie A scores and fixtures.
    5. Diaspora ("Diaspora"): Somali diaspora community news and achievements in North America and Europe.

    Return ONLY a valid JSON object matching this exact structure, with no markdown code block formatting around the JSON if possible (or standard pure JSON):
    {
      "updatedAt": "ISO timestamp",
      "articles": [
        {
          "id": "art-1",
          "title": "English headline",
          "title_so": "Somali translated headline",
          "category": "Somalia",
          "location": "Mogadishu Bureau",
          "summary": "Short 1-sentence English summary.",
          "summary_so": "Short 1-sentence Somali summary.",
          "content": "Detailed multi-paragraph English article text...",
          "content_so": "Detailed multi-paragraph Somali article text...",
          "imageUrl": "https://images.unsplash.com/photo-...",
          "publishedAt": "ISO timestamp"
        }
      ]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json'
            }
        });

        const rawText = response.text();
        const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJsonText);

        const targetDir = path.join(__dirname, 'public', 'data');
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.writeFileSync(path.join(targetDir, 'news.json'), JSON.stringify(parsedData, null, 2));
        console.log("Successfully generated and saved fresh news wire payload to public/data/news.json");
    } catch (error) {
        console.error("Error generating news with Gemini, falling back to robust offline payload:", error);
        
        const targetDir = path.join(__dirname, 'public', 'data');
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(path.join(targetDir, 'news.json'), JSON.stringify(DEFAULT_FALLBACK_PAYLOAD, null, 2));
        console.log("Saved robust fallback payload successfully.");
    }
}

generateLatestNews();
