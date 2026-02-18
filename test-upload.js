const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");
const path = require("path");

async function testUploadAndDownload() {
  try {
    // 1. Upload
    const form = new FormData();
    form.append("file", fs.createReadStream("real_dummy.pdf"));

    console.log("Uploading...");
    const res = await fetch("http://localhost:3000/api/upload/resume", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    console.log("Upload response:", JSON.stringify(data, null, 2));

    if (!data.success || !data.url) {
      console.error("Upload failed");
      return;
    }

    // 2. Download from Proxy
    console.log("Downloading from Proxy URL:", data.url);
    const fileRes = await fetch(data.url);

    if (!fileRes.ok) {
      console.error("Download failed:", fileRes.status, fileRes.statusText);
      return;
    }

    console.log("Headers:");
    fileRes.headers.forEach((val, key) => console.log(`${key}: ${val}`));

    const buffer = await fileRes.buffer();
    fs.writeFileSync("downloaded_test.pdf", buffer);
    console.log("Downloaded to downloaded_test.pdf, size:", buffer.length);

    // 3. Verify Magic Bytes
    const header = buffer.slice(0, 5).toString();
    console.log("File Header:", header);
    if (header.startsWith("%PDF-")) {
      console.log("VALID PDF");
    } else {
      console.error("INVALID PDF HEADER");
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

testUploadAndDownload();
