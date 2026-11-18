# API Automation Framework

[![API Automation Pipeline](https://github.com/jeffercastro/api-automation-framework/actions/workflows/api-tests.yml/badge.svg)](https://github.com/jeffercastro/api-automation-framework/actions/workflows/api-tests.yml)
[![Live Report](https://img.shields.io/badge/Report-Live_HTML_Report-2ea44f?style=flat-square&logo=github&logoColor=white)](https://jeffercastro.github.io/api-automation-framework/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright_API-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![AJV](https://img.shields.io/badge/JSON_Schema-AJV-23C8AF?style=flat-square)](https://ajv.js.org/)

Production-ready API test automation framework built with **TypeScript** and **Playwright API Request Context**. It validates contracts, JSON schemas, SLAs, error handling/boundary conditions, and end-to-end chained entity lifecycles against the **Restful-Booker** public API, backed by automated **GitHub Actions CI/CD pipelines** that publish test reports directly to **GitHub Pages**.

👉 **[View Live HTML Test Report](https://jeffercastro.github.io/api-automation-framework/)**

---

## Key Features

- **Decoupled Architecture:** Strict separation between API client services, test data generators, JSON schemas, and test specs.
- **Contract & Schema Validation:** High-performance JSON Schema assertions using `ajv` and `ajv-formats`.
- **E2E Chained Flows:** Validates full resource lifecycle (`POST` -> `GET` -> `PUT` -> `DELETE` -> 404 verification).
- **Negative & Boundary Testing:** Validates HTTP `403 Forbidden` (missing/invalid tokens), `404 Not Found` (non-existent records), and bad auth credentials.
- **Authentication Handling:** Automated token acquisition for sensitive/restricted operations with custom credentials support.
- **Environment Configuration:** Flexible multi-environment support via `dotenv` (`.env.example`).
- **SLA & Performance Checks:** Validates response time thresholds (< 2000ms).
- **Continuous Integration & Deployment:** Automated test execution on every `push` and `pull_request`, automatically deploying live interactive HTML reports to **GitHub Pages**.

---

## Test Coverage Overview

| Suite | File | Focus | Assertions / Validations |
| :--- | :--- | :--- | :--- |
| **Contract & SLA** | `tests/booking-contract.spec.ts` | Schema compliance | JSON Schema matching with AJV, latency SLA < 2000ms |
| **Chained E2E** | `tests/booking-crud.spec.ts` | Entity lifecycle | `POST` (create) $\rightarrow$ `GET` (verify) $\rightarrow$ `PUT` (update) $\rightarrow$ `DELETE` $\rightarrow$ 404 confirmation |
| **Negative & Boundary** | `tests/booking-negative.spec.ts` | Error handling | Missing tokens (`403`), invalid tokens (`403`), invalid IDs (`404`), bad auth, empty payloads (`500`) |

---

## Project Structure

```text
api-automation-framework/
├── .github/
│   └── workflows/
│       └── api-tests.yml        # CI/CD pipeline + GitHub Pages deployment
├── src/
│   ├── api/
│   │   ├── auth.client.ts       # Authentication and token management
│   │   └── booking.client.ts    # Reusable HTTP client methods
│   ├── data/
│   │   └── booking.data.ts      # Dynamic payload generators
│   └── schemas/
│       └── booking.schema.ts    # JSON Schemas for contract testing
├── tests/
│   ├── booking-contract.spec.ts # Contract and SLA response tests
│   ├── booking-crud.spec.ts     # End-to-end chained lifecycle tests
│   └── booking-negative.spec.ts # Error handling, 403, 404 & boundary tests
├── .env.example                 # Environment variables template
├── playwright.config.ts         # Framework configuration with dotenv
├── package.json
└── tsconfig.json
```

---

## Quickstart

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation
```bash
git clone https://github.com/jeffercastro/api-automation-framework.git
cd api-automation-framework
npm install
```

### Environment Setup (Optional)
```bash
cp .env.example .env
```

### Run Tests Locally
```bash
# Run all API tests (Contract, E2E, and Negative)
npm test

# View generated interactive HTML report
npm run test:report
```

---

## CI/CD & Live Reporting

The test suite runs automatically on **GitHub Actions** on every push to `main` and Pull Requests.
- **Workflow file:** `.github/workflows/api-tests.yml`
- **GitHub Pages:** Each successful run on `main` automatically deploys the HTML test report to **[jeffercastro.github.io/api-automation-framework](https://jeffercastro.github.io/api-automation-framework/)**.
- **Artifacts:** Downloadable test reports are also preserved for 14 days per run.

---

## Author

- **Jeffer Castro** - [GitHub](https://github.com/jeffercastro)
