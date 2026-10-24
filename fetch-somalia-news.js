const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

/**
 * Somali Global News Wire Generator
 * Uses Gemini API with Search Grounding to pull real-time news from:
 * BBC, Al Jazeera, Reuters, France 24, Anadolu Agency, and Al Arabiya English.
 */

// Verified topic-matched images (No Barack Obama or generic mismatched photos)
const CATEGORY_IMAGES = {
    Somalia: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    Ethiopia: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80",
    "Middle East": "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80",
    Diaspora: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    Sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    World: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80"
};

// Fallback articles in case of search failure or missing API key
const FALLBACK_ARTICLES = [
    {
        id: "art-fallback-1",
        title: "Somali Cabinet Approves National Port Security Modernization Initiative",
        title_so: "Golaha Wasiirada Soomaaliya Oo Anshixiyay Qorshaha Casriyeinta Amniga Dekadaha",
        category: "Somalia",
        location: "Mogadishu Desk",
        summary: "The federal cabinet has endorsed a new security and infrastructure strategy across maritime ports to bolster international trade and regional connectivity.",
        summary_so: "Golaha wasiirada ayaa ansixiyay qorshe cusub oo lagu ilaalinayo amnigiyada iyo kaabayaasha dekadaha Soomaaliya si loo horumariyo ganacsiga caalamiga ah.",
        content: "MOGADISHU — Somalia's Council of Ministers has formally approved a national port security modernization plan aimed at expanding trade facilities across the Mogadishu Port and coastal regions. Senior officials highlighted the collaboration with regional partners to streamline Customs operations and ensure safe maritime logistics.",
        content_so: "MOGADISHU — Golaha Wasiirada Soomaaliya ayaa si rasmi ah u ansixiyay qorshaha casriyeinta amniga dekadaha waxaana la filayaa inuu kordhiyo fursadaha ganacsiga. Wasiirada ayaa xusay in tallaabadan ay sare u qaadi doonto xiriirka ganacsi ee gobolka.",
        imageUrl: CATEGORY_IMAGES.Somalia,
        publishedAt: new Date().toISOString()
    },
    {
        id: "art-fallback-2",
        title: "Horn of Africa Diplomatic Forum Addresses Regional Security and Trade Partnerships",
        title_so: "Shirka D dibomaasiyadeed ee Geeska Afrika Oo Laguga Hadlay Amniga iyo Ganacsiga",
        category: "Ethiopia",
        location: "Addis Ababa Bureau",
        summary: "Regional envoys gathered in Addis Ababa to discuss ongoing bilateral trade pacts and peace initiatives across the Horn of Africa.",
        summary_so: "Wakiillada gobolka oo ku kulmay Addis Ababa ayaa ka wada hadlay heshiisyada ganacsiga iyo dadaallada nabadroolinta Geeska Afrika.",
        content: "ADDIS ABABA — Representatives from Eastern African nations met today to discuss infrastructure integration, joint trade initiatives, and regional conflict prevention strategies. The summit focused on bolstering cooperation between neighboring nations to enhance economic resiliency.",
        content_so: "ADDIS ABABA — Wakiillada waddamada Bariga Afrika ayaa maanta ku kulmay magaala-madaxda Itoobiya si ay uga wada hadlaan isku-xirka kaabayaasha dhaqaalaha iyo nabadda gobolka.",
        imageUrl: CATEGORY_IMAGES.Ethiopia,
        publishedAt: new Date().toISOString()
    },
    {
        id: "art-fallback-3",
        title: "European & Global Sports Wire: High-Stakes Fixtures & League Standings Update",
        title_so: "Natiijooyinka & Ciyaaraha Ugu Dambeeyay ee Horyaallada Yurub iyo Adduunka",
        category: "Sports",
        location: "Sports Desk",
        summary: "Premier League, Champions League, La Liga, Serie A, and NBA teams clash in crucial weekend matchups as championship races heat up.",
        summary_so: "Ciyaaraha Premier League, Champions League, La Liga, Serie A iyo NBA ayaa maraya meel aad u xasaasi ah iyadoo kooxaha ugu waaweyn ay u tartamayaan horyaallada.",
        content: "SPORTS DESK — The global sports calendar reaches a critical phase today with major football clubs across Europe battling for title dominance. Premier League contenders lock horns in pivotal derby fixtures, while La Liga and Serie A powerhouses finalize line-ups. Meanwhile in basketball, NBA playoff pushes continue with thrilling performances across both conferences.",
        content_so: "SPORTS DESK — Ciyaaraha kubadda cagta ee Yurub iyo horyaallada waaweyn sida Premier League, La Liga, Serie A iyo NBA ayaa maraya waqti xasaasi ah. Taageerayaasha kubadda cagta iyo kolayga ayaa si dhow ula socda natiijooyinka iyo kala sarreynta kooxaha ugu waaweyn.",
        imageUrl: CATEGORY_IMAGES.Sports,
        publishedAt: new Date().toISOString()
    }
];

