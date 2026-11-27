/**
 * AUTO-GENERATED PERFORMANCE & LOAD BENCHMARK SUITE
 * Resource: assets
 */
import { test, expect } from '@playwright/test';
import { AssetsClient } from '../../src/api/assets.client';
import { runLoadBenchmark } from '../../src/utils/perf-runner';

test.describe('Assets API — Performance & Latency Benchmarks', () => {
  test('GET /api/v1/assets/ — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new AssetsClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /api/v1/assets/',
      executeRequest: () => client.listAssets(),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('GET /api/v1/assets/summary — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new AssetsClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /api/v1/assets/summary',
      executeRequest: () => client.assetSummary(),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('GET /api/v1/assets/{ticker}/prices — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new AssetsClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /api/v1/assets/{ticker}/prices',
      executeRequest: () => client.getPrices('SPY'),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('GET /api/v1/assets/{ticker}/returns — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new AssetsClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /api/v1/assets/{ticker}/returns',
      executeRequest: () => client.getReturns('SPY'),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('GET /api/v1/assets/macro/{series_name} — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new AssetsClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /api/v1/assets/macro/{series_name}',
      executeRequest: () => client.getMacro('cpi_inflation'),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });
});
