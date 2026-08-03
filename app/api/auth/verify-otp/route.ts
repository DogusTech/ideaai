import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-otp';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    
    // Read the stateless cookie
    const token = cookies().get('otp_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'OTP has expired or was not requested.' }, { status: 400 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'OTP has expired or is invalid.' }, { status: 400 });
    }

    if (decoded.email !== emailLower) {
      return NextResponse.json({ error: 'Email mismatch.' }, { status: 400 });
    }

    if (decoded.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
    }

    // Success! Clear the cookie
    cookies().delete('otp_token');

    // Check if user exists in Firebase Auth, if not create them
    let user;
    try {
      user = await adminAuth.getUserByEmail(emailLower);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        user = await adminAuth.createUser({
          email: emailLower,
          emailVerified: true
        });
      } else {
        throw error;
      }
    }

    // Create custom token
    const customToken = await adminAuth.createCustomToken(user.uid);

    return NextResponse.json({ success: true, token: customToken });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
