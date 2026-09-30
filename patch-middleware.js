const fs = require('fs');
let code = fs.readFileSync('middleware.ts', 'utf8');

const replacement = `
      // Allow /app to route to the app/app folder (AI Terminal/Dashboard)
      if (url.pathname === '/app' || url.pathname.startsWith('/app/')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }

      // Allow /mac-test to route to the root mac-test folder
      if (url.pathname === '/mac-test' || url.pathname.startsWith('/mac-test/')) {
        return NextResponse.rewrite(new URL(url.pathname, request.url))
      }
`;

code = code.replace(/      \/\/ Allow \/app to route to the app\/app folder \(AI Terminal\/Dashboard\)\s*if \(url\.pathname === '\/app' \|\| url\.pathname\.startsWith\('\/app\/'\)\) \{\s*return NextResponse\.rewrite\(new URL\(url\.pathname, request\.url\)\)\s*\}/, replacement);

fs.writeFileSync('middleware.ts', code);
console.log("Updated middleware.ts to allow /mac-test");
