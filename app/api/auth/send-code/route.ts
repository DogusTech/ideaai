import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-otp';

export async function POST(req: Request) {
  try {
    let email: string;
    let type: string;
    try {
      const body = await req.json();
      email = body.email;
      type = body.type;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (type === 'login' || type === 'register') {
      try {
        const { getAdminAuth } = await import('@/lib/firebase-admin');
        const adminAuth = getAdminAuth();
        await adminAuth.getUserByEmail(email);
        // User exists
        if (type === 'register') {
          return NextResponse.json({ error: 'USER_EXISTS' }, { status: 400 });
        }
      } catch (error: any) {
        // User does not exist
        if (error.code === 'auth/user-not-found') {
          if (type === 'login') {
            return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 400 });
          }
        } else {
          console.error('Firebase Auth Error:', error);
          return NextResponse.json({ error: error.message || 'Firebase Admin Auth Error' }, { status: 500 });
        }
      }
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Log the code for debugging purposes in Vercel logs
    console.log(`[DEBUG] Generated OTP for ${email}: ${code}`);

    // Create a stateless JWT containing the code using jose
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ email: email.toLowerCase(), code })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set('otp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 // 10 minutes
    });

    const response = NextResponse.json({ success: true, message: 'OTP sent successfully' });

    // Send email via Resend
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('re_mock_key')) {
      const resendResult = await resend.emails.send({
        from: 'TogetLink Security <security@mail.togetlink.com>', 
        to: email,
        subject: 'Your TogetLink Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
            <h2>Sign in to TogetLink</h2>
            <p>Your verification code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 4px; padding: 12px; background: #f4f4f5; border-radius: 8px; text-align: center;">
              ${code}
            </h1>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          </div>
        `
      });
      
      if (resendResult.error) {
        console.error('Resend Error:', resendResult.error);
        return NextResponse.json({ error: resendResult.error.message || 'Email sending failed' }, { status: 400 });
      }

      console.log(`[OTP] Sent email to ${email}`);
    } else {
      console.warn(`[Mock Mode] MOCK EMAIL SENT. Code for ${email} is: ${code}`);
    }

    return response;
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
