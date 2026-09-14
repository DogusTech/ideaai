const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'build');
const APPX_DIR = path.join(BUILD_DIR, 'appx');
const SOURCE_ICON = path.join(BUILD_DIR, 'icon.png');

async function generateIcons() {
  if (!fs.existsSync(APPX_DIR)) {
    fs.mkdirSync(APPX_DIR, { recursive: true });
  }

  try {
    const image = await Jimp.read(SOURCE_ICON);
    
    // Square icons
    const squares = [
      { name: 'StoreLogo.png', size: 50 },
      { name: 'Square44x44Logo.png', size: 44 },
      { name: 'Square150x150Logo.png', size: 150 },
      { name: 'Square310x310Logo.png', size: 310 },
      { name: 'Square71x71Logo.png', size: 71 }, // Sometimes needed
    ];

    for (const sq of squares) {
      const clone = image.clone();
      clone.resize({ w: sq.size, h: sq.size });
      await clone.write(path.join(APPX_DIR, sq.name));
      console.log(`Generated ${sq.name}`);
    }

    // Wide icon (310x150) - create transparent 310x150, paste 150x150 in center
    const wide = new Jimp({ width: 310, height: 150, color: 0x00000000 });
    const centerIcon = image.clone();
    centerIcon.resize({ w: 150, h: 150 });
    wide.composite(centerIcon, 80, 0); // (310-150)/2 = 80
    await wide.write(path.join(APPX_DIR, 'Wide310x150Logo.png'));
    console.log(`Generated Wide310x150Logo.png`);

    console.log('All AppX icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
