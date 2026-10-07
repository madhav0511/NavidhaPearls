import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 100);
}

export async function handleSeoApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';

  // POST /api/seo/auto-fill
  if (url === '/api/seo/auto-fill' && req.method === 'POST') {
    let bodyText = '';
    req.on('data', (chunk) => {
      bodyText += chunk;
    });

    req.on('end', async () => {
      try {
        const body = JSON.parse(bodyText || '{}');
        const { title = '', description = '', category = '', images = [], attributes = {} } = body;

        if (!title.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Product title is required to generate SEO metadata.' }));
          return;
        }

        const apiKey = process.env.GEMINI_API_KEY || '';
        let generatedSeo: any = null;

        if (apiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `You are a Senior E-Commerce SEO Specialist & Copywriter for a luxury Indian jewelry atelier named Navidha.
Analyze this product and generate optimized SEO metadata in strict JSON:
- Product Title: "${title}"
- Category: "${category}"
- Raw Description: "${description.slice(0, 1000)}"
- Attributes: ${JSON.stringify(attributes)}

Requirements:
1. "meta_title": Maximum 60 characters. Must be compelling, elegant, include primary keywords and brand (e.g., "... | Navidha").
2. "meta_description": Maximum 160 characters. Must be actionable, highlight craft or luxury materials, and drive high organic CTR.
3. "slug": Clean, lower-case hyphenated URL slug based on the title.
4. "keywords": Array of 5 to 8 high-intent search phrases/tags (e.g. "925 silver choker", "Gulabi Meenakari necklace", etc.).

Return strictly JSON matching this structure:
{
  "meta_title": "string (<= 60 chars)",
  "meta_description": "string (<= 160 chars)",
  "slug": "string",
  "keywords": ["tag1", "tag2", ...]
}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.5-flash-lite',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
              },
            });

            if (response.text) {
              generatedSeo = JSON.parse(response.text);
            }
          } catch (geminiError) {
            console.warn('[SEO API] Gemini model call failed, falling back to algorithmic generator:', geminiError);
          }
        }

        // Algorithmic Fallback if AI call failed or apiKey missing
        if (!generatedSeo) {
          const baseSlug = slugify(title);
          const metaTitle = `${title.slice(0, 48)} | Navidha`.slice(0, 60);
          const rawDesc = description || `Handcrafted ${category || 'fine jewelry'} in certified 925 sterling silver and authentic pearls.`;
          const metaDesc = `Discover the ${title}. ${rawDesc.slice(0, 100)} Enjoy complimentary insured delivery across India.`.slice(0, 160);
          const keywords = [
            category,
            '925 Sterling Silver',
            'Handcrafted Jewelry',
            'Navidha Atelier',
            'Indian Heritage Jewelry',
          ].filter(Boolean);

          generatedSeo = {
            meta_title: metaTitle,
            meta_description: metaDesc,
            slug: baseSlug,
            keywords,
          };
        }

        // Format and constrain boundaries strictly
        const safeSlug = slugify(generatedSeo.slug || title);
        const metaTitle = (generatedSeo.meta_title || `${title} | Navidha`).slice(0, 60);
        const metaDesc = (generatedSeo.meta_description || description || `Explore ${title} at Navidha.`).slice(0, 160);
        const ogImage = images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80';
        const canonicalUrl = `https://navidhapearls.com/products/${safeSlug}`;
        const keywords = Array.isArray(generatedSeo.keywords) ? generatedSeo.keywords.slice(0, 10) : [];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            meta_title: metaTitle,
            meta_description: metaDesc,
            slug: safeSlug,
            canonical_url: canonicalUrl,
            og_image: ogImage,
            keywords,
          })
        );
      } catch (err: any) {
        console.error('[SEO API Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Failed to generate SEO metadata.' }));
      }
    });

    return true;
  }

  return false;
}
