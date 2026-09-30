const https = require('https');

async function checkLiveSite() {
  const r = await fetch('https://ideaai.togetlink.com/mac-test');
  const html = await r.text();
  
  const jsFiles = [...html.matchAll(/_next\/static\/chunks\/[^"']+\.js/g)].map(m => m[0]);
  console.log('Found JS files:', jsFiles.length);
  
  let found = false;
  for (const f of jsFiles) {
    const r2 = await fetch('https://ideaai.togetlink.com/' + f);
    const content = await r2.text();
    if (content.includes('model:')) {
      console.log('FOUND "model:" in chunk:', f);
      found = true;
    }
  }
  
  if (!found) {
    console.log('Did not find "model:" in any chunk! THE LIVE SITE IS SERVING STALE HTML!');
  }
}

checkLiveSite().catch(console.error);
