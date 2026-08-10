const fs = require('fs');
const path = 'app/ai-landing-page/landing-content.json';
let data = fs.readFileSync(path, 'utf8');

const targetCenterLogo = `<div class="logo-container" data-logo data-astro-cid-lcdefpme><img class="logo" src="/assets/image/neon-logo-transparent.png" alt="T Logo" style="height: 32px; width: auto; object-fit: contain; transform: translateY(-4px);" /></div>`;

const newCenterLogo = `<div class="logo-container" data-logo data-astro-cid-lcdefpme style="display: flex; align-items: center; justify-content: center; margin-bottom: 24px;"><img class="logo" src="/assets/image/iai-logo-transparent.svg" alt="IAI Logo" style="height: 36px; width: auto; object-fit: contain; transform: translateY(-2px); margin-right: 12px;" /><span style="font-family: 'Google Sans Flex', sans-serif; font-size: 26px; color: #1a1d23; font-weight: 400; letter-spacing: -0.5px; transform: translateY(-2px);"><strong style="font-weight: 600; color: #1a1d23;">TogetLink</strong> IdeaAI</span></div>`;

data = data.replace(targetCenterLogo, newCenterLogo);

// Also let's fix the H1 to look exactly like the screenshot
// Add a <br/> to force the break or constrain the width.
const targetH1Text = `Experience liftoff with the next-gen agent platform`;
const newH1Text = `Experience liftoff with the next-gen<br/>agent platform`;

// Replace it in the typed content and visually hidden
// Note: typed-content usually types out the text, if it types a <br/> it might look weird unless it supports html
// The Antigravity template usually supports HTML in typed-content.
data = data.replace(/>Experience liftoff with the next-gen agent platform</g, `>Experience liftoff with the next-gen<br/>agent platform<`);

// Write the file
fs.writeFileSync(path, data);
console.log('Center logo and H1 updated.');
