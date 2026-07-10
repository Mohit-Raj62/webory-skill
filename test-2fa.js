const { authenticator } = require('otplib');
const QRCode = require('qrcode');

const secret = authenticator.generateSecret();
const otpauth = authenticator.keyuri('test@example.com', 'Webory Skills', secret);
console.log('Secret:', secret);
console.log('URI:', otpauth);
