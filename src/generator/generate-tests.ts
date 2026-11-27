/**
 * Autonomous OpenAPI & Swagger Test Generator
 * ============================================
 * Parses any OpenAPI 3.0/3.1 or Swagger 2.0 specification (from file or URL)
 * and automatically generates:
 *   1. Strongly-typed API Clients (src/api/<tag>.client.ts)
 *   2. JSON Schemas for Contract Testing (src/schemas/<tag>.schema.ts)
 *   3. Production-ready Playwright Test Suites (tests/generated/<tag>-generated.spec.ts)
 *
 * Usage:
 *   node --experimental-strip-types src/generator/generate-tests.ts [--file path/to/openapi.json] [--url http://...]
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info?: { title?: string; version?: string; description?: string };
  servers?: Array<{ url: string }>;
  paths: Record<string, Record<string, any>>;
  components?: {
    schemas?: Record<string, any>;
  };
}

interface ParsedOperation {
  method: string;
  path: string;
  operationId: string;
  summary: string;
  tag: string;
  pathParams: string[];
  queryParams: string[];
  requestBodySchema?: any;
  responseSchemas: Record<string, any>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function cleanMethodName(method: string, pathStr: string, operationId?: string): string {
  if (operationId) {
    // strip suffixes like _api_v1_...
    const cleanId = operationId.split('_api_')[0];
    return toCamelCase(cleanId);
  }
  const cleanPath = pathStr.replace(/\{[^}]+\}/g, '').replace(/[^a-zA-Z0-9]/g, '_');
  return toCamelCase(`${method}_${cleanPath}`);
}

function resolveRef(ref: string, spec: OpenAPISpec): any {
  if (!ref.startsWith('#/')) return { type: 'object' };
  const parts = ref.replace('#/', '').split('/');
  let current: any = spec;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return { type: 'object' };
    }
  }
  return current;
}

// ─── Core Parser ──────────────────────────────────────────────────────────────

function parseOpenAPI(spec: OpenAPISpec): Record<string, ParsedOperation[]> {
  const operationsByTag: Record<string, ParsedOperation[]> = {};

  for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
    const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];

    for (const method of httpMethods) {
      if (!pathItem[method]) continue;
      const op = pathItem[method];

      const rawTag = (op.tags && op.tags[0]) || 'default';
      const tag = toKebabCase(rawTag);

      const pathParams: string[] = [];
      const queryParams: string[] = [];

      // Extract parameters
      const params = [...(pathItem.parameters || []), ...(op.parameters || [])];
      for (const p of params) {
        if (p.in === 'path') pathParams.push(p.name);
        if (p.in === 'query') queryParams.push(p.name);
      }

      // Extract path params from template string if not declared
      const matchedPathParams = pathStr.match(/\{([^}]+)\}/g);
      if (matchedPathParams) {
        for (const m of matchedPathParams) {
          const name = m.replace(/[{}]/g, '');
          if (!pathParams.includes(name)) pathParams.push(name);
        }
      }

      // Request Body
      let requestBodySchema: any = null;
      if (op.requestBody?.content?.['application/json']?.schema) {
        const s = op.requestBody.content['application/json'].schema;
        requestBodySchema = s.$ref ? resolveRef(s.$ref, spec) : s;
      }

      // Responses
      const responseSchemas: Record<string, any> = {};
      if (op.responses) {
        for (const [code, resp] of Object.entries(op.responses)) {
          const content = (resp as any).content?.['application/json']?.schema;
          if (content) {
            responseSchemas[code] = content.$ref ? resolveRef(content.$ref, spec) : content;
          }
        }
      }

      const parsedOp: ParsedOperation = {
        method,
        path: pathStr,
        operationId: op.operationId || '',
        summary: op.summary || `${method.toUpperCase()} ${pathStr}`,
        tag,
        pathParams,
        queryParams,
        requestBodySchema,
        responseSchemas,
      };

      if (!operationsByTag[tag]) operationsByTag[tag] = [];
      operationsByTag[tag].push(parsedOp);
    }
  }

  return operationsByTag;
}

// ─── Code Generators ──────────────────────────────────────────────────────────

function generateClientCode(tag: string, operations: ParsedOperation[]): string {
  const className = `${toPascalCase(tag)}Client`;

  const methodsCode = operations.map((op) => {
    const fnName = cleanMethodName(op.method, op.path, op.operationId);

    // Build arguments
    const argsList: string[] = [];
    for (const p of op.pathParams) {
      argsList.push(`${p}: string | number`);
    }
    if (['post', 'put', 'patch'].includes(op.method)) {
      argsList.push('data: Record<string, any> | any = {}');
    }
    if (op.queryParams.length > 0 || op.method === 'get') {
      argsList.push('queryParams?: Record<string, any>');
    }

    // Build URL template
    let urlExpr = op.path;
    for (const p of op.pathParams) {
      urlExpr = urlExpr.replace(`{${p}}`, `\${${p}}`);
    }

    const optionsLines: string[] = [];
    if (['post', 'put', 'patch'].includes(op.method)) {
      optionsLines.push('      data,');
    }
    if (op.queryParams.length > 0 || op.method === 'get') {
      optionsLines.push('      params: queryParams,');
    }

    const optionsStr = optionsLines.length > 0 ? `{\n${optionsLines.join('\n')}\n    }` : '';

    return `  /**
   * ${op.summary}
   * [${op.method.toUpperCase()}] ${op.path}
   */
  async ${fnName}(${argsList.join(', ')}): Promise<APIResponse> {
    return this.request.${op.method}(\`${urlExpr}\`${optionsStr ? ', ' + optionsStr : ''});
  }`;
  }).join('\n\n');

  return `/**
 * AUTO-GENERATED API CLIENT
 * Resource: ${tag}
 */
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ${className} {
  constructor(private request: APIRequestContext) {}

${methodsCode}
}
`;
}

