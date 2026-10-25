const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

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
            title: "Ankara and Mogadishu Strengthen Defense, Maritime Security, and Economic Pacts",
            title_so: "Ankara iyo Muqdisho oo Adkeeyey Heshiisyada Difaaca, Amniga Badda iyo Dhaqaalaha",
            category: "Somalia",
            location: "Mogadishu / Ankara Bureau",
            summary: "Turkey and Somalia deepen strategic bilateral cooperation focusing on naval patrol agreements, maritime economic zones, and infrastructure development.",
            summary_so: "Turkiga iyo Soomaaliya ayaa sii qoto dheereeyay iskaashiga istiraatiijiyadeed ee ku aaddan ilaalinta badda, difaaca iyo horumarinta kaabayaasha dhaqaalaha.",
            content: "MOGADISHU — High-level delegations from Mogadishu and Ankara have reviewed robust bilateral pacts encompassing joint maritime security, naval defense training, and economic investments. Turkish defense firms continue working closely with Somali federal institutions to secure vital shipping lanes and expand commercial port capacity along the Indian Ocean coast. Both governments emphasized mutual commitment to regional stability, counter-terrorism operations, and long-term economic prosperity.\n\nIn tandem with defense agreements, trade volume between the two nations has witnessed steady growth, with Turkish investments spanning education, infrastructure construction, and healthcare modernization across the Somali federal states.",
            content_so: "MUQDISHO — Wufuud ka socota dowladaha Soomaaliya iyo Turkiga ayaa dib u eegis ku sameeyay heshiisyada iskaashi ee labada dal oo ay ku jiraan amniga badda, tababarka ciidamada iyo maalgashiga dhaqaalaha. Shirkadaha difaaca ee Turkiga ayaa si dhow u la shaqeynaya hay'adaha federaalka Soomaaliya si loo sugo amniga marin-biyoodka muhiimka ah.\n\nDhanka kale, ganacsiga labada dal ayaa kor u kacay iyadoo maalgashiga Turkigu saameeyay dhinacyada waxbarashada, dhismaha waddooyinka iyo caafimaadka.",
            imageUrl: CATEGORY_IMAGES.Somalia,
            publishedAt: new Date().toISOString()
        },
        {
            id: "art-2",
            title: "Regional Diplomacy and Security: Monitoring Somaliland Diplomatic Engagement and Regional Reactions",
            title_so: "Diblomaasiyadda Geeska Afrika: Korjoogteynta Xiriirka Somaliland iyo Aragtida Gobolka",
            category: "World",
            location: "Addis Ababa / Hargeisa Desk",
            summary: "Diplomatic circles closely monitor developments regarding Somaliland international recognition debates, bilateral understandings, and neighboring Horn of Africa responses.",
            summary_so: "Waddamada Gobolka iyo Beesha Caalamka ayaa si dhow u la socda horumarka ku aaddan dooda aqoonsiga diblomaasiyadeed ee Somaliland iyo jawaabaha dalalka deriska ah.",
            content: "ADDIS ABABA — Diplomatic analysts across the Horn of Africa are closely evaluating ongoing discussions surrounding Somaliland's international diplomatic engagements, prospective bilateral understandings, and regional sovereignty debates. Neighboring states, including federal authorities in Mogadishu, Ethiopia, Djibouti, and Kenya, continue to emphasize territorial integrity, stability, and peaceful dialogue across the region.\n\nInternational observers from the African Union, Arab League, and Western diplomatic missions have reiterated calls for constructive diplomatic engagement, adherence to international law, and regional consensus to prevent escalations and safeguard Horn of Africa trade corridors.",
            content_so: "ADDIS ABABA — Falanqeeyayaasha diblomaasiyadeed ee Geeska Afrika ayaa si dhow u qiimeynaya wadahadallada ku saabsan dhaqdhaqaaqyada diblomaasiyadeed ee Somaliland iyo mowqifyada waddamada deriska ah.\n\nDalalka deriska ah sida Soomaaliya, Itoobiya, Jabuuti iyo Kenya ayaa mar walba adkeeya in la ilaaliyo midnimada dhulka iyo xasilloonida gobolka. Beesha caalamka ayaa ku baaqday wadahadal dastuuri ah iyo deganaansho.",
            imageUrl: CATEGORY_IMAGES.Ethiopia,
            publishedAt: new Date().toISOString()
        },
        {
            id: "art-3",
            title: "Middle East Maritime Security: Red Sea Trade Corridors, Yemen Developments, and Strait of Hormuz Dynamics",
            title_so: "Amniga Badda Bariga Dhexe: Marinada Badda Cas, Xaaladda Yemen iyo Hormuz",
            category: "Middle East",
            location: "Riyadh / Sana'a Bureau",
            summary: "Naval coalitions and international shipping lines navigate evolving security protocols in the Red Sea, Bab el-Mandeb, and the Strait of Hormuz.",
            summary_so: "Isbahaysiga badda iyo shirkadaha maraakiibta caalamiga ah ayaa la qabsanaya xeerarka amniga ee Badda Cas iyo marin-biyoodka Hormuz.",
            content: "RIYADH — International maritime shipping agencies and regional defense commands remain on high alert across the Red Sea, the Bab el-Mandeb strait, and the Strait of Hormuz. Escalating geopolitical tensions involving Yemen and maritime transit security have necessitated continuous monitoring by GCC states, Western naval task forces, and global energy carriers.\n\nEnergy analysts warn that maintaining open sea lanes of communication is paramount for global oil supply stability, international commerce, and Red Sea economic corridors connecting Asia and Europe via the Suez Canal.",
            content_so: "RIYADH — Hay'adaha maraakiibta caalamiga ah iyo talisyada difaaca ee gobolka ayaa ku jira feejignaan sare oo ku aaddan Badda Cas, marin-biyoodka Bab el-Mandeb iyo Hormuz.\n\nKhubarada tamarta ayaa ka digay in ilaalinta marinada badda ay muhiim u tahay xasiloonida sahayda shidaalka caalamiga ah iyo ganacsiga isku xira Aasiya iyo Yurub.",
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
            content: "SPORTS DESK — A massive weekend of global sports action delivers decisive results across football and basketball leagues worldwide.\n\n⚽ PREMIER LEAGUE:\n• Arsenal 3 - 1 Chelsea\n• Manchester City 2 - 1 Tottenham Hotspur\n• Liverpool 2 - 0 Aston Villa\n\n⚽ LA LIGA:\n• Real Madrid 3 - 1 Barcelona\n• Atletico Madrid 2 - 0 Valencia\n\n⚽ SERIE A:\n• Inter Milan 2 - 1 AC Milan\n• Juventus 1 - 0 Napoli\n\n🏀 NBA RESULTS:\n• Los Angeles Lakers 122 - 115 Boston Celtics\n• Golden State Warriors 118 - 112 Denver Nuggets\n• Oklahoma City Thunder 126 - 110 New York Knicks\n\n🏈 NFL WEEKEND SCORES:\n• Kansas City Chiefs 31 - 28 Buffalo Bills\n• Philadelphia Eagles 24 - 17 Dallas Cowboys",
            content_so: "SPORTS DESK — Todobaadkan waxaa dhacay ciyaaro aad u xiiso badan oo ka tirsan horyaallada kubadda cagta iyo kolayga adduunka.\n\n⚽ PREMIER LEAGUE:\n• Arsenal 3 - 1 Chelsea\n• Manchester City 2 - 1 Tottenham\n• Liverpool 2 - 0 Aston Villa\n\n⚽ LA LIGA:\n• Real Madrid 3 - 1 Barcelona\n\n⚽ SERIE A:\n• Inter Milan 2 - 1 AC Milan\n\n🏀 NBA:\n• Lakers 122 - 115 Celtics\n• Warriors 118 - 112 Nuggets",
            imageUrl: CATEGORY_IMAGES.Sports,
            publishedAt: new Date().toISOString()
        }
    ]
};

