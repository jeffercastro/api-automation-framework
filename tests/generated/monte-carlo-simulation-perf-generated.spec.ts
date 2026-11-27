/**
 * AUTO-GENERATED PERFORMANCE & LOAD BENCHMARK SUITE
 * Resource: monte-carlo-simulation
 */
import { test, expect } from '@playwright/test';
import { MonteCarloSimulationClient } from '../../src/api/monte-carlo-simulation.client';
import { runLoadBenchmark } from '../../src/utils/perf-runner';

test.describe('MonteCarloSimulation API — Performance & Latency Benchmarks', () => {
  test('POST /api/v1/simulation/monte-carlo — Load & Latency Benchmark (P95 < 10000ms)', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/simulation/monte-carlo',
      executeRequest: () => client.runMonteCarlo({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_value":10000,"horizon_years":10,"monthly_contribution":0,"n_paths":5000,"inflation_rate":0.035,"random_seed":42,"include_cone":true,"cone_points":200,"include_full_paths":false}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(10000);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('POST /api/v1/simulation/sensitivity — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/simulation/sensitivity',
      executeRequest: () => client.runSensitivity({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_value":10000,"monthly_contribution":500,"horizon_years":20,"n_paths":2000}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('POST /api/v1/simulation/probability — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/simulation/probability',
      executeRequest: () => client.probabilityAnalysis({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_value":10000,"monthly_contribution":500,"horizon_years":20,"target_values":[50000,100000,250000,500000,1000000],"n_paths":5000}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });
});