function generateSchemaCode(tag: string, operations: ParsedOperation[]): string {
  const schemasExport: string[] = [];

  for (const op of operations) {
    const fnName = cleanMethodName(op.method, op.path, op.operationId);
    const schema200 = op.responseSchemas['200'] || op.responseSchemas['201'] || { type: 'object' };

    schemasExport.push(`export const ${fnName}ResponseSchema = ${JSON.stringify(schema200, null, 2)};`);
  }

  return `/**
 * AUTO-GENERATED JSON SCHEMAS FOR CONTRACT TESTING
 * Resource: ${tag}
 */

${schemasExport.join('\n\n')}
`;
}

function generateTestSpecCode(tag: string, operations: ParsedOperation[]): string {
  const className = `${toPascalCase(tag)}Client`;
  const clientFileName = `${toKebabCase(tag)}.client`;
  const schemaFileName = `${toKebabCase(tag)}.schema`;

  const schemaImports = operations
    .map((op) => `${cleanMethodName(op.method, op.path, op.operationId)}ResponseSchema`)
    .join(',\n  ');

  const testCases = operations.map((op) => {
    const fnName = cleanMethodName(op.method, op.path, op.operationId);
    const schemaName = `${fnName}ResponseSchema`;

    // Smart defaults for path/body params
    const dummyArgs: string[] = [];
    for (const p of op.pathParams) {
      if (p.toLowerCase().includes('series_name') || p.toLowerCase().includes('series')) dummyArgs.push("'cpi_inflation'");
      else if (p.toLowerCase().includes('ticker')) dummyArgs.push("'SPY'");
      else if (p.toLowerCase().includes('id')) dummyArgs.push('1');
      else dummyArgs.push(`'test_${p}'`);
    }
    if (['post', 'put', 'patch'].includes(op.method)) {
      if (op.path.includes('ingest')) {
        dummyArgs.push("{ tickers: ['SPY'], start_date: '2023-01-01' }");
      } else {
        dummyArgs.push('{}');
      }
    }

    const slaLimit = (op.path.includes('ingest') || op.path.includes('monte-carlo') || op.path.includes('optimize')) ? 10000 : 2500;

    return `  test('${op.method.toUpperCase()} ${op.path} satisfies contract & SLA < ${slaLimit}ms', async ({ request }) => {
    const client = new ${className}(request);
    const startTime = Date.now();

    const response = await client.${fnName}(${dummyArgs.join(', ')});
    const duration = Date.now() - startTime;

    // SLA & Status Verification
    expect(response.status(), \`Expected successful response status for ${op.path}\`).toBeLessThan(500);
    expect(duration, 'Response SLA exceeded').toBeLessThan(${slaLimit});

    // Contract Schema Validation (if JSON response)
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      const validate = ajv.compile(${schemaName});
      const isValid = validate(body);
      if (!isValid) {
        console.warn('Schema warnings for ${op.path}:', validate.errors);
      }
      expect(isValid, 'Response payload does not match OpenAPI JSON Schema contract').toBe(true);
    }
  });`;
  }).join('\n\n');

  return `/**
 * AUTO-GENERATED PLAYWRIGHT TEST SUITE
 * Resource: ${tag}
 */
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { ${className} } from '../../src/api/${clientFileName}';
import {
  ${schemaImports}
} from '../../src/schemas/${schemaFileName}';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

test.describe('${toPascalCase(tag)} API — Autonomous Contract & Health Tests', () => {
${testCases}
});
`;
}

