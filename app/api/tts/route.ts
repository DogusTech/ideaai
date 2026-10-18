import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId = "CwhCGbxPnGceg5OxxsZl" } = await req.json(); // Roger is default

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API Key not configured" }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

    // Return the audio stream
    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: any) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
