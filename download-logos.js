const https = require('https');
const fs = require('fs');
const path = require('path');

const logos = [
  { url: 'https://upload.wikimedia.org/wikipedia/en/9/90/Skill_India_logo.png', file: 'skill-india.png' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/AICTE_Logo.png/320px-AICTE_Logo.png', file: 'aicte.png' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Ministry_of_Education_India.svg/320px-Ministry_of_Education_India.svg.png', file: 'moe.png' },
  { url: 'https://msme.gov.in/sites/all/themes/msmsednew/images/MSME_Logo.png', file: 'msme.png' }
];

const targetDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

logos.forEach(logo => {
  const filePath = path.join(targetDir, logo.file);
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };
  
  https.get(logo.url, options, (res) => {
    if (res.statusCode === 200) {
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${logo.file}`);
      });
    } else {
      console.log(`Failed to download ${logo.file}: ${res.statusCode}`);
      // Handle redirects if needed (not implementing here for simplicity, but Wikipedia usually works with this UA)
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${logo.file}:`, err.message);
  });
});