function defaultPathArg(paramName: string): string {
  const lower = paramName.toLowerCase();
  if (lower.includes('series_name') || lower.includes('series')) return "'cpi_inflation'";
  if (lower.includes('ticker')) return "'SPY'";
  if (lower.includes('id')) return '1';
  return `'test_${paramName}'`;
}

function buildBaselinePayload(schema: any, spec: OpenAPISpec, depth = 0): Record<string, any> {
  if (!schema || typeof schema !== 'object' || depth > 3) return {};
  const resolved = schema.$ref ? resolveRef(schema.$ref, spec) : schema;
  const props = resolved.properties || {};
  const payload: Record<string, any> = {};

  for (const [key, rawProp] of Object.entries<any>(props)) {
    const prop = rawProp.$ref ? resolveRef(rawProp.$ref, spec) : rawProp;
    if (prop.default !== undefined) {
      payload[key] = prop.default;
    } else if (prop.example !== undefined) {
      payload[key] = prop.example;
    } else if (Array.isArray(prop.enum) && prop.enum.length > 0) {
      payload[key] = prop.enum[0];
    } else if (prop.type === 'integer' || prop.type === 'number') {
      const minVal = typeof prop.exclusiveMinimum === 'number'
        ? prop.exclusiveMinimum + 1
        : (typeof prop.minimum === 'number' ? prop.minimum + 1 : 10);
      payload[key] = minVal;
    } else if (prop.type === 'boolean') {
      payload[key] = true;
    } else if (prop.type === 'array') {
      payload[key] = ['SPY'];
    } else if (prop.type === 'object') {
      payload[key] = buildBaselinePayload(prop, spec, depth + 1);
    } else if (prop.type === 'string') {
      payload[key] = key.includes('date') ? '2024-01-01' : 'sample_value';
    }
  }
  return payload;
}

interface NegativeCase {
  label: string;
  pathArgs: string[];
  payload?: any;
  strictClientError: boolean;
}

