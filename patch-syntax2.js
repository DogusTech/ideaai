const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

const corruptedRepoMenuRegex = /<button onClick=\{\(\) => \{ setSelectedRepo\("DogusTech\/togetlink"\); setShowRepoMenu\(false\) \}\} className="w-full flex items-center px-3 py-2 text-\[13px\] text-black\/80 hover:bg-black\/5 text-left font-medium">DogusTech\/togetlink<\/button>\s*<button onClick=\{\(\) => \{ setSelectedRepo\("DogusTech\/outrank"\); setShowRepoMenu\(false\) \}\} className="w-full flex items-center px-3 py-2 text-\[13px\] text-black\/80 hover:bg-black\/5 text-left font-medium">DogusTech\/outrank<\/button>\s*<button onClick=\{\(\) => \{ setSelectedRepo\("Aeternexus\/core"\); setShowRepoMenu\(false\) \}\} className="w-full flex items-center px-3 py-2 text-\[13px\] text-black\/80 hover:bg-black\/5 text-left font-medium">Aeternexus\/core<\/button>\s*<\/div>/g;

if (corruptedRepoMenuRegex.test(code)) {
    code = code.replace(corruptedRepoMenuRegex, "");
    fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
    console.log('Fixed repo menu syntax error');
} else {
    console.log('Could not find corrupted repo menu');
}
