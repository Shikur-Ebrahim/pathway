const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const input = path.join('public', 'logo.png');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  fs.mkdirSync(path.join('public', 'icons'), { recursive: true });
  for (const size of sizes) {
    await sharp(input)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join('public', 'icons', `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }
  // apple touch icon
  await sharp(input)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join('public', 'icons', 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
  console.log('DONE');
}

generate().catch(console.error);
