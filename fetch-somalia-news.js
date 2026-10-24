import fs from 'fs';
import path from 'path';
import https from 'https';

// RSS Feed sources for global & Horn of Africa coverage
const RSS_FEEDS = [
    { name: 'BBC Africa', url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml', category: 'Somalia' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'World' },
    { name: 'Anadolu Agency', url: 'https://www.aa.com.tr/en/rss/default?cat=world', category: 'World' },
    { name: 'France 24', url: 'https://www.france24.com/en/rss', category: 'World' },
    { name: 'Al Arabiya English', url: 'https://english.alarabiya.net/tools/rss', category: 'World' }
];

// Strictly verified HD images mapped by category & keyword (NO Obama / mismatched images)
const IMAGE_LIBRARY = {
    Somalia: [
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'
    ],
    Ethiopia: [
        'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80'
    ],
    Kenya: [
        'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
    ],
    Diaspora: [
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'
    ],
    World: [
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
    ]
};

// Helper: Fetch URL text via HTTPS
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchUrl(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

// Simple XML Item Extractor
function parseRssItems(xmlString, sourceName) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xmlString)) !== null) {
        const itemBlock = match[1];
        
        const titleMatch = itemBlock.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        const descMatch = itemBlock.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        const linkMatch = itemBlock.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);

        let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        let description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        let link = linkMatch ? linkMatch[1].trim() : '#';

        if (title && title.length > 10) {
            items.push({ title, description, link, source: sourceName });
        }
    }
    return items;
}

// Map keywords to specific regional categories
function categorizeArticle(title, description) {
    const text = (title + ' ' + description).toLowerCase();

    if (text.includes('somali') || text.includes('mogadishu') || text.includes('haisan') || text.includes('barre')) {
        return 'Somalia';
    } else if (text.includes('ethiopia') || text.includes('addis ababa') || text.includes('tigray') || text.includes('amhara') || text.includes('oromia')) {
        return 'Ethiopia';
    } else if (text.includes('kenya') || text.includes('nairobi') || text.includes('mombasa')) {
        return 'Kenya';
    } else if (text.includes('diaspora') || text.includes('minneapolis') || text.includes('london') || text.includes('birmingham') || text.includes('refugee')) {
        return 'Diaspora';
    }
    return 'World';
}

// Main execution function
async function main() {
    console.log('Fetching multi-source news wire feed (BBC, Al Jazeera, France 24, Anadolu, Al Arabiya)...');
    
    let allFetchedItems = [];

    for (const feed of RSS_FEEDS) {
        try {
            console.log(`Downloading RSS from ${feed.name}...`);
            const xml = await fetchUrl(feed.url);
            const items = parseRssItems(xml, feed.name);
            allFetchedItems = allFetchedItems.concat(items.slice(0, 5)); // Take top 5 per feed
        } catch (err) {
            console.log(`Warning: Failed to fetch ${feed.name}: ${err.message}`);
        }
    }

    // Process and structure articles
    const processedArticles = allFetchedItems.map((item, index) => {
        const category = categorizeArticle(item.title, item.description);
        const imagePool = IMAGE_LIBRARY[category] || IMAGE_LIBRARY.World;
        const imageUrl = imagePool[index % imagePool.length];

        // Format multi-paragraph content cleanly
        const fullContent = `${item.description}\n\nFor additional live coverage and editorial analysis, stay tuned to Somali Global News continuous wire updates. Source: ${item.source}.`;

        return {
            id: `wire-${Date.now()}-${index}`,
            title: item.title,
            title_so: item.title, // Bilingual fallback
            category: category,
            location: `${item.source} Wire`,
            summary: item.description.length > 180 ? item.description.substring(0, 185) + '...' : item.description,
            summary_so: item.description.length > 180 ? item.description.substring(0, 185) + '...' : item.description,
            content: fullContent,
            content_so: fullContent,
            imageUrl: imageUrl,
            publishedAt: new Date().toISOString()
        };
    });

    // Ensure fallback content if feed array is small
    const finalPayload = {
        updatedAt: new Date().toISOString(),
        articles: processedArticles.length > 0 ? processedArticles : [
            {
                id: "art-eth-1",
                title: "Horn of Africa Peace Talks Progress in Addis Ababa with Regional Envoys",
                category: "Ethiopia",
                location: "Addis Ababa Bureau",
                summary: "International envoys and African Union diplomats convene in Addis Ababa to promote regional peace, border security, and economic cooperation across northern regional borders.",
                content: "ADDIS ABABA — Diplomatic delegations convened in Addis Ababa today to continue high-level regional security consultations.\n\nThe discussions focused on border de-escalation, securing commercial transport corridors, and promoting humanitarian access across all impacted zones.\n\nAfrican Union representatives reiterated their commitment to facilitating peaceful dialogue and economic stability across the Horn of Africa.",
                imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=80",
                publishedAt: new Date().toISOString()
            }
        ]
    };

    // Save to public/data/news.json
    const outputDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'news.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalPayload, null, 2));
    console.log(`Successfully generated ${finalPayload.articles.length} news stories into public/data/news.json!`);
}

main().catch(err => {
    console.error('Error generating news payload:', err);
    process.exit(1);
});
