import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      resource: "https://ideaai.togetlink.com/api",
      authorization_servers: [
        "https://ideaai.togetlink.com"
      ],
      scopes_supported: ["agent:execute", "agent:read", "repo:write"]
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