function generateNegativeMutations(op: ParsedOperation, spec: OpenAPISpec): NegativeCase[] {
  const cases: NegativeCase[] = [];
  const validPathArgs = op.pathParams.map(defaultPathArg);

  // 1. Invalid path parameter fuzzing
  if (op.pathParams.length > 0) {
    const invalidPathArgs = op.pathParams.map(() => "'__invalid_fuzz_999999__'");
    cases.push({
      label: `invalid path param (${op.pathParams.join(', ')}) returns 4xx without 500`,
      pathArgs: invalidPathArgs,
      strictClientError: true,
    });
  }

  // 2. Request body mutations for write methods
  if (['post', 'put', 'patch'].includes(op.method)) {
    const rawSchema = op.requestBodySchema;
    const schema = rawSchema?.$ref ? resolveRef(rawSchema.$ref, spec) : rawSchema;

    if (schema && schema.properties) {
      const baseline = buildBaselinePayload(schema, spec);
      const required: string[] = Array.isArray(schema.required) ? schema.required : [];

      if (required.length > 0) {
        cases.push({
          label: 'empty payload {} rejects missing required fields (400/422)',
          pathArgs: validPathArgs,
          payload: {},
          strictClientError: true,
        });

        for (const reqField of required.slice(0, 2)) {
          const mutated = { ...baseline };
          delete mutated[reqField];
          cases.push({
            label: `missing required field "${reqField}" returns 400/422`,
            pathArgs: validPathArgs,
            payload: mutated,
            strictClientError: true,
          });
        }
      }

      // Type mismatch fuzzing (first numeric, boolean, or array property)
      let addedTypeFuzz = false;
      let addedBoundaryFuzz = false;

      for (const [key, rawProp] of Object.entries<any>(schema.properties)) {
        const prop = rawProp.$ref ? resolveRef(rawProp.$ref, spec) : rawProp;

        if (!addedTypeFuzz && (prop.type === 'number' || prop.type === 'integer' || prop.type === 'boolean' || prop.type === 'array')) {
          const badVal = prop.type === 'boolean'
            ? '__not_a_boolean__'
            : (prop.type === 'array' ? '__not_an_array__' : '__not_a_number__');
          cases.push({
            label: `type mismatch on "${key}" (${prop.type} <- string) returns 400/422`,
            pathArgs: validPathArgs,
            payload: { ...baseline, [key]: badVal },
            strictClientError: true,
          });
          addedTypeFuzz = true;
        }

        if (!addedBoundaryFuzz) {
          if (typeof prop.exclusiveMinimum === 'number' || typeof prop.minimum === 'number') {
            const minBound = typeof prop.exclusiveMinimum === 'number' ? prop.exclusiveMinimum : prop.minimum;
            cases.push({
              label: `boundary violation on "${key}" (< min ${minBound}) returns 400/422`,
              pathArgs: validPathArgs,
              payload: { ...baseline, [key]: minBound - 10 },
              strictClientError: true,
            });
            addedBoundaryFuzz = true;
          } else if (Array.isArray(prop.enum) && prop.enum.length > 0) {
            cases.push({
              label: `invalid enum value on "${key}" returns 400/422`,
              pathArgs: validPathArgs,
              payload: { ...baseline, [key]: '__INVALID_ENUM_VALUE__' },
              strictClientError: true,
            });
            addedBoundaryFuzz = true;
          } else if (typeof prop.pattern === 'string') {
            cases.push({
              label: `pattern violation on "${key}" returns 400/422`,
              pathArgs: validPathArgs,
              payload: { ...baseline, [key]: '__INVALID_PATTERN__' },
              strictClientError: true,
            });
            addedBoundaryFuzz = true;
          }
        }

        if (addedTypeFuzz && addedBoundaryFuzz) break;
      }
    } else {
      cases.push({
        label: 'unexpected fuzz payload does not cause 500 server crash',
        pathArgs: validPathArgs,
        payload: { __fuzz_unexpected__: true },
        strictClientError: false,
      });
    }
  }

  return cases;
}

function generateNegativeTestSpecCode(tag: string, operations: ParsedOperation[], spec: OpenAPISpec): string | null {
  const className = `${toPascalCase(tag)}Client`;
  const clientFileName = `${toKebabCase(tag)}.client`;

  const blocks: string[] = [];

  for (const op of operations) {
    const fnName = cleanMethodName(op.method, op.path, op.operationId);
    const mutations = generateNegativeMutations(op, spec);

    for (const mut of mutations) {
      const callArgs = [...mut.pathArgs];
      if (['post', 'put', 'patch'].includes(op.method)) {
        callArgs.push(JSON.stringify(mut.payload ?? {}));
      }

      const statusAssert = mut.strictClientError
        ? `    expect([400, 404, 422], \`Expected 4xx validation error for ${op.path}\`).toContain(response.status());`
        : `    expect(response.status(), \`Expected non-5xx status for ${op.path}\`).toBeLessThan(500);`;

      blocks.push(`  test('${op.method.toUpperCase()} ${op.path} — ${mut.label.replace(/'/g, "\\'")}', async ({ request }) => {
    const client = new ${className}(request);
    const response = await client.${fnName}(${callArgs.join(', ')});

    expect(response.status(), 'API must never crash with 5xx on malformed/boundary input').toBeLessThan(500);
${statusAssert}
  });`);
    }
  }

  if (blocks.length === 0) return null;

  return `/**
 * AUTO-GENERATED NEGATIVE & FUZZING PLAYWRIGHT TEST SUITE
 * Resource: ${tag}
 */
import { test, expect } from '@playwright/test';
import { ${className} } from '../../src/api/${clientFileName}';

test.describe('${toPascalCase(tag)} API — Autonomous Negative & Boundary Fuzz Tests', () => {
${blocks.join('\n\n')}
});
`;
}

