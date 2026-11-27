/**
 * AUTO-GENERATED PERFORMANCE & LOAD BENCHMARK SUITE
 * Resource: backtesting
 */
import { test, expect } from '@playwright/test';
import { BacktestingClient } from '../../src/api/backtesting.client';
import { runLoadBenchmark } from '../../src/utils/perf-runner';

test.describe('Backtesting API — Performance & Latency Benchmarks', () => {
  test('POST /api/v1/backtest/buy-and-hold — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new BacktestingClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/backtest/buy-and-hold',
      executeRequest: () => client.runBuyAndHold({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('POST /api/v1/backtest/dca — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new BacktestingClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/backtest/dca',
      executeRequest: () => client.runDca({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"periodic_investment":500,"frequency":"monthly"}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('POST /api/v1/backtest/all-weather — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new BacktestingClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/backtest/all-weather',
      executeRequest: () => client.runAllWeather({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"rebalance_frequency":"quarterly"}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('POST /api/v1/backtest/momentum — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new BacktestingClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/backtest/momentum',
      executeRequest: () => client.runMomentum({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"ticker":"SPY","fast_sma":50,"slow_sma":200,"cash_ticker":"BND"}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('POST /api/v1/backtest/optimize — Load & Latency Benchmark (P95 < 10000ms)', async ({ request }) => {
    const client = new BacktestingClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/backtest/optimize',
      executeRequest: () => client.optimizePortfolio({"tickers":["SPY","QQQ","BND","GLD","TLT"],"start_date":"2015-01-01","n_frontier_points":50,"n_random_portfolios":2000}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(10000);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });

  test('POST /api/v1/backtest/compare — Load & Latency Benchmark (P95 < 2500ms)', async ({ request }) => {
    const client = new BacktestingClient(request);
    const metrics = await runLoadBenchmark({
      label: 'POST /api/v1/backtest/compare',
      executeRequest: () => client.compareAllStrategies({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"periodic_investment":500,"frequency":"monthly"}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(2500);
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });
});
