/**
 * AUTO-GENERATED PLAYWRIGHT TEST SUITE
 * Resource: assets
 */
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { AssetsClient } from '../../src/api/assets.client';
import {
  listAssetsResponseSchema,
  assetSummaryResponseSchema,
  getPricesResponseSchema,
  getReturnsResponseSchema,
  ingestAssetsResponseSchema,
  getMacroResponseSchema
} from '../../src/schemas/assets.schema';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

test.describe('Assets API — Autonomous Contract & Health Tests', () => {
  test('GET /api/v1/assets/ satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new AssetsClient(request);
    const startTime = Date.now();

    const response = await client.listAssets();
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/assets/`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(listAssetsResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/assets/:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('GET /api/v1/assets/summary satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new AssetsClient(request);
    const startTime = Date.now();

    const response = await client.assetSummary();
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/assets/summary`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(assetSummaryResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/assets/summary:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('GET /api/v1/assets/{ticker}/prices satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new AssetsClient(request);
    const startTime = Date.now();

    const response = await client.getPrices('SPY');
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/assets/{ticker}/prices`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(getPricesResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/assets/{ticker}/prices:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('GET /api/v1/assets/{ticker}/returns satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new AssetsClient(request);
    const startTime = Date.now();

    const response = await client.getReturns('SPY');
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/assets/{ticker}/returns`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(getReturnsResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/assets/{ticker}/returns:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('POST /api/v1/assets/ingest satisfies contract & SLA < 10000ms', async ({ request }) => {
    const client = new AssetsClient(request);
    const startTime = Date.now();

    const response = await client.ingestAssets({ tickers: ['SPY'], start_date: '2023-01-01' });
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/assets/ingest`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(10000);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(ingestAssetsResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/assets/ingest:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('GET /api/v1/assets/macro/{series_name} satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new AssetsClient(request);
    const startTime = Date.now();

    const response = await client.getMacro('cpi_inflation');
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /api/v1/assets/macro/{series_name}`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(getMacroResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /api/v1/assets/macro/{series_name}:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });
});
