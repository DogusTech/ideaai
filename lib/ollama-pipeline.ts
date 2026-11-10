export interface NewsTranslation {
  title: string;
  summary: string;
  content: string;
  keyTakeaways: string[];
  tags: string[];
}

export interface ProcessedNewsArticle {
  id: string;
  originalUrl: string;
  source: string;
  category: 'AI' | 'SaaS' | 'DevTools' | 'Startups' | 'Tech';
  createdAt: string;
  translations: {
    en: NewsTranslation;
    tr: NewsTranslation;
    es: NewsTranslation;
    fr: NewsTranslation;
    it: NewsTranslation;
    ja: NewsTranslation;
    de: NewsTranslation;
    [key: string]: NewsTranslation;
  };
  views: number;
  isFeatured: boolean;
}

const OLLAMA_ENDPOINT = process.env.OLLAMA_BASE_URL 
  ? `${process.env.OLLAMA_BASE_URL.replace(/\/$/, '')}/api/generate`
  : 'http://localhost:11434/api/generate';

const OLLAMA_MODEL = process.env.OLLAMA_NEWS_MODEL || 'llama3.2';

/**
 * Calls local Ollama Llama 3.2 without streaming or external tokens
 */
async function callOllama(prompt: string, formatJson: boolean = false): Promise<string> {
  const payload: any = {
    model: OLLAMA_MODEL,
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.2,
      top_p: 0.9
    }
  };

  if (formatJson) {
    payload.format = 'json';
  }

  const res = await fetch(OLLAMA_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(300000) // 5 minutes timeout for multi-language LLM generation
  });

  if (!res.ok) {
    throw new Error(`Ollama request failed with status: ${res.status} (${res.statusText})`);
  }

  const data = await res.json();
  return data.response || '';
}

/**
 * 1. Content Filtering: Checks if the article is relevant to SaaS, AI, Software, or Startups
 */
export async function filterRelevance(title: string, snippet: string): Promise<{ isRelevant: boolean; category: ProcessedNewsArticle['category'] }> {
  const prompt = `You are an editorial AI filter for a premier Tech, SaaS, and AI media publication.
Evaluate whether this news article is genuinely relevant to SaaS, Artificial Intelligence, Software Engineering, Developer Tools, or Tech Startups.

Title: "${title}"
Snippet: "${snippet}"

Respond ONLY with valid JSON in this exact structure:
{
  "isRelevant": true or false,
  "category": "AI" or "SaaS" or "DevTools" or "Startups" or "Tech"
}`;

  try {
    const raw = await callOllama(prompt, true);
    const parsed = JSON.parse(raw);
    return {
      isRelevant: Boolean(parsed.isRelevant),
      category: parsed.category || 'Tech'
    };
  } catch (err) {
    // Fallback simple keyword heuristic if Ollama is warming up
    const text = `${title} ${snippet}`.toLowerCase();
    const isTech = /ai|artificial intelligence|llm|saas|software|api|startup|dev|cloud|agent|model|funding/i.test(text);
    return {
      isRelevant: isTech,
      category: /ai|llm|model|agent/i.test(text) ? 'AI' : /saas|b2b/i.test(text) ? 'SaaS' : 'Tech'
    };
  }
}

/**
 * 2 & 3. Process & Translate into 7 languages: en, tr, es, fr, it, ja, de
 */
export async function processAndTranslate(
  title: string,
  rawContent: string,
  category: ProcessedNewsArticle['category']
): Promise<ProcessedNewsArticle['translations']> {
  const prompt = `You are a high-level Tech Journalist and SEO Editor.
Transform the following raw news article into an authoritative, engaging, and professional publication format.

SOURCE TITLE: ${title}
CONTENT: ${rawContent.slice(0, 2500)}
CATEGORY: ${category}

REQUIREMENTS:
1. Create a catchy, high-CTR, SEO-optimized title for Discover & Google News.
2. Produce a concise, punchy 1-paragraph summary (approx. 40-50 words).
3. Write a 3-paragraph in-depth article body highlighting context, market impact, and technical significance.
4. Extract exactly 5 key bullet takeaways.
5. Provide 3-5 relevant hashtags/tags.
6. Provide this complete structured data in ALL 7 requested languages:
   - "en" (English - Default)
   - "tr" (Turkish)
   - "es" (Spanish)
   - "fr" (French)
   - "it" (Italian)
   - "ja" (Japanese)
   - "de" (German)

Respond ONLY with a valid JSON object matching this schema without any markdown surrounding text:
{
  "en": {
    "title": "...",
    "summary": "...",
    "content": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3",
    "keyTakeaways": ["item 1", "item 2", "item 3", "item 4", "item 5"],
    "tags": ["tag1", "tag2", "tag3"]
  },
  "tr": { ... },
  "es": { ... },
  "fr": { ... },
  "it": { ... },
  "ja": { ... },
  "de": { ... }
}`;

  const raw = await callOllama(prompt, true);
  const parsed = JSON.parse(raw);

  // Validate that English exists as default fallback
  if (!parsed.en || !parsed.en.title) {
    throw new Error('Ollama failed to produce baseline English translation structure.');
  }

  const languages = ['en', 'tr', 'es', 'fr', 'it', 'ja', 'de'] as const;
  const result: any = {};

  for (const lang of languages) {
    if (parsed[lang] && parsed[lang].title) {
      result[lang] = {
        title: parsed[lang].title,
        summary: parsed[lang].summary || '',
        content: parsed[lang].content || '',
        keyTakeaways: Array.isArray(parsed[lang].keyTakeaways) ? parsed[lang].keyTakeaways : [],
        tags: Array.isArray(parsed[lang].tags) ? parsed[lang].tags : []
      };
    } else {
      // Fallback to English if a language translation is incomplete
      result[lang] = { ...parsed.en };
    }
  }

  return result as ProcessedNewsArticle['translations'];
}
