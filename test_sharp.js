const sharp = require('sharp');
const fs = require('fs');

const testSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="50" font-family="sans-serif" font-size="20">Hello World</text>
  <text x="10" y="80" font-family="'Arial Black', Impact, sans-serif" font-size="20">Hello World 2</text>
</svg>
`;

sharp(Buffer.from(testSvg))
  .png()
  .toBuffer()
  .then(buffer => {
    fs.writeFileSync('test.png', buffer);
    console.log('Successfully generated test.png (size: ' + buffer.length + ')');
  })
  .catch(e => console.error(e));
