import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_CLIENT_ID is not configured in .env.local" },
      { status: 500 }
    );
  }

  // Generate a random state string for CSRF protection
  const state = Math.random().toString(36).substring(7);
  
  // We need 'repo' scope to read/write code, and 'user' for identification
  const scope = "repo,user";
  
  // The URL to redirect the user to GitHub for authorization
  // Note: For production, ensure the redirect_uri matches what's configured in GitHub
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/github/callback`;
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

  // Redirect the user to GitHub
  return NextResponse.redirect(githubAuthUrl);
}
