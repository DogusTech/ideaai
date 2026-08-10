const fs = require('fs');
const path = 'app/ai-landing-page/landing-content.json';
let data = fs.readFileSync(path, 'utf8');

// The header logo is currently: <strong style="font-weight: 800; color: #0F172A;">IdeaAI</strong> IdeaAI
// Replace it with: <strong style="font-weight: 800; color: #0F172A;">TogetLink</strong> IdeaAI
data = data.replace(
  /<strong([^>]*)>IdeaAI<\/strong>\s*IdeaAI/g,
  '<strong$1>TogetLink</strong> IdeaAI'
);

// For the center logo, let's see if we can find something like "hero-logo" or the standalone "T"
// Let's replace the standalone "T" with the full logo and text if we can find it.
// Antigravity's template usually has an SVG or a div with "hero-logo".
// Let's search for "T" in the middle of hero-content or similar.
// Wait, the Google Antigravity logo in the middle of the hero section is probably an img or SVG.
// Let's find "assets/image/antigravity-logo" or similar.

fs.writeFileSync(path, data);
console.log('Done replacing IdeaAI -> TogetLink IdeaAI');
