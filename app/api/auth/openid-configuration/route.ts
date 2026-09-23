import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      issuer: "https://ideaai.togetlink.com",
      authorization_endpoint: "https://ideaai.togetlink.com/oauth/authorize",
      token_endpoint: "https://ideaai.togetlink.com/oauth/token",
      jwks_uri: "https://ideaai.togetlink.com/.well-known/jwks.json",
      scopes_supported: ["openid", "profile", "agent:execute", "agent:read", "repo:write"],
      response_types_supported: ["code", "token"],
      grant_types_supported: ["authorization_code", "client_credentials", "urn:ietf:params:oauth:grant-type:token-exchange"],
      agent_auth: {
        register_uri: "https://ideaai.togetlink.com/auth.md",
        supported_identity_types: ["urn:ietf:params:oauth:client-assertion-type:jwt-bearer"],
        supported_credential_types: ["oauth2_client_credentials"]
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
