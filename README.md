# Kora Automation

Playwright TypeScript automation suite for Kora API and user-facing UI flows.

This project covers API smoke/regression checks, user purchase journeys, Stripe test checkout, dynamic test data creation, and PostgreSQL payment verification.

## What This Tests

- API health, docs, authentication, and protected route checks
- Member registration and login
- Admin-authenticated creation of instructors, memberships, passes, and sessions
- User membership purchase with Stripe
- User pass purchase with Stripe
- Paid and free session booking
- Forgot password flow using OTP email
- Database verification for completed checkout sessions

## Tech Stack

- Playwright Test
- TypeScript
- PostgreSQL
- Stripe test checkout
- GitHub Actions
- Prettier

## Project Structure

```text
tests/
  api/          API smoke and regression tests
  user-ui/      End-to-end user UI tests
  fixtures/     Test media files

src/
  api/          API helper functions
  ui/           Reusable UI helper functions
  test-data/    Dynamic test data builders
  config/       URL configuration

utils/
  db.ts         PostgreSQL query helper
```

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Copy `.env.example` to `.env` and fill in the real values for your local or test environment.

```env
API_URL=http://localhost:8000
USER_URL=http://localhost:3001

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=your-database
```

## Run Tests

Run all tests:

```bash
npm test
```

Run only API tests:

```bash
npm run test:api
```

Run only user UI tests:

```bash
npm run test:user
```

Run smoke tests:

```bash
npm run test:smoke
```

Run API smoke tests:

```bash
npm run test:api:smoke
```

Run regression tests:

```bash
npm run test:regression
```

Run user UI tests in headed mode:

```bash
npm run test:user:headed
```

Open Playwright UI mode:

```bash
npm run test:ui
```

Open the latest HTML report:

```bash
npm run test:report
```

## Test Tags

Smoke tests use `@smoke` for quick checks that confirm the main services and critical API flows are working.

Regression tests use `@regression` for deeper feature flows such as checkout, booking, and password reset.

## Projects And Base URLs

| Project   | Tests           | Base URL                              |
| --------- | --------------- | ------------------------------------- |
| `api`     | `tests/api`     | `API_URL` or `http://localhost:8000`  |
| `user-ui` | `tests/user-ui` | `USER_URL` or `http://localhost:3001` |

## Debug Artifacts

Playwright is configured to keep debugging artifacts only when tests fail:

- Screenshots on failure
- Videos on failure
- Traces on failure
- HTML report

## Notes

The GitHub Actions workflow installs dependencies and runs Playwright tests. For CI to pass, the target API, user UI, database, and required environment variables must be available to the runner.

## Possible Future Improvements

These are good next steps, but they are not required for this version of the project:

- Add Playwright fixtures for shared setup such as authenticated API clients and test users
- Introduce a fuller Page Object Model for larger UI flows
- Use `storageState` to reuse logged-in sessions where it makes tests faster and clearer
- Add network mocking for isolated UI tests that should not depend on live backend data
