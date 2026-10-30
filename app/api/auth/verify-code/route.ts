import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-otp';

export async function POST(req: Request) {
  try {
    let email: string;
    let code: string;
    let password: string | undefined;
    let fullName: string | undefined;
    try {
      const body = await req.json();
      email = body.email;
      code = body.code;
      password = typeof body.password === 'string' ? body.password : undefined;
      fullName = typeof body.fullName === 'string' ? body.fullName.trim() : undefined;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    
    // Read the stateless cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('otp_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'OTP has expired or was not requested.' }, { status: 400 });
    }

    let decoded: any;
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      decoded = payload;
    } catch (err) {
      return NextResponse.json({ error: 'OTP has expired or is invalid.' }, { status: 400 });
    }

    if (decoded.email !== emailLower) {
      return NextResponse.json({ error: 'Email mismatch.' }, { status: 400 });
    }

    if (decoded.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
    }

    if (password !== undefined && password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Check if user exists in Firebase Auth, if not create them.
    let user;
    const { getAdminAuth } = await import('@/lib/firebase-admin');
    const adminAuth = getAdminAuth();
    try {
      user = await adminAuth.getUserByEmail(emailLower);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        if (!password) {
          return NextResponse.json({ error: 'Password is required to finish registration.' }, { status: 400 });
        }
        user = await adminAuth.createUser({
          email: emailLower,
          password,
          displayName: fullName || undefined,
          emailVerified: true,
        });
      } else {
        throw error;
      }
    }

    // Success! Prepare the response
    const customToken = await adminAuth.createCustomToken(user.uid);
    const response = NextResponse.json({ success: true, token: customToken });

    // Clear the cookie
    cookieStore.delete('otp_token');

    return response;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
