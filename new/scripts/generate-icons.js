const sharp = require('sharp');
const path = require('path');

const svgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="#0f172a"/>
  <text x="256" y="370" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="350" fill="url(#g)">H</text>
</svg>`);

const outDir = path.resolve(__dirname, '../public');

async function generate() {
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(outDir, 'icon-192.png'));
  console.log('✓ icon-192.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(outDir, 'icon-512.png'));
  console.log('✓ icon-512.png');
}

generate().catch(console.error);
