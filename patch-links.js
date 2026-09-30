const fs = require('fs');

const file1 = 'app/ai-landing-page/page.tsx';
let code1 = fs.readFileSync(file1, 'utf8');

// Replace the href="#" for Download for Windows
// Using regex to carefully match the a tag containing Download for Windows
const dlRegex1 = /<a\s+href="[^"]*"\s+className="w-full sm:w-auto bg-zinc-900[^>]*>([\s\S]*?)Download for Windows/m;
if (dlRegex1.test(code1)) {
    code1 = code1.replace(/<a\s+href="[^"]*"\s+(className="w-full sm:w-auto bg-zinc-900[^>]*>[\s\S]*?Download for Windows)/, '<a href="https://github.com/DogusTech/togetlink-ui/releases/download/v0.1.5/TogetLink.IdeaAI.Setup.0.1.5.exe" $1');
    fs.writeFileSync(file1, code1);
    console.log('Patched ai-landing-page');
} else {
    console.log('Could not find Download button in ai-landing-page');
}

const file2 = 'components/ai-landing/AntigravityHero.tsx';
if (fs.existsSync(file2)) {
    let code2 = fs.readFileSync(file2, 'utf8');
    const dlRegex2 = /<a\s+href="[^"]*"\s+(className="button button-primary"[^>]*>[\s\S]*?Download for Windows)/m;
    if (dlRegex2.test(code2)) {
        code2 = code2.replace(/<a\s+href="[^"]*"\s+(className="button button-primary"[^>]*>[\s\S]*?Download for Windows)/, '<a href="https://github.com/DogusTech/togetlink-ui/releases/download/v0.1.5/TogetLink.IdeaAI.Setup.0.1.5.exe" $1');
        fs.writeFileSync(file2, code2);
        console.log('Patched AntigravityHero');
    }
}
