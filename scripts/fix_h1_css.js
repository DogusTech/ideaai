const fs = require('fs');

const jsonPath = 'app/ai-landing-page/landing-content.json';
let data = fs.readFileSync(jsonPath, 'utf8');
// Revert the <br/> back to a space
data = data.replace(/Experience liftoff with the next-gen<br\/>agent platform/g, 'Experience liftoff with the next-gen agent platform');
fs.writeFileSync(jsonPath, data);

const cssPath = 'app/ai-landing-page/index.BYZqGVMs.css';
let css = fs.readFileSync(cssPath, 'utf8');
// Adjust max-inline-size to force wrap after "next-gen"
// "Experience liftoff with the next-gen" is ~20 characters + " agent platform". 
// A max-inline-size of ~800px should wrap it. Let's try 800px or max-width.
css = css.replace(/max-inline-size:1100px;/g, 'max-inline-size:850px; margin: 0 auto; letter-spacing: -2px;');
fs.writeFileSync(cssPath, css);

console.log('Fixed CSS and reverted <br/>');
