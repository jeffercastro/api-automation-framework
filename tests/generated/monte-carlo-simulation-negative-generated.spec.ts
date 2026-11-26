/**
 * AUTO-GENERATED NEGATIVE & FUZZING PLAYWRIGHT TEST SUITE
 * Resource: monte-carlo-simulation
 */
import { test, expect } from '@playwright/test';
import { MonteCarloSimulationClient } from '../../src/api/monte-carlo-simulation.client';

test.describe('MonteCarloSimulation API — Autonomous Negative & Boundary Fuzz Tests', () => {
  test('POST /api/v1/simulation/monte-carlo — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const response = await client.runMonteCarlo({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_value":10000,"horizon_years":10,"monthly_contribution":0,"n_paths":5000,"inflation_rate":0.035,"random_seed":42,"include_cone":true,"cone_points":200,"include_full_paths":false});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/simulation/monte-carlo`).toContain(response.status());
  });

  test('POST /api/v1/simulation/monte-carlo — boundary violation on "initial_value" (< min 0) returns 400/422', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const response = await client.runMonteCarlo({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_value":-10,"horizon_years":10,"monthly_contribution":0,"n_paths":5000,"inflation_rate":0.035,"random_seed":42,"include_cone":true,"cone_points":200,"include_full_paths":false});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/simulation/monte-carlo`).toContain(response.status());
  });

  test('POST /api/v1/simulation/sensitivity — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const response = await client.runSensitivity({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_value":10000,"monthly_contribution":500,"horizon_years":20,"n_paths":2000});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/simulation/sensitivity`).toContain(response.status());
  });

  test('POST /api/v1/simulation/sensitivity — boundary violation on "initial_value" (< min 0) returns 400/422', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const response = await client.runSensitivity({"tickers":["SPY","BND","GLD"],"start_date":"2015-01-01","initial_value":-10,"monthly_contribution":500,"horizon_years":20,"n_paths":2000});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/simulation/sensitivity`).toContain(response.status());
  });

  test('POST /api/v1/simulation/probability — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new MonteCarloSimulationClient(request);
    const response = await client.probabilityAnalysis({"tickers":"__not_an_array__","start_date":"2015-01-01","initial_value":10000,"monthly_contribution":500,"horizon_years":20,"target_values":[50000,100000,250000,500000,1000000],"n_paths":5000});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/simulation/probability`).toContain(response.status());
  });
});
