with open("middleware.ts", "r", encoding="utf-8") as f:
    code = f.read()

search = """      // Allow /legal, /privacy-policy, and /redeem to route to the root app folder
      if (url.pathname.startsWith('/legal') || url.pathname.startsWith('/privacy-policy') || url.pathname.startsWith('/redeem')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }"""

replace = """      // Allow /legal, /privacy-policy, /redeem, and /blog to route to the root app folder
      if (url.pathname.startsWith('/legal') || url.pathname.startsWith('/privacy-policy') || url.pathname.startsWith('/redeem') || url.pathname.startsWith('/blog')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }"""

code = code.replace(search, replace)
with open("middleware.ts", "w", encoding="utf-8") as f:
    f.write(code)
