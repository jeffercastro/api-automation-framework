/**
 * AUTO-GENERATED NEGATIVE & FUZZING PLAYWRIGHT TEST SUITE
 * Resource: backtesting
 */
import { test, expect } from '@playwright/test';
import { BacktestingClient } from '../../src/api/backtesting.client';

test.describe('Backtesting API — Autonomous Negative & Boundary Fuzz Tests', () => {
  test('POST /api/v1/backtest/buy-and-hold — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runBuyAndHold({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/buy-and-hold`).toContain(response.status());
  });

  test('POST /api/v1/backtest/buy-and-hold — boundary violation on "initial_capital" (< min 0) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runBuyAndHold({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":-10,"annual_fee_bps":10,"include_timeseries":true});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/buy-and-hold`).toContain(response.status());
  });

  test('POST /api/v1/backtest/dca — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runDca({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"periodic_investment":500,"frequency":"monthly"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/dca`).toContain(response.status());
  });

  test('POST /api/v1/backtest/dca — boundary violation on "initial_capital" (< min 0) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runDca({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":-10,"annual_fee_bps":10,"include_timeseries":true,"periodic_investment":500,"frequency":"monthly"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/dca`).toContain(response.status());
  });

  test('POST /api/v1/backtest/all-weather — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runAllWeather({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"rebalance_frequency":"quarterly"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/all-weather`).toContain(response.status());
  });

  test('POST /api/v1/backtest/all-weather — boundary violation on "initial_capital" (< min 0) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runAllWeather({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":-10,"annual_fee_bps":10,"include_timeseries":true,"rebalance_frequency":"quarterly"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/all-weather`).toContain(response.status());
  });

  test('POST /api/v1/backtest/momentum — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runMomentum({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"ticker":"SPY","fast_sma":50,"slow_sma":200,"cash_ticker":"BND"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/momentum`).toContain(response.status());
  });

  test('POST /api/v1/backtest/momentum — boundary violation on "initial_capital" (< min 0) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.runMomentum({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":-10,"annual_fee_bps":10,"include_timeseries":true,"ticker":"SPY","fast_sma":50,"slow_sma":200,"cash_ticker":"BND"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/momentum`).toContain(response.status());
  });

  test('POST /api/v1/backtest/optimize — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.optimizePortfolio({"tickers":"__not_an_array__","start_date":"2015-01-01","n_frontier_points":50,"n_random_portfolios":2000});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/optimize`).toContain(response.status());
  });

  test('POST /api/v1/backtest/optimize — boundary violation on "n_frontier_points" (< min 10) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.optimizePortfolio({"tickers":["SPY","QQQ","BND","GLD","TLT"],"start_date":"2015-01-01","n_frontier_points":0,"n_random_portfolios":2000});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/optimize`).toContain(response.status());
  });

  test('POST /api/v1/backtest/compare — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.compareAllStrategies({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_capital":10000,"annual_fee_bps":10,"include_timeseries":true,"periodic_investment":500,"frequency":"monthly"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/compare`).toContain(response.status());
  });

  test('POST /api/v1/backtest/compare — boundary violation on "initial_capital" (< min 0) returns 400/422', async ({ request }) => {
    const client = new BacktestingClient(request);
    const response = await client.compareAllStrategies({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_capital":-10,"annual_fee_bps":10,"include_timeseries":true,"periodic_investment":500,"frequency":"monthly"});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/backtest/compare`).toContain(response.status());
  });
});
