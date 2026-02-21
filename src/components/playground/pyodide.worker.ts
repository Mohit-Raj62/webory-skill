declare var importScripts: (...urls: string[]) => void;
declare var loadPyodide: any;

let pyodide: any = null;
let isInitializing = false;

// Custom stdout/stderr buffer
let outputBuffer: string[] = [];

console.log("[Pyodide Worker] Web Worker parsed and started.");

// Import pyodide from CDN directly to avoid Next.js bundling issues
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

async function initPyodide() {
  if (pyodide) return pyodide;
  if (isInitializing) {
    // Wait until initialized if another request started it
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return pyodide!;
  }

  isInitializing = true;
  try {
    console.log("[Pyodide Worker] Starting loadPyodide...");
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      stdout: (msg: string) => outputBuffer.push(msg),
      stderr: (msg: string) => outputBuffer.push(msg),
    });
    console.log("[Pyodide Worker] Pyodide loaded successfully.");

    // Load micropip for custom package installations
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

self.onmessage = async (e: MessageEvent) => {
  const { id, type, code } = e.data;

  if (type === "INIT") {
    console.log("[Pyodide Worker] Received INIT request");
    try {
      await initPyodide();
      console.log("[Pyodide Worker] Sending INIT_DONE");
      self.postMessage({ id, type: "INIT_DONE" });
    } catch (err: any) {
      console.error("[Pyodide Worker] Error during INIT:", err);
      self.postMessage({ id, type: "ERROR", error: err.message });
    }
    return;
  }

  if (type === "RUN") {
    outputBuffer = []; // Clear previous output
    try {
      const py = await initPyodide();

      // Extract imports and load packages
      await py.loadPackagesFromImports(code);

      // Optionally try to auto-install missing pure python packages via micropip
      // For now, loadPackagesFromImports handles most data science packages (numpy, pandas, etc.)

      // Run the code
      await py.runPythonAsync(code);

      self.postMessage({
        id,
        type: "SUCCESS",
        output: outputBuffer.join("\\n"),
      });
    } catch (err: any) {
      // Append any error to the output buffer or send as error
      self.postMessage({
        id,
        type: "ERROR",
        error: err.message,
        output: outputBuffer.join("\\n"),
      });
    }
  }
};
