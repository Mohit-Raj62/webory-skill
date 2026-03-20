// Use importScripts for better compatibility across subdomains and deployments
// @ts-ignore
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodide = null;
let isInitializing = false;

// Custom stdout/stderr buffer
let outputBuffer = [];

console.log("[Pyodide Worker] Web Worker started from public folder.");

async function initPyodide() {
  if (pyodide) return pyodide;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return pyodide;
  }

  isInitializing = true;
  try {
    console.log("[Pyodide Worker] Starting loadPyodide...");
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      stdout: (msg) => outputBuffer.push(msg),
      stderr: (msg) => outputBuffer.push(msg),
    });
    console.log("[Pyodide Worker] Pyodide loaded successfully.");

    console.log("[Pyodide Worker] Loading micropip...");
    await pyodide.loadPackage("micropip");
    console.log("[Pyodide Worker] micropip loaded.");
  } catch (err) {
    console.error("[Pyodide Worker] Initialization failed:", err);
    throw err;
  } finally {
    isInitializing = false;
  }
  return pyodide;
}

self.onmessage = async (e) => {
  const { id, type, code } = e.data;

  if (type === "INIT") {
    console.log("[Pyodide Worker] Received INIT request");
    try {
      await initPyodide();
      console.log("[Pyodide Worker] Sending INIT_DONE");
      self.postMessage({ id, type: "INIT_DONE" });
    } catch (err) {
      console.error("[Pyodide Worker] Error during INIT:", err);
      self.postMessage({ id, type: "ERROR", error: err.message });
    }
    return;
  }

  if (type === "RUN") {
    outputBuffer = []; // Clear previous output
    try {
      const py = await initPyodide();
      await py.loadPackagesFromImports(code);
      await py.runPythonAsync(code);

      self.postMessage({
        id,
        type: "SUCCESS",
        output: outputBuffer.join("\n"),
      });
    } catch (err) {
      self.postMessage({
        id,
        type: "ERROR",
        error: err.message,
        output: outputBuffer.join("\n"),
      });
    }
  }
};
