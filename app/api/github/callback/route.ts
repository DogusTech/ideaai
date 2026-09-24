import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/mac-test?error=github_auth_failed', request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "GitHub credentials are not configured in .env.local" },
      { status: 500 }
    );
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub Token Error:', tokenData.error_description);
      return NextResponse.redirect(new URL('/mac-test?error=github_token_failed', request.url));
    }

    const accessToken = tokenData.access_token;

    // TODO: In a real production app, you MUST encrypt this accessToken and store it in your database (e.g., Firestore)
    // linked to the currently authenticated user's ID.
    // For this prototype/early stage, we can redirect back to the app with a success flag.
    // (Passing tokens in URL is insecure, so we just pass a success flag and handle token storage server-side later).

    return NextResponse.redirect(new URL('/mac-test?github_connected=true', request.url));

  } catch (err) {
    console.error('GitHub Auth Exception:', err);
    return NextResponse.redirect(new URL('/mac-test?error=github_auth_exception', request.url));
  }
}
