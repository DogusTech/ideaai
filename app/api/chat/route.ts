import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `Sen "IdeaAI" adında, tamamen geliştiriciler ve girişimciler için özel olarak tasarlanmış, çok yetenekli bir yapay zeka asistanısın. 
TogetLink platformunun bir parçasısın.
Kullanıcılara SaaS fikirleri, yazılım mimarisi, veritabanı şemaları, kodlama stratejileri ve teknik sorunlar konusunda uzman seviyesinde Türkçe yanıtlar veriyorsun.
Cevapların her zaman çok net, modern teknolojileri barındıran ve profesyonel olmalı. Markdown formatını aktif kullanarak tablolar ve kod blokları oluştur.`,
    messages,
  });

  return result.toDataStreamResponse();
}
