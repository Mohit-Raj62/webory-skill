const sharp = require('sharp');
const Tesseract = require('tesseract.js');

const testSvgSans = `
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="50" font-family="sans-serif" font-size="20">WEBORY SKILLS</text>
  <text x="10" y="80" font-family="serif" font-size="20">APPROVED</text>
</svg>
`;

const testSvgArial = `
<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="50" font-family="'Times New Roman', serif" font-size="20">WEBORY SKILLS</text>
  <text x="10" y="80" font-family="'Arial Black', Impact, sans-serif" font-size="20">APPROVED</text>
</svg>
`;

async function test() {
  const bufSans = await sharp(Buffer.from(testSvgSans)).png().toBuffer();
  const bufArial = await sharp(Buffer.from(testSvgArial)).png().toBuffer();
  
  console.log("Testing Sans...");
  const resSans = await Tesseract.recognize(bufSans, 'eng');
  console.log("Sans Result:", resSans.data.text.trim());

  console.log("Testing Arial...");
  const resArial = await Tesseract.recognize(bufArial, 'eng');
  console.log("Arial Result:", resArial.data.text.trim());
}

test();
