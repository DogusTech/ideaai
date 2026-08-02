const fs = require('fs');
const t = fs.readFileSync('C:/Users/dogus/Downloads/togetlinkk/all-files/index.html', 'utf8');
const m = [...t.matchAll(/<script type="module" src="([^"]+)"/g)];
m.forEach(x => console.log(x[1]));
