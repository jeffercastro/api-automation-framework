/**
 * AUTO-GENERATED PLAYWRIGHT TEST SUITE
 * Resource: default
 */
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { DefaultClient } from '../../src/api/default.client';
import {
  healthHealthGetResponseSchema,
  rootGetResponseSchema,
  dashboardDashboardGetResponseSchema
} from '../../src/schemas/default.schema';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

test.describe('Default API — Autonomous Contract & Health Tests', () => {
  test('GET /health satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new DefaultClient(request);
    const startTime = Date.now();

    const response = await client.healthHealthGet();
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /health`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(healthHealthGetResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /health:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('GET / satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new DefaultClient(request);
    const startTime = Date.now();

    const response = await client.rootGet();
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(rootGetResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });

  test('GET /dashboard satisfies contract & SLA < 2500ms', async ({ request }) => {
    const client = new DefaultClient(request);
    const startTime = Date.now();

    const response = await client.dashboardDashboardGet();
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), `Expected successful response status for /dashboard`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(2500);

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(dashboardDashboardGetResponseSchema);
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for /dashboard:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });
});
