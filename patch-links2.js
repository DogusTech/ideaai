const fs = require('fs');
function patchFile(file, regex, replacement) {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    if (regex.test(code)) {
        code = code.replace(regex, replacement);
        fs.writeFileSync(file, code);
        console.log('Patched ' + file);
    }
}
patchFile(
    'components/ai-landing/AntigravityHero.tsx',
    /<a href="https:\/\/www\.togetlink\.com\/ai"\s+className="button button-primary gap-2">/g,
    '<a href="https://github.com/DogusTech/togetlink-ui/releases/download/v0.1.5/TogetLink.IdeaAI.Setup.0.1.5.exe" className="button button-primary gap-2">'
);
patchFile(
    'components/ai-landing/AntigravityHeader.tsx',
    /<a href="https:\/\/www\.togetlink\.com\/ai"\s+className="button button-primary"/g,
    '<a href="https://github.com/DogusTech/togetlink-ui/releases/download/v0.1.5/TogetLink.IdeaAI.Setup.0.1.5.exe" className="button button-primary"'
);
