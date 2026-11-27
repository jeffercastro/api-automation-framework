/**
 * AUTO-GENERATED PERFORMANCE & LOAD BENCHMARK SUITE
 * Resource: default
 */
import { test, expect } from '@playwright/test';
import { DefaultClient } from '../../src/api/default.client';
import { runLoadBenchmark } from '../../src/utils/perf-runner';

test.describe('Default API — Performance & Latency Benchmarks', () => {
  test('GET /health — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new DefaultClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /health',
      executeRequest: () => client.healthHealthGet(),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('GET / — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new DefaultClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /',
      executeRequest: () => client.rootGet(),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('GET /dashboard — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new DefaultClient(request);
    const metrics = await runLoadBenchmark({
      label: 'GET /dashboard',
      executeRequest: () => client.dashboardDashboardGet(),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });
});
