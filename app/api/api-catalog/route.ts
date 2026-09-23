import { NextResponse } from 'next/server';

export async function GET() {
  const linkset = {
    linkset: [
      {
        anchor: "https://ideaai.togetlink.com/api",
        "service-doc": [
          {
            href: "https://ideaai.togetlink.com/llms-full.txt",
            type: "text/plain"
          }
        ],
        "service-desc": [
          {
            href: "https://ideaai.togetlink.com/AGENTS.md",
            type: "text/markdown"
          }
        ]
      }
    ]
  };

  return new NextResponse(JSON.stringify(linkset), {
    headers: {
      'Content-Type': 'application/linkset+json'
    }
  });
}
