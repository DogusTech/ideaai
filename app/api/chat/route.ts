import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, department } = await req.json();

  const currentDept = department || "Software";

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `You are a highly capable AI assistant named "IdeaAI", exclusively designed for developers and entrepreneurs.
You are a core part of the TogetLink platform.
Currently, you are acting as an expert in the ${currentDept} department.
Your primary role is to provide expert-level, English-only responses tailored to the ${currentDept} domain.
Your answers must be extremely clear, incorporate modern methodologies, and be highly professional. Actively use Markdown formatting to create tables and code blocks when appropriate. DO NOT use Turkish or any other language; respond strictly in English.`,
    messages,
  });

  return result.toDataStreamResponse();
}
