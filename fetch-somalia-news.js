const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing');
}

const ai = new GoogleGenAI({ apiKey });

function extractJson(text) {
  if (!text) return { articles: [] };

  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {}
    }

    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fencedMatch) {
      try {
        return JSON.parse(fencedMatch[1]);
      } catch (err) {}
    }
  }

  return { articles: [] };
}

async function generateNews() {
  const prompt = `
You are a Somali news curator. Generate JSON with a top-level "articles" array.
Return exactly 5 article objects with fields:
- title
- summary
- category
- location
- imageUrl

Use valid JSON only, no markdown.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  const parsed = extractJson(response?.text || '');

  const articles = Array.isArray(parsed.articles) ? parsed.articles.slice(0, 5) : [];
  if (!articles.length) {
    throw new Error('Gemini returned no article data.');
  }

  const outDir = path.join(process.cwd(), 'public', 'data');
  fs.mkdirSync(outDir, { recursive: true });

  const outputFile = path.join(outDir, 'news.json');
  fs.writeFileSync(outputFile, JSON.stringify({ articles }, null, 2));

  console.log(`Generated ${articles.length} news articles -> ${outputFile}`);
}

generateNews().catch((error) => {
  console.error('Failed to generate news data.');
  console.error(error);
  process.exit(1);
});
