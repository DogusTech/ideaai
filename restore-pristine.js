const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/dogus/Downloads/togetlinkk/all-files';
const destDir = 'C:/Users/dogus/Downloads/togetlinkk/public/landing';

const srcFiles = fs.readdirSync(srcDir);
const destFiles = fs.readdirSync(destDir).filter(f => f.endsWith('.js'));

srcFiles.forEach(srcFile => {
    // Skip if it already has .js, .css, .mp4 etc.
    if (srcFile.includes('.') && (srcFile.endsWith('.js') || srcFile.endsWith('.css') || srcFile.endsWith('.mp4') || srcFile.endsWith('.html') || srcFile.endsWith('.png') || srcFile.endsWith('.har') || srcFile.endsWith('.ico') || srcFile.endsWith('.woff2'))) {
        return;
    }
    // Also skip css2, css3, css4, js folder
    if (!srcFile.includes('astro_astro_type_script')) {
        return;
    }

    // srcFile is something like "MorphingParticlesComponent.astro_astro_type_script_index_0_lang" or "MainParticlesComponent.astro_astro_type_script_index_0_lang.Dox4"
    // Find the corresponding file in destDir
    let baseName = srcFile.split('.astro_astro_type_script')[0];
    
    let matchingDest = destFiles.find(df => df.startsWith(baseName));
    if (matchingDest) {
        fs.copyFileSync(path.join(srcDir, srcFile), path.join(destDir, matchingDest));
        console.log('Restored pristine file for: ' + matchingDest);
    }
});
