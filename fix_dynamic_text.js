const fs = require('fs');

// 1. Fix index.astro_astro_type_script_index_0_lang.CghSekDP.js
let idxFile = 'public/landing/index.astro_astro_type_script_index_0_lang.CghSekDP.js';
let idxContent = fs.readFileSync(idxFile, 'utf8');
idxContent = idxContent.replace('href="/download"', 'href="/ai-landing-page/register"');
idxContent = idxContent.replace('Download${e.buttonText}', 'Get Started');
fs.writeFileSync(idxFile, idxContent);

// 2. Fix DownloadSection.astro_astro_type_script_index_0_lang.DO3qSWET.js
let dlFile = 'public/landing/DownloadSection.astro_astro_type_script_index_0_lang.DO3qSWET.js';
let dlContent = fs.readFileSync(dlFile, 'utf8');
dlContent = dlContent.replace('n.href=`/download`', 'n.href=`/ai-landing-page/register`');
// Change n.innerHTML=`<span>${e.buttonText}</span>` to `<span>Get Started</span>` 
// But wait, it loops over links! 
// Let's just fix deviceInfo.eHzC_0c8.js so that links ONLY has "Get Started".

let devFile = 'public/landing/deviceInfo.eHzC_0c8.js';
let devContent = fs.readFileSync(devFile, 'utf8');
// Replace all buttonText:`Download for ...` with buttonText:`Get Started`
devContent = devContent.replace(/buttonText:`Download[^`]*`/g, 'buttonText:`Get Started`');
// And make sure there's only 1 button if possible, but leaving 2 buttons both saying "Get Started" is fine, or we can just replace the links array.
// Let's replace the whole links array for windows, mac, linux:
devContent = devContent.replace(/links:\[.*?\]/g, 'links:[{buttonText:`Get Started`,href:null}]');
fs.writeFileSync(devFile, devContent);

console.log('Fixed JS dynamically injected text and hrefs!');
