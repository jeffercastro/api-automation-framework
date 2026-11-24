/**
 * AUTO-GENERATED PLAYWRIGHT TEST SUITE
 * Resource: backtesting
 */
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { BacktestingClient } from '../../src/api/backtesting.client';
import {
  runBuyAndHoldResponseSchema,
  runDcaResponseSchema,
  runAllWeatherResponseSchema,
  runMomentumResponseSchema,
  optimizePortfolioResponseSchema,
  compareAllStrategiesResponseSchema
} from '../../src/schemas/backtesting.schema';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

test.describe('Backtesting API — Autonomous Contract & Health Tests', () => {
  test('POST /api/v1/backtest/buy-and-hold satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new BacktestingClient(request);
    const startTime = Date.now();

    const response = await client.runBuyAndHold({});
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/backtest/buy-and-hold`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(runBuyAndHoldResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/backtest/buy-and-hold:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('POST /api/v1/backtest/dca satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new BacktestingClient(request);
    const startTime = Date.now();

    const response = await client.runDca({});
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/backtest/dca`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(runDcaResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/backtest/dca:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('POST /api/v1/backtest/all-weather satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new BacktestingClient(request);
    const startTime = Date.now();

    const response = await client.runAllWeather({});
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/backtest/all-weather`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(runAllWeatherResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/backtest/all-weather:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('POST /api/v1/backtest/momentum satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new BacktestingClient(request);
    const startTime = Date.now();

    const response = await client.runMomentum({});
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/backtest/momentum`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(runMomentumResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/backtest/momentum:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('POST /api/v1/backtest/optimize satisfies contract & SLA < 10000ms', async ({ request }) => {
    const client = new BacktestingClient(request);
    const startTime = Date.now();

    const response = await client.optimizePortfolio({});
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/backtest/optimize`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(10000);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(optimizePortfolioResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/backtest/optimize:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('POST /api/v1/backtest/compare satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new BacktestingClient(request);
    const startTime = Date.now();

    const response = await client.compareAllStrategies({});
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/backtest/compare`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(compareAllStrategiesResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/backtest/compare:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });
});