function generatePerfTestSpecCode(tag: string, operations: ParsedOperation[], spec: OpenAPISpec): string | null {
  const className = `${toPascalCase(tag)}Client`;
  const clientFileName = `${toKebabCase(tag)}.client`;

  const benchOps = operations.filter(
    (op) => op.method !== 'delete' && !op.path.includes('ingest')
  );
  if (benchOps.length === 0) return null;

  const blocks = benchOps.map((op) => {
    const fnName = cleanMethodName(op.method, op.path, op.operationId);
    const args: string[] = op.pathParams.map(defaultPathArg);

    if (['post', 'put', 'patch'].includes(op.method)) {
      const rawSchema = op.requestBodySchema;
      const resolved = rawSchema?.$ref ? resolveRef(rawSchema.$ref, spec) : rawSchema;
      const samplePayload = resolved?.properties ? buildBaselinePayload(resolved, spec) : {};
      args.push(JSON.stringify(samplePayload));
    }

    const p95Limit = op.path.includes('monte-carlo') || op.path.includes('optimize') ? 10000 : 2500;

    return `  test('${op.method.toUpperCase()} ${op.path} — Load & Latency Benchmark (P95 < ${p95Limit}ms)', async ({ request }) => {
    const client = new ${className}(request);
    const metrics = await runLoadBenchmark({
      label: '${op.method.toUpperCase()} ${op.path}',
      executeRequest: () => client.${fnName}(${args.join(', ')}),
    });

    expect(metrics.errorRatePct, 'Server 5xx/network error rate under load must be 0%').toBe(0);
    expect(metrics.p95Ms, 'P95 latency SLA exceeded under concurrency').toBeLessThan(${p95Limit});
    expect(metrics.rps, 'Throughput (RPS) must be positive').toBeGreaterThan(0);
  });`;
  });

  return `/**
 * AUTO-GENERATED PERFORMANCE & LOAD BENCHMARK SUITE
 * Resource: ${tag}
 */
import { test, expect } from '@playwright/test';
import { ${className} } from '../../src/api/${clientFileName}';
import { runLoadBenchmark } from '../../src/utils/perf-runner';

test.describe('${toPascalCase(tag)} API — Performance & Latency Benchmarks', () => {
${blocks.join('\n\n')}
});
`;
}

// ─── Main Execution ───────────────────────────────────────────────────────────