async function generateNewsFeed() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!apiKey) {
        console.warn('GEMINI_API_KEY is missing. Generating fallback JSON data.');
        writeOutputPayload(FALLBACK_ARTICLES);
        return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the chief editor for Somali Global News Wire (SGN).
Search current breaking news reported today by BBC, Al Jazeera, Reuters, ESPN, Sky Sports, France 24, Anadolu Agency, and Al Arabiya English.

Cover 6 specific categories strictly:
1. Somalia (Mogadishu, trade, EAC, infrastructure)
2. Ethiopia (Addis Ababa, diplomacy, Horn of Africa)
3. Middle East (Yemen, Red Sea, Gulf GCC diplomacy)
4. Diaspora (London, Minnesota, European Somali communities)
5. Sports (Premier League, UEFA Champions League, La Liga, Serie A, NBA)
6. World (Global trade or geopolitics)

For each story:
- Category matching strictly one of: ["Somalia", "Ethiopia", "Middle East", "Diaspora", "Sports", "World"]
- English Title & Full Multiline Article
- Natural Somali Translation (title_so, summary_so, content_so)
- Location desk (e.g. "Mogadishu Desk", "Addis Ababa Bureau", "Riyadh Desk", "London Desk", "Sports Desk")`;

    const userPrompt = `Search today's breaking news across BBC, Al Jazeera, Reuters, ESPN, Sky Sports, France 24, and Anadolu for Somalia, Ethiopia, Middle East, Diaspora, Sports, and World. Generate 6 distinct article objects inside a JSON array under the "articles" key, including an up-to-date sports news item covering football or basketball leagues.`;

    try {
        console.log('Fetching multi-source news wire using Gemini API...');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: { parts: [{ text: systemPrompt }] },
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        articles: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: {
                                    id: { type: 'STRING' },
                                    title: { type: 'STRING' },
                                    title_so: { type: 'STRING' },
                                    category: { type: 'STRING' },
                                    location: { type: 'STRING' },
                                    summary: { type: 'STRING' },
                                    summary_so: { type: 'STRING' },
                                    content: { type: 'STRING' },
                                    content_so: { type: 'STRING' }
                                },
                                required: ['id', 'title', 'title_so', 'category', 'location', 'summary', 'summary_so', 'content', 'content_so']
                            }
                        }
                    },
                    required: ['articles']
                }
            }
        });

        const parsedData = JSON.parse(response.text);

        const finalArticles = (parsedData.articles || []).map((art, idx) => ({
            ...art,
            id: art.id || `art-${idx + 1}-${Date.now()}`,
            imageUrl: CATEGORY_IMAGES[art.category] || CATEGORY_IMAGES.Somalia,
            publishedAt: new Date().toISOString()
        }));

        if (finalArticles.length === 0) {
            throw new Error('API returned zero articles');
        }

        writeOutputPayload(finalArticles);

    } catch (error) {
        console.error('Error in Gemini generation. Using fallback payload:', error.message);
        writeOutputPayload(FALLBACK_ARTICLES);
    }
}

function writeOutputPayload(articles) {
    const payload = {
        updatedAt: new Date().toISOString(),
        count: articles.length,
        articles: articles
    };

    const outputDir = path.join(__dirname, 'public', 'data');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'news.json');
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`Successfully written ${articles.length} news stories to ${outputPath}`);
}

generateNewsFeed();
