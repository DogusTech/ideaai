import { NextResponse } from "next/server"
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto"
import { cookies } from "next/headers"

export const runtime = "nodejs"

const COOKIE_NAME = "ideaai_railway_connection"
const RAILWAY_ENDPOINT = "https://backboard.railway.com/graphql/v2"

type RailwayTokenType = "account" | "workspace" | "project"

function encryptionKey() {
  return createHash("sha256")
    .update(process.env.JWT_SECRET || process.env.FIREBASE_ADMIN_PRIVATE_KEY || "ideaai-local-development-key")
    .digest()
}

function encrypt(value: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".")
}

function decrypt(value: string) {
  const [ivValue, tagValue, encryptedValue] = value.split(".")
  if (!ivValue || !tagValue || !encryptedValue) throw new Error("Invalid Railway connection")
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivValue, "base64url"))
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"))
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8")
}

async function railwayRequest(token: string, tokenType: RailwayTokenType, query: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (tokenType === "project") headers["Project-Access-Token"] = token
  else headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`

  const response = await fetch(RAILWAY_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
    cache: "no-store",
  })
  const payload = await response.json().catch(() => ({}))
  const error = payload?.errors?.[0]?.message
  if (!response.ok || error) throw new Error(error || `Railway returned HTTP ${response.status}`)
  return payload.data
}

export async function GET() {
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIE_NAME)?.value
  if (!value) return NextResponse.json({ connected: false })

  try {
    const connection = JSON.parse(decrypt(value)) as { token: string; tokenType: RailwayTokenType }
    await railwayRequest(connection.token, connection.tokenType, connection.tokenType === "project" ? "query { projectToken { projectId environmentId } }" : "query { me { name email } }")
    return NextResponse.json({ connected: true, tokenType: connection.tokenType })
  } catch {
    const response = NextResponse.json({ connected: false })
    response.cookies.delete(COOKIE_NAME)
    return response
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = typeof body.token === "string" ? body.token.trim() : ""
    const tokenType = body.tokenType as RailwayTokenType
    if (!token || !["account", "workspace", "project"].includes(tokenType)) {
      return NextResponse.json({ error: "A Railway token and token type are required." }, { status: 400 })
    }

    const data = await railwayRequest(token, tokenType, tokenType === "project" ? "query { projectToken { projectId environmentId } }" : "query { me { name email } }")
    const response = NextResponse.json({ connected: true, tokenType, account: data?.me || null, project: data?.projectToken || null })
    response.cookies.set(COOKIE_NAME, encrypt(JSON.stringify({ token, tokenType })), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
    return response
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Railway connection failed." }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ connected: false })
  response.cookies.delete(COOKIE_NAME)
  return response
}