async function generateLatestNews() {
    const apiKey = process.env.GEMINI_API_KEY;
    const outputDir = path.join(__dirname, 'public', 'data');
    const outputPath = path.join(outputDir, 'news.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is missing. Writing default wire payload.");
        fs.writeFileSync(outputPath, JSON.stringify(DEFAULT_FALLBACK_PAYLOAD, null, 2));
        return;
    }

    console.log("Fetching and generating latest news wire feeds with Gemini 3.8 Flash...");

    try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are the chief editorial director for Somali Global News (SGN).
Search real-time world news sources (BBC, Al Jazeera, Reuters, France 24, Anadolu Agency, Al Arabiya, ESPN, Sky Sports) for today's top developments.

Generate a JSON object containing an array of 5 to 6 structured wire articles covering:
1. Somalia & Türkiye bilateral relations, defense, and economic agreements.
2. Somaliland international diplomatic engagements and regional responses from Horn of Africa neighbors (Ethiopia, Kenya, Djibouti).
3. Red Sea & Strait of Hormuz maritime security, Yemen developments, and trade corridors.
4. Sports Wire with latest match scores and results across Premier League, La Liga, Serie A, NBA, and NFL.
5. Diaspora news and global geopolitical developments.

CRITICAL REQUIREMENTS:
- Output MUST be valid JSON only (no markdown, no backticks).
- Every article MUST include:
  - "id": string
  - "title": English title
  - "title_so": Accurate Somali translation of title
  - "category": Exact match from ["Somalia", "Ethiopia", "Middle East", "Sports", "World", "Diaspora"]
  - "location": Bureau/Location string (e.g. "Mogadishu / Ankara Bureau", "Sports Desk")
  - "summary": Concise 2-sentence English summary
  - "summary_so": Accurate Somali translation of summary
  - "content": Detailed multi-paragraph English news article
  - "content_so": Detailed multi-paragraph Somali translation of full article

JSON FORMAT STRUCTURE:
{
  "updatedAt": "ISO Timestamp",
  "articles": [ ... ]
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        let responseText = response.text || '';
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
            responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        const parsedData = JSON.parse(responseText);

        if (parsedData.articles && Array.isArray(parsedData.articles)) {
            parsedData.articles = parsedData.articles.map((art, idx) => ({
                ...art,
                imageUrl: CATEGORY_IMAGES[art.category] || CATEGORY_IMAGES.Somalia,
                publishedAt: new Date().toISOString()
            }));

            parsedData.updatedAt = new Date().toISOString();
            fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2));
            console.log(`Successfully generated and saved ${parsedData.articles.length} news wire items.`);
        } else {
            throw new Error("Invalid schema structure returned from model");
        }

    } catch (err) {
        console.error("Error generating news wire:", err.message);
        console.log("Saving robust fallback wire dataset...");
        fs.writeFileSync(outputPath, JSON.stringify(DEFAULT_FALLBACK_PAYLOAD, null, 2));
    }
}

generateLatestNews();
