const { createCanvas } = require('canvas');
const fs = require('fs');

// Top Stamp
const topCanvas = createCanvas(220, 110);
const ctx1 = topCanvas.getContext('2d');
ctx1.translate(10, 10);
ctx1.rotate(-3 * Math.PI / 180);

// Outer rect
ctx1.strokeStyle = 'rgba(0, 51, 102, 0.85)';
ctx1.lineWidth = 4;
ctx1.setLineDash([100, 1, 50, 2, 20, 1]);
ctx1.strokeRect(0, 0, 200, 90);

// Inner rect
ctx1.strokeStyle = 'rgba(0, 51, 102, 0.8)';
ctx1.lineWidth = 1.5;
ctx1.setLineDash([40, 1, 20, 1, 80, 2]);
ctx1.strokeRect(4, 4, 192, 82);

// Text 1
ctx1.fillStyle = 'rgba(0, 51, 102, 0.9)';
ctx1.font = 'bold 14px "Times New Roman"';
ctx1.textAlign = 'center';
ctx1.fillText('WEBORY SKILLS', 100, 24);

// Line 1
ctx1.beginPath();
ctx1.moveTo(15, 30);
ctx1.lineTo(185, 30);
ctx1.setLineDash([50, 1, 30, 1]);
ctx1.stroke();

// Text 2
ctx1.fillStyle = 'rgba(0, 51, 102, 0.85)';
ctx1.font = '900 28px "Arial Black", Arial';
ctx1.fillText('APPROVED', 100, 58);

// Line 2
ctx1.beginPath();
ctx1.moveTo(15, 68);
ctx1.lineTo(185, 68);
ctx1.setLineDash([20, 1, 60, 1]);
ctx1.stroke();

// Text 3
ctx1.fillStyle = 'rgba(0, 51, 102, 0.8)';
ctx1.font = 'bold 10px Courier';
ctx1.textAlign = 'left';
ctx1.fillText('DATE:', 50, 82);

// Line 3
ctx1.beginPath();
ctx1.moveTo(85, 82);
ctx1.lineTo(175, 82);
ctx1.setLineDash([2, 2]);
ctx1.stroke();

const topBase64 = topCanvas.toBuffer('image/png').toString('base64');
fs.writeFileSync('src/lib/top_stamp.json', JSON.stringify(topBase64));


// Bottom Stamp
const bottomCanvas = createCanvas(350, 150);
const ctx2 = bottomCanvas.getContext('2d');
ctx2.rotate(-1 * Math.PI / 180);

ctx2.translate(75, 75);

// Circles
ctx2.strokeStyle = 'rgba(0, 51, 102, 0.8)';
ctx2.lineWidth = 1.5;
ctx2.setLineDash([2, 2]);
ctx2.beginPath(); ctx2.arc(0, 0, 55, 0, Math.PI*2); ctx2.stroke();

ctx2.strokeStyle = 'rgba(0, 51, 102, 0.85)';
ctx2.lineWidth = 3;
ctx2.setLineDash([100, 1, 40, 1, 80, 2]);
ctx2.beginPath(); ctx2.arc(0, 0, 50, 0, Math.PI*2); ctx2.stroke();

ctx2.strokeStyle = 'rgba(0, 51, 102, 0.8)';
ctx2.lineWidth = 1;
ctx2.setLineDash([50, 1, 20, 1]);
ctx2.beginPath(); ctx2.arc(0, 0, 32, 0, Math.PI*2); ctx2.stroke();

// Text
ctx2.fillStyle = 'rgba(0, 51, 102, 0.9)';
ctx2.font = '900 18px "Times New Roman"';
ctx2.textAlign = 'center';
ctx2.fillText('WEBORY', 0, -12);

ctx2.fillStyle = 'rgba(0, 51, 102, 0.85)';
ctx2.font = '10px Arial';
ctx2.fillText('SKILLS', 0, 6);

ctx2.beginPath();
ctx2.moveTo(-20, 14);
ctx2.lineTo(20, 14);
ctx2.setLineDash([]);
ctx2.stroke();

ctx2.fillStyle = 'rgba(0, 51, 102, 0.8)';
ctx2.font = 'bold 6px Arial';
ctx2.fillText('OFFICIAL SEAL', 0, 24);


ctx2.translate(-75 + 160, -75 + 20);

// Signature
ctx2.strokeStyle = 'rgba(15, 23, 42, 0.85)';
ctx2.lineWidth = 2.5;
ctx2.setLineDash([]);
ctx2.beginPath();
ctx2.moveTo(15, 60);
ctx2.bezierCurveTo(25, 25, 30, 10, 40, 55);
ctx2.bezierCurveTo(45, 75, 50, 35, 60, 30);
ctx2.bezierCurveTo(65, 25, 75, 55, 85, 60);
ctx2.bezierCurveTo(95, 65, 100, 45, 110, 50);
ctx2.bezierCurveTo(120, 55, 125, 70, 135, 65);
ctx2.bezierCurveTo(145, 60, 150, 45, 155, 45);
ctx2.bezierCurveTo(160, 45, 160, 60, 165, 55);
ctx2.stroke();

// Swirl
ctx2.strokeStyle = 'rgba(15, 23, 42, 0.6)';
ctx2.lineWidth = 1.5;
ctx2.beginPath();
ctx2.moveTo(5, 75);
ctx2.quadraticCurveTo(80, 95, 160, 70);
ctx2.bezierCurveTo(150, 85, 120, 85, 100, 80);
ctx2.stroke();

// Box
ctx2.strokeStyle = 'rgba(71, 85, 105, 0.5)';
ctx2.lineWidth = 0.75;
ctx2.setLineDash([3, 3]);
ctx2.strokeRect(0, 5, 180, 100);

ctx2.fillStyle = 'rgba(30, 41, 59, 1)';
ctx2.font = '900 11px Arial';
ctx2.fillText('AUTHORIZED SIGNATORY', 90, 88);

ctx2.fillStyle = 'rgba(71, 85, 105, 1)';
ctx2.font = 'italic 9px Arial';
ctx2.fillText('Webory Skills Pvt. Ltd.', 90, 100);

const bottomBase64 = bottomCanvas.toBuffer('image/png').toString('base64');
fs.writeFileSync('src/lib/bottom_stamp.json', JSON.stringify(bottomBase64));

console.log("Successfully created base64 json files from node-canvas.");
