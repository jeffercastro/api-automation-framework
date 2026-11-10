# API Automation Framework

![API Automation Pipeline](https://github.com/jeffercastro/api-automation-framework/actions/workflows/api-tests.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright_API-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![AJV](https://img.shields.io/badge/JSON_Schema-AJV-23C8AF?style=flat-square)

Production-ready API test automation framework built with **TypeScript** and **Playwright API Request Context**. It validates contracts, JSON schemas, SLAs, and end-to-end chained entity lifecycles against the **Restful-Booker** public API, backed by automated **GitHub Actions CI/CD pipelines**.

---

## Key Features

- **Decoupled Architecture:** Strict separation between API client services, test data generators, JSON schemas, and test specs.
- **Contract & Schema Validation:** High-performance JSON Schema assertions using `ajv` and `ajv-formats`.
- **E2E Chained Flows:** Validates full resource lifecycle (`POST` -> `GET` -> `PUT` -> `DELETE` -> verification).
- **Authentication Handling:** Automated token acquisition for sensitive/restricted operations.
- **SLA & Performance Checks:** Validates response time thresholds (< 2000ms).
- **Continuous Integration:** Fully automated test execution on every `push` and `pull_request` with downloadable HTML test reports.

---

## Project Structure

```text
api-automation-framework/
├── .github/
│   └── workflows/
│       └── api-tests.yml        # CI/CD pipeline definition
├── src/
│   ├── api/
│   │   ├── auth.client.ts       # Authentication and token management
│   │   └── booking.client.ts    # Reusable HTTP client methods
│   ├── data/
│   │   └── booking.data.ts      # Dynamic payload generators
│   └── schemas/
│       └── booking.schema.ts    # JSON Schemas for contract testing
├── tests/
│   ├── booking-crud.spec.ts     # End-to-end chained lifecycle tests
│   └── booking-contract.spec.ts # Contract and SLA response tests
├── playwright.config.ts         # Framework configuration
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

### Run Tests Locally
```bash
# Run all API tests in headless mode
npm test

# View generated HTML report
npm run test:report
```

---

## CI/CD Pipeline

The test suite runs automatically on **GitHub Actions** under Ubuntu runners on every push to `main` and Pull Requests.
- **Workflow file:** `.github/workflows/api-tests.yml`
- **Artifacts:** Playwright HTML reports are generated and preserved for 14 days per run.

---

## Author

- **Jeffer Castro** - [GitHub](https://github.com/jeffercastro)
