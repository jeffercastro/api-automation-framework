/**
 * AUTO-GENERATED NEGATIVE & FUZZING PLAYWRIGHT TEST SUITE
 * Resource: assets
 */
import { test, expect } from '@playwright/test';
import { AssetsClient } from '../../src/api/assets.client';

test.describe('Assets API — Autonomous Negative & Boundary Fuzz Tests', () => {
  test('GET /api/v1/assets/{ticker}/prices — invalid path param (ticker) returns 4xx without 500', async ({ request }) => {
    const client = new AssetsClient(request);
    const response = await client.getPrices('__invalid_fuzz_999999__');

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/assets/{ticker}/prices`).toContain(response.status());
  });

  test('GET /api/v1/assets/{ticker}/returns — invalid path param (ticker) returns 4xx without 500', async ({ request }) => {
    const client = new AssetsClient(request);
    const response = await client.getReturns('__invalid_fuzz_999999__');

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/assets/{ticker}/returns`).toContain(response.status());
  });

  test('POST /api/v1/assets/ingest — type mismatch on "tickers" (array <- string) returns 400/422', async ({ request }) => {
    const client = new AssetsClient(request);
    const response = await client.ingestAssets({"tickers":"__not_an_array__","start_date":"2010-01-01","force_refresh":false,"include_macro":false});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/assets/ingest`).toContain(response.status());
  });

  test('GET /api/v1/assets/macro/{series_name} — invalid path param (series_name) returns 4xx without 500', async ({ request }) => {
    const client = new AssetsClient(request);
    const response = await client.getMacro('__invalid_fuzz_999999__');

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
    expect([400, 404, 422], `Expected 4xx validation error for /api/v1/assets/macro/{series_name}`).toContain(response.status());
  });
});
