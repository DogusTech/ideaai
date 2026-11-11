import fs from 'fs';

let content = fs.readFileSync('app/ai-landing-page/page.tsx', 'utf8');

// Remove the JSX invocation
content = content.replace(/<InteractiveParticles \/>/g, '');

// Optionally we could remove the definition, but just removing the JSX tag is enough to kill the colorful canvas!
// And it's safer.

fs.writeFileSync('app/ai-landing-page/page.tsx', content);
console.log("InteractiveParticles (colorful canvas) removed from render.");
