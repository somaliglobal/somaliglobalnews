const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateLatestNews() {
    console.log("Fetching and generating the latest global and regional news using Gemini...");

    const prompt = `
    You are the Chief Editor and Wire Engine for "Somali Global News" (SGN Wire).
    Generate 6 breaking, high-impact news articles covering current events as of October 2026.
    
    You must cover the following categories:
    1. Somalia & Türkiye (Defense, maritime security, economic pacts, trade)
    2. Ethiopia & Neighbors (Horn of Africa diplomacy, regional security, Nile basin, or trade agreements)
    3. Middle East (Yemen developments, Red Sea maritime security, Strait of Hormuz, GCC relations)
    4. Somaliland & Global (International diplomatic engagements, recognition debates, UN/AU updates)
    5. Sports Scores (Latest results from Premier League, La Liga, Serie A, NBA, and NFL)
    6. Diaspora (Global Somali diaspora community achievements, business, or cultural updates in North America and Europe)

    For EACH article, you must provide:
    - id: A unique slug string (e.g. "art-1", "art-2", etc.)
    - title: Catchy, professional English headline.
    - title_so: Accurate professional Somali translation of the headline.
    - category: Must be one of ["Somalia", "Ethiopia", "Middle East", "World", "Sports", "Diaspora"]
    - location: Bureau or dateline (e.g., "Mogadishu Bureau", "Addis Ababa Desk", "Sports Desk")
    - summary: A concise 2-sentence English summary.
    - summary_so: A concise 2-sentence Somali translation of the summary.
    - content: Full multi-paragraph English news report (at least 2 rich paragraphs).
    - content_so: Full multi-paragraph professional Somali translation of the news report.
    - imageUrl: A relevant Unsplash image URL or category placeholder.
    - publishedAt: ISO timestamp for today.

    CRITICAL REQUIREMENT: Output strictly in JSON format as an object with an "articles" array. No markdown code blocks outside, just valid JSON payload.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.7
            }
        });

        const textResponse = response.text();
        const parsedData = JSON.parse(textResponse);

        const payload = {
            updatedAt: new Date().toISOString(),
            articles: parsedData.articles || parsedData
        };

        const dataDir = path.join(__dirname, 'public', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        fs.writeFileSync(path.join(dataDir, 'news.json'), JSON.stringify(payload, null, 2));
        console.log("Successfully generated and saved latest news payload to public/data/news.json");

    } catch (error) {
        console.error("Error generating news with Gemini:", error);
        process.exit(1);
    }
}

generateLatestNews();
