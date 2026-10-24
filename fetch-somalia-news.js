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

async function generateNewsFeed() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the lead editor for Somali Global News Wire (SGN).
Search current news reported today by BBC, Al Jazeera, Reuters, France 24, Anadolu Agency, and Al Arabiya English.

Cover 6 specific domains:
1. Somalia (Mogadishu, trade, EAC, security)
2. Ethiopia (Addis Ababa, Horn of Africa regional diplomacy)
3. Middle East (Yemen, Red Sea, Gulf GCC diplomacy)
4. Diaspora (London, Minnesota, European Somali communities)
5. Sports (European Premier League, La Liga, Serie A, NBA, NFL)
6. World (Global geopolitics or trade)

Requirements for each of the 6 stories:
- Category matching strictly one of: ["Somalia", "Ethiopia", "Middle East", "Diaspora", "Sports", "World"]
- English Title & Full Multiline Article
- Natural Somali Translation (title_so, summary_so, content_so)
- Location desk (e.g. "Mogadishu Desk", "Addis Ababa Bureau", "Riyadh Desk", "London Desk", "Sports Desk")`;

    const userPrompt = `Search today's breaking news across BBC, Al Jazeera, Reuters, France 24, Anadolu, and Al Arabiya for Somalia, Ethiopia, Middle East, Diaspora, Sports (Soccer/NBA/NFL), and World news. Generate 6 distinct article objects inside a JSON array under the "articles" key.`;

    try {
        console.log('Fetching multi-source news wire using Gemini API...');

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            tools: [{ google_search: {} }],
            generationConfig: {
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

        // Map safe, topic-matched photos to each article
        const finalArticles = (parsedData.articles || []).map((art, idx) => ({
            ...art,
            id: art.id || `art-${idx + 1}-${Date.now()}`,
            imageUrl: CATEGORY_IMAGES[art.category] || CATEGORY_IMAGES.Somalia,
            publishedAt: new Date().toISOString()
        }));

        const payload = {
            updatedAt: new Date().toISOString(),
            count: finalArticles.length,
            articles: finalArticles
        };

        const outputDir = path.join(__dirname, 'public', 'data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'news.json');
        fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
        console.log(`Successfully output ${finalArticles.length} news stories to ${outputPath}`);

    } catch (error) {
        console.error('Error generating news payload:', error);
        process.exit(1);
    }
}

generateNewsFeed();
