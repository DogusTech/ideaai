# Agent Authentication for IdeaAI

To interact with IdeaAI's protected APIs programmatically, AI agents must register and authenticate using OAuth 2.0 Client Credentials or OpenID Connect (OIDC).

## Registration
Currently, agent registration is manual. Please email agents@togetlink.com to request an API key and OAuth Client Credentials.

## Authentication
Use the `client_credentials` grant type to obtain an access token:

```bash
POST https://ideaai.togetlink.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET
```

## Scopes Supported
- `agent:read` - Read local repository context
- `agent:execute` - Execute terminal commands natively
- `repo:write` - Write files to the local file system

## Endpoints
See `/.well-known/openid-configuration` and `/.well-known/oauth-protected-resource` for discovery endpoints.
