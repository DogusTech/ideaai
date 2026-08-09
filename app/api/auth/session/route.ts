import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()
    
    // In a full production setup with firebase-admin, you would verify the idToken 
    // and mint a session cookie here. For lightweight middleware protection, 
    // we simply store the idToken (or a flag) in a secure HttpOnly cookie.
    
    // Set cookie
    cookies().set('__session', idToken, {
      maxAge: 60 * 60 * 24 * 5, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE() {
  cookies().delete('__session')
  return NextResponse.json({ status: 'success' }, { status: 200 })
}
