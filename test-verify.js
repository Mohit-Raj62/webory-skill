const http = require('http');

const testId = '660000000000000000000000'; // Random ObjectId
const url = `http://localhost:3000/api/verify-certificate/${testId}`;

console.log(`Testing URL: ${url}`);

const req = http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log('Response Body:');
    try {
        console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
        console.log(data);
    }
    
    if (res.statusCode === 500) {
        console.error('❌ FAILED: API returned 500 Internal Server Error');
        process.exit(1);
    } else if (res.statusCode === 404) {
        console.log('✅ PASSED: API returned 404 (Expected for random ID)');
    } else {
        console.log('❓ UNEXPECTED: API returned ' + res.statusCode);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Connection error. Is the server running?');
  process.exit(1);
});
