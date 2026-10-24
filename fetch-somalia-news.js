const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

/**
 * Automated News Generator for Somali Global News Wire
 * Uses Gemini API with Search Grounding to aggregate real-time global, Horn of Africa,
 * Middle East, Diaspora, and Sports news in both English and Somali.
 */

async function generateNewsFeed() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the lead editor for Somali Global News Wire (SGN).
Your task is to analyze current breaking news across 6 core domains:
1. Somalia (National political, economic, or security updates)
2. Ethiopia (Horn of Africa regional developments)
3. Middle East (Red Sea, Gulf, and regional diplomacy)
4. Diaspora (Updates from Somali communities in US, UK, Europe, Canada)
5. Sports (European Football - EPL, La Liga, Serie A; NBA, NFL)
6. World (Global geopolitical or trade news)

Generate 6 high-quality, professional wire articles (1 per category). Each article must include:
- Concise, engaging title in English and Somali
- Category matching one of: ["Somalia", "Ethiopia", "Middle East", "Diaspora", "Sports", "World"]
- Location Desk (e.g., "Mogadishu Desk", "Addis Ababa Bureau", "Riyadh Desk", "London Desk", "Sports Desk")
- 2-sentence Summary in English and Somali
- Full multiline Article Content in English and Somali
- A high-resolution stock image URL from Unsplash relevant to the topic.`;

    const userPrompt = `Search Google for the most recent news updates today (October 2026) regarding Somalia, Horn of Africa, Middle East diplomacy, Somali Diaspora events, current European football/NBA/NFL sports events, and key world news. Generate 6 distinct JSON article objects inside an array under the "articles" key. Return valid JSON only.`;

    try {
        console.log('Fetching and generating breaking news content with Gemini API...');
        
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
                                    content_so: { type: 'STRING' },
                                    imageUrl: { type: 'STRING' }
                                },
                                required: ['id', 'title', 'title_so', 'category', 'location', 'summary', 'summary_so', 'content', 'content_so', 'imageUrl']
                            }
                        }
                    },
                    required: ['articles']
                }
            }
        });

        const rawText = response.text;
        const parsedData = JSON.parse(rawText);

        // Ensure each article has a timestamp
        const finalArticles = (parsedData.articles || []).map((art, idx) => ({
            ...art,
            id: art.id || `art-${idx + 1}-${Date.now()}`,
            publishedAt: new Date().toISOString()
        }));

        const payload = {
            updatedAt: new Date().toISOString(),
            count: finalArticles.length,
            articles: finalArticles
        };

        // Write to public/data/news.json
        const outputDir = path.join(__dirname, 'public', 'data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'news.json');
        fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
        console.log(`Successfully written ${finalArticles.length} news wire stories to ${outputPath}`);

    } catch (error) {
        console.error('Error generating news feed:', error);
        process.exit(1);
    }
}

generateNewsFeed();
