const fs = require('fs');
const path = 'app/ai-landing-page/landing-content.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const html = data.html;

const headerLogoRegex = /<a class="logo-link"[^>]*>(.*?)<\/a>/s;
const m1 = html.match(headerLogoRegex);
if(m1) console.log('HEADER LOGO LINK HTML:\n', m1[1].substring(0, 500));

const heroLogoRegex = /<div class="hero-logo"[^>]*>(.*?)<\/div>/s;
const m2 = html.match(heroLogoRegex);
if(m2) console.log('\nHERO LOGO HTML:\n', m2[1].substring(0, 500));

const h1Regex = /<h1[^>]*>(.*?)<\/h1>/s;
const m3 = html.match(h1Regex);
if(m3) console.log('\nH1 HTML:\n', m3[1]);
