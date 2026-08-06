const sharp = require('sharp');
const Tesseract = require('tesseract.js');

const approvedStampSvg = `
<svg width="220" height="110" xmlns="http://www.w3.org/2000/svg">
  <g>
    <rect x="0" y="0" width="200" height="90" fill="none" stroke="#003366" stroke-width="4" rx="4" stroke-dasharray="100 1 50 2 20 1" opacity="0.85" />
    <rect x="4" y="4" width="192" height="82" fill="none" stroke="#003366" stroke-width="1.5" rx="2" stroke-dasharray="40 1 20 1 80 2" opacity="0.8" />
    
    <text x="100" y="22" font-family="serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#003366" text-anchor="middle" opacity="0.9">WEBORY SKILLS</text>
    
    <line x1="15" y1="30" x2="185" y2="30" stroke="#003366" stroke-width="1.5" stroke-dasharray="50 1 30 1" opacity="0.8" />
    
    <text x="100" y="58" font-family="sans-serif" font-size="28" font-weight="900" letter-spacing="4" fill="#003366" text-anchor="middle" opacity="0.85">APPROVED</text>
    
    <line x1="15" y1="68" x2="185" y2="68" stroke="#003366" stroke-width="1.5" stroke-dasharray="20 1 60 1" opacity="0.8" />
    
    <text x="50" y="82" font-family="monospace" font-size="10" font-weight="bold" fill="#003366" opacity="0.8">DATE:</text>
    <line x1="85" y1="82" x2="175" y2="82" stroke="#003366" stroke-width="1" stroke-dasharray="2 2" opacity="0.8" />
  </g>
</svg>
`;

const signatureStampSvg = `
<svg width="350" height="150" xmlns="http://www.w3.org/2000/svg">
  <g>
    <g transform="translate(75, 75)">
      <circle cx="0" cy="0" r="55" fill="none" stroke="#003366" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.8" />
      <circle cx="0" cy="0" r="50" fill="none" stroke="#003366" stroke-width="3" stroke-dasharray="100 1 40 1 80 2" opacity="0.85" />
      <circle cx="0" cy="0" r="32" fill="none" stroke="#003366" stroke-width="1" stroke-dasharray="50 1 20 1" opacity="0.8" />
      
      <text x="0" y="-12" font-family="serif" font-size="18" font-weight="900" fill="#003366" text-anchor="middle" opacity="0.9">WEBORY</text>
      <text x="0" y="6" font-family="sans-serif" font-size="10" letter-spacing="3" fill="#003366" text-anchor="middle" opacity="0.85">SKILLS</text>
      <line x1="-20" y1="14" x2="20" y2="14" stroke="#003366" stroke-width="1" opacity="0.7"/>
      <text x="0" y="24" font-family="sans-serif" font-size="6" letter-spacing="1" font-weight="bold" fill="#003366" text-anchor="middle" opacity="0.8">OFFICIAL SEAL</text>
    </g>
    <g transform="translate(160, 20)">
      <path d="M 15,60 C 25,25 30,10 40,55 C 45,75 50,35 60,30 C 65,25 75,55 85,60 C 95,65 100,45 110,50 C 120,55 125,70 135,65 C 145,60 150,45 155,45 C 160,45 160,60 165,55" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />
      
      <path d="M 5,75 Q 80,95 160,70 C 150,85 120,85 100,80" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
      
      <rect x="0" y="5" width="180" height="100" fill="none" stroke="#475569" stroke-width="0.75" stroke-dasharray="3 3" opacity="0.5" />
      
      <text x="90" y="88" font-family="sans-serif" font-size="11" font-weight="900" letter-spacing="1.5" fill="#1e293b" text-anchor="middle">AUTHORIZED SIGNATORY</text>
      <text x="90" y="100" font-family="sans-serif" font-size="9" font-style="italic" fill="#475569" text-anchor="middle">Webory Skills Pvt. Ltd.</text>
    </g>
  </g>
</svg>
`;

async function test() {
  const bufTop = await sharp(Buffer.from(approvedStampSvg)).png().toBuffer();
  const bufBottom = await sharp(Buffer.from(signatureStampSvg)).png().toBuffer();
  
  console.log("Testing top stamp...");
  const resTop = await Tesseract.recognize(bufTop, 'eng');
  console.log("Top Result:", resTop.data.text.trim());

  console.log("Testing bottom stamp...");
  const resBottom = await Tesseract.recognize(bufBottom, 'eng');
  console.log("Bottom Result:", resBottom.data.text.trim());
}

test();
