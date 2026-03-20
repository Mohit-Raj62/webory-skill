import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

export function usePyodide() {
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [isPyodideRunning, setIsPyodideRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const resolvesRef = useRef<
    Record<string, { resolve: (val: any) => void; reject: (err: any) => void }>
  >({});

  useEffect(() => {
    // Initialize Web Worker
    const workerUrl = new URL(
      "../components/playground/pyodide.worker.ts",
      import.meta.url,
    );
    console.log("[usePyodide] Creating Web Worker from:", workerUrl.href);

    workerRef.current = new Worker(workerUrl);

    workerRef.current.onerror = (e) => {
      console.error("[usePyodide] Web Worker execution error:", e.message, e);
      toast.error("Failed to initialize Python environment. Check console.");
    };

    workerRef.current.onmessage = (e) => {
      const { id, type, output, error } = e.data;

      if (type === "INIT_DONE") {
        setIsPyodideReady(true);
        return;
      }

      if (resolvesRef.current[id]) {
        if (type === "SUCCESS") {
          resolvesRef.current[id].resolve({ output });
        } else if (type === "ERROR") {
          resolvesRef.current[id].reject(
            new Error(error + (output ? "\\n" + output : "")),
          );
        }
        delete resolvesRef.current[id];
      }
    };

    // Trigger initialization
    workerRef.current.postMessage({ type: "INIT" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runPython = useCallback(async (code: string): Promise<string> => {
    if (!workerRef.current) throw new Error("Worker not initialized");

    setIsPyodideRunning(true);
    const id = Math.random().toString(36).substr(2, 9);

    return new Promise((resolve, reject) => {
      resolvesRef.current[id] = { resolve, reject };
      workerRef.current?.postMessage({ id, type: "RUN", code });
    })
      .then((res: any) => {
        setIsPyodideRunning(false);
        return res.output || "Execution finished successfully.";
      })
      .catch((err) => {
        setIsPyodideRunning(false);
        throw err;
      });
  }, []);

  return { runPython, isPyodideReady, isPyodideRunning };
}
