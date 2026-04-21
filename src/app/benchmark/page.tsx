"use client";

import { useState } from "react";

type Result = {
  total: number;
  success: number;
  failed: number;
  avg: number;
  min: number;
  max: number;
  duration: number;
};

export default function BenchmarkPage() {
  const [url, setUrl] = useState("");
  const [total, setTotal] = useState(100);
  const [concurrency, setConcurrency] = useState(10);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function runBenchmark() {
    if (!url) return;
    setRunning(true);
    setResult(null);

    let success = 0;
    let failed = 0;
    const times: number[] = [];

    let completed = 0;
    let started = 0;

    const startTime = performance.now();

    async function worker() {
      while (started < total) {
        const current = started++;
        if (current >= total) break;

        const t0 = performance.now();

        try {
          const res = await fetch(url);
          const t1 = performance.now();

          times.push(t1 - t0);

          if (res.ok) success++;
          else failed++;
        } catch {
          failed++;
        }

        completed++;
      }
    }

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);

    const endTime = performance.now();

    const avg = times.reduce((a, b) => a + b, 0) / (times.length || 1);
    const min = Math.min(...times);
    const max = Math.max(...times);

    setResult({
      total,
      success,
      failed,
      avg: Number(avg.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      duration: Number((endTime - startTime).toFixed(2)),
    });

    setRunning(false);
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>API Benchmark Tool</h1>

      <div style={{ marginBottom: 12 }}>
        <input placeholder="API URL" value={url} onChange={(e) => setUrl(e.target.value)} style={{ width: 400 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Total Requests: </label>
        <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Concurrency: </label>
        <input type="number" value={concurrency} onChange={(e) => setConcurrency(Number(e.target.value))} />
      </div>

      <button onClick={runBenchmark} disabled={running}>
        {running ? "Running..." : "Start Benchmark"}
      </button>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Results</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
