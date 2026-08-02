const fs = require('fs');
const path = require('path');
const https = require('https');

const baseUrl = 'https://antigravity.google';
const publicDir = 'C:/Users/dogus/Downloads/togetlinkk/public';

const filesToDownload = [
  '/assets/image/antigravity-cursor.png',
  '/assets/image/product/new-chat.png',
  '/assets/image/landing/feature-3.jpg',
  '/assets/image/landing/antigravity-cli.png',
  '/assets/image/landing/landing-thumbnail-fullstack.jpg',
  '/assets/image/landing/landing-thumbnail-enterprise.jpg',
  '/assets/image/landing/landing-thumbnail-frontend.jpg',
  '/assets/image/blog/3.6-Flash---Square.png',
  '/assets/image/blog/Google-IO---Square.jpg',
  '/assets/image/blog/AGY2-Square.jpg',
  '/assets/image/blog/Agent-Teams-Square.jpg',
  '/assets/image/blog/AGY-CLI-Blog---Square.png',
  '/assets/image/blog/AGY-Enterprise---Square.png',
  '/assets/image/blog/AGY-SDK-Blog---Square.png',
  '/assets/image/blog/3.5-Flash---Square.png',
  '/assets/image/blog/features-square.png'
];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  for (const file of filesToDownload) {
    const url = baseUrl + file;
    const dest = path.join(publicDir, file);
    try {
      if (!fs.existsSync(dest)) {
        await downloadFile(url, dest);
        console.log(`Downloaded: ${file}`);
      }
    } catch (e) {
      console.error(`Error downloading ${file}: ${e.message}`);
    }
  }
}

main();
