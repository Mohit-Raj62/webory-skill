const https = require("http");

const data = JSON.stringify({
  language: "python",
  version: "3.10.0",
  content: "print('Hello Piston')",
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/code/run",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = https.request(options, (res) => {
  console.log(`StatusCode: ${res.statusCode}`);
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    console.log("Response Body:", responseData);
  });
});

req.on("error", (error) => {
  console.error("Error:", error);
});

req.write(data);
req.end();
