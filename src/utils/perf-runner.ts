/**
 * Lightweight Concurrent Load & Latency Benchmark Runner
 * ======================================================
 * Executes batched concurrent API requests and computes throughput (RPS),
 * percentile latencies (P50, P95, P99), and 5xx/network error rates.
 */
import { APIResponse } from '@playwright/test';

export interface BenchmarkOptions {
  label: string;
  concurrency?: number;
  iterations?: number;
  executeRequest: () => Promise<APIResponse>;
}

export interface BenchmarkMetrics {
  label: string;
  iterations: number;
  concurrency: number;
  totalDurationMs: number;
  rps: number;
  minMs: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
  serverErrors: number;
  errorRatePct: number;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

/**
 * Run a concurrent load benchmark using a worker-pool pattern.
 */
export async function runLoadBenchmark(opts: BenchmarkOptions): Promise<BenchmarkMetrics> {
  const concurrency = Math.max(1, opts.concurrency ?? (Number(process.env.PERF_CONCURRENCY) || 5));
  const iterations = Math.max(1, opts.iterations ?? (Number(process.env.PERF_ITERATIONS) || 20));

  const latencies: number[] = [];
  let serverErrors = 0;
  let nextIdx = 0;

  const suiteStart = performance.now();

  async function worker(): Promise<void> {
    while (true) {
      const current = nextIdx++;
      if (current >= iterations) break;

      const reqStart = performance.now();
      try {
        const resp = await opts.executeRequest();
        const elapsed = performance.now() - reqStart;
        latencies.push(elapsed);
        if (resp.status() >= 500) {
          if (serverErrors === 0) console.warn(`[PERF WARN] ${opts.label} returned HTTP ${resp.status()}`);
          serverErrors++;
        }
      } catch (err: any) {
        const elapsed = performance.now() - reqStart;
        latencies.push(elapsed);
        if (serverErrors === 0) console.warn(`[PERF ERR] ${opts.label} threw:`, err?.message || err);
        serverErrors++;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, iterations) }, () => worker());
  await Promise.all(workers);

  const totalDurationMs = Math.max(1, performance.now() - suiteStart);
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);

  const metrics: BenchmarkMetrics = {
    label: opts.label,
    iterations,
    concurrency,
    totalDurationMs: Number(totalDurationMs.toFixed(1)),
    rps: Number(((iterations / totalDurationMs) * 1000).toFixed(2)),
    minMs: Number((sorted[0] ?? 0).toFixed(2)),
    avgMs: Number((sum / Math.max(1, sorted.length)).toFixed(2)),
    p50Ms: Number(percentile(sorted, 50).toFixed(2)),
    p95Ms: Number(percentile(sorted, 95).toFixed(2)),
    p99Ms: Number(percentile(sorted, 99).toFixed(2)),
    maxMs: Number((sorted[sorted.length - 1] ?? 0).toFixed(2)),
    serverErrors,
    errorRatePct: Number(((serverErrors / iterations) * 100).toFixed(2)),
  };

  console.log(
    `[PERF] ${metrics.label} | ${metrics.iterations} reqs (c=${metrics.concurrency}) | ` +
      `RPS=${metrics.rps} | P50=${metrics.p50Ms}ms | P95=${metrics.p95Ms}ms | P99=${metrics.p99Ms}ms | Err=${metrics.errorRatePct}%`
  );

  return metrics;
}
