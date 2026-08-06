const fs = require('fs');
const Tesseract = require('tesseract.js');

const topStampBase64 = JSON.parse(fs.readFileSync('src/lib/top_stamp.json', 'utf8'));
const bottomStampBase64 = JSON.parse(fs.readFileSync('src/lib/bottom_stamp.json', 'utf8'));

const topBuffer = Buffer.from(topStampBase64, 'base64');
const bottomBuffer = Buffer.from(bottomStampBase64, 'base64');

async function test() {
  console.log("Testing top stamp...");
  const resTop = await Tesseract.recognize(topBuffer, 'eng');
  console.log("Top Result:", resTop.data.text.trim());

  console.log("Testing bottom stamp...");
  const resBottom = await Tesseract.recognize(bottomBuffer, 'eng');
  console.log("Bottom Result:", resBottom.data.text.trim());
}

test();
