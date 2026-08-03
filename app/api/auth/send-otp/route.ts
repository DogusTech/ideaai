import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-otp';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a stateless JWT containing the code
    const token = jwt.sign({ email: email.toLowerCase(), code }, JWT_SECRET, { expiresIn: '10m' });

    const response = NextResponse.json({ success: true, message: 'OTP sent successfully' });

    // Set it as an HTTP-only cookie
    response.cookies.set('otp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 // 10 minutes
    });

    // Send email via Resend
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('re_mock_key')) {
      const resendResult = await resend.emails.send({
        from: 'TogetLink Security <security@auth.togetlink.com>', 
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