async function main() {
  console.log('============================================================');
  console.log('  Autonomous OpenAPI & Swagger Playwright Test Generator');
  console.log('============================================================\n');

  const args = process.argv.slice(2);
  let specPath = path.resolve(__dirname, '../../openapi-sample.json');
  let specUrl = '';
  const includeNegative = args.includes('--negative');
  const includePerf = args.includes('--perf');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      specPath = path.resolve(process.cwd(), args[i + 1]);
    }
    if (args[i] === '--url' && args[i + 1]) {
      specUrl = args[i + 1];
    }
  }

  let rawContent: string;
  if (specUrl) {
    console.log(`[1/4] Fetching specification from URL: ${specUrl}`);
    const resp = await fetch(specUrl);
    if (!resp.ok) {
      throw new Error(`Failed to fetch OpenAPI spec from ${specUrl} (HTTP ${resp.status})`);
    }
    rawContent = await resp.text();
  } else {
    if (!fs.existsSync(specPath)) {
      console.error(`Error: Spec file not found at ${specPath}`);
      console.log('Usage: node --experimental-strip-types src/generator/generate-tests.ts [--file path/to/spec.json] [--url http://...] [--negative]');
      process.exit(1);
    }
    console.log(`[1/4] Reading specification from: ${specPath}`);
    rawContent = fs.readFileSync(specPath, 'utf-8');
  }

  const spec: OpenAPISpec = JSON.parse(rawContent);

  const title = spec.info?.title || 'API';
  const version = spec.info?.version || '1.0';
  console.log(`[2/4] Parsing spec for "${title}" (v${version})...`);

  const operationsByTag = parseOpenAPI(spec);
  const tags = Object.keys(operationsByTag);
  console.log(`      Found ${tags.length} resource tags with endpoints: [${tags.join(', ')}]`);

  // Output directories
  const baseDir = path.resolve(__dirname, '../..');
  const apiDir = path.join(baseDir, 'src/api');
  const schemaDir = path.join(baseDir, 'src/schemas');
  const testsDir = path.join(baseDir, 'tests/generated');

  fs.mkdirSync(apiDir, { recursive: true });
  fs.mkdirSync(schemaDir, { recursive: true });
  fs.mkdirSync(testsDir, { recursive: true });

  console.log('\n[3/4] Generating Clients, Schemas, and Test Suites...');

  let totalOperations = 0;
  let negativeSuitesCount = 0;
  let perfSuitesCount = 0;

  for (const tag of tags) {
    const ops = operationsByTag[tag];
    totalOperations += ops.length;
    const kebabTag = toKebabCase(tag);

    // 1. Generate Client
    const clientCode = generateClientCode(tag, ops);
    const clientPath = path.join(apiDir, `${kebabTag}.client.ts`);
    fs.writeFileSync(clientPath, clientCode, 'utf-8');

    // 2. Generate Schemas
    const schemaCode = generateSchemaCode(tag, ops);
    const schemaPath = path.join(schemaDir, `${kebabTag}.schema.ts`);
    fs.writeFileSync(schemaPath, schemaCode, 'utf-8');

    // 3. Generate Positive Contract Test Spec
    const testCode = generateTestSpecCode(tag, ops);
    const testPath = path.join(testsDir, `${kebabTag}-generated.spec.ts`);
    fs.writeFileSync(testPath, testCode, 'utf-8');

    // 4. Generate Negative & Fuzzing Test Spec (if --negative)
    let extraLabels = '';
    if (includeNegative) {
      const negCode = generateNegativeTestSpecCode(tag, ops, spec);
      if (negCode) {
        const negPath = path.join(testsDir, `${kebabTag}-negative-generated.spec.ts`);
        fs.writeFileSync(negPath, negCode, 'utf-8');
        negativeSuitesCount++;
        extraLabels += ` & ${kebabTag}-negative-generated.spec.ts`;
      }
    }

    // 5. Generate Performance & Load Benchmark Spec (if --perf)
    if (includePerf) {
      const perfCode = generatePerfTestSpecCode(tag, ops, spec);
      if (perfCode) {
        const perfPath = path.join(testsDir, `${kebabTag}-perf-generated.spec.ts`);
        fs.writeFileSync(perfPath, perfCode, 'utf-8');
        perfSuitesCount++;
        extraLabels += ` & ${kebabTag}-perf-generated.spec.ts`;
      }
    }

    console.log(`  ✓ Tag [${tag}]: ${ops.length} endpoints → ${kebabTag}.client.ts & ${kebabTag}-generated.spec.ts${extraLabels}`);
  }

  console.log('\n[4/4] Generation Complete! Summary:');
  console.log(`  • Total Operations Processed: ${totalOperations}`);
  console.log(`  • Clients Generated:          ${tags.length} files in src/api/`);
  console.log(`  • Schemas Generated:          ${tags.length} files in src/schemas/`);
  console.log(`  • Playwright Test Suites:     ${tags.length} positive${includeNegative ? ` + ${negativeSuitesCount} negative/fuzz` : ''}${includePerf ? ` + ${perfSuitesCount} perf` : ''} suites in tests/generated/`);
  console.log('\nNext steps:');
  console.log('  To execute the generated tests:');
  console.log('    npx playwright test tests/generated/');
  console.log('============================================================\n');
}

main().catch((err) => {
  console.error('Fatal Generator Error:', err);
  process.exit(1);
});
