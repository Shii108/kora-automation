# Kora QA Automation

Playwright and TypeScript automation for API and user-facing workflows.

This repository is an independent QA automation clone/companion built to reproduce and
validate flows from the official Kora platform. It does not contain the official application
source code and is not the production application repository. Use it only with environments
and credentials you are authorized to test.

## Coverage

- API health, documentation, authentication, and authorization checks
- Member registration and login
- Instructor, membership, pass, and session creation
- Free membership and pass activation
- Zero-fee session booking and checkout
- Password recovery through email OTP

## Stack

- Playwright Test
- TypeScript
- GitHub Actions
- Prettier

## Safety

The suite has safeguards for shared test environments:

- Application URLs are loaded only from environment variables.
- No office or deployment URL is stored in the repository.
- Remote execution requires `ALLOW_REMOTE_TESTS=true`.
- Tests run with one worker and no automatic retries to limit duplicate records.
- Pushes and pull requests run quality checks only; they do not run Playwright.
- GitHub-hosted Playwright jobs and callbacks are disabled while the repository is public.
- Manual GitHub Actions runs require explicit confirmation.
- Record-creating tests are tagged `@mutating` and generated records start with `E2E`.

The suite does not currently delete the records it creates. Use a dedicated test environment,
test tenant, or approved cleanup process before scheduling frequent regression runs.

## Project Structure

```text
.github/workflows/      GitHub Actions workflow
src/api/                Reusable API helpers
src/config/             Environment and execution-safety configuration
src/test-data/          Unique test-data builders
src/ui/                 Reusable UI workflow helpers
tests/api/              API checks
tests/user-ui/          Browser end-to-end checks
tests/fixtures/         Generic upload fixtures
```

## Local Setup

Install dependencies:

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env`, then provide values for an authorized environment:

```env
API_URL=
ADMIN_URL=
USER_URL=
EMAIL_INBOX_URL=
ALLOW_REMOTE_TESTS=false
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Set `ALLOW_REMOTE_TESTS=true` only when intentionally targeting a non-local environment.
The `.env` file is ignored by Git and must never be committed.

## Commands

```bash
# All configured tests
npm test

# Read-only API smoke checks
npm run test:smoke

# API project only
npm run test:api

# Browser project only
npm run test:user

# Tests that create records
npm run test:mutating

# Regression tests
npm run test:regression

# TypeScript and formatting checks
npm run typecheck
npm run format:check

# Open the latest local HTML report
npm run test:report
```

## Test Tags

- `@smoke`: quick, non-mutating service and authentication checks
- `@regression`: deeper API and browser workflows
- `@mutating`: tests that create or update records in the target environment

## GitHub Actions

The workflow is stored at `.github/workflows/ci.yml`.

| Trigger | Quality checks | Playwright |
| --- | --- | --- |
| Push | Yes | No |
| Pull request | Yes | No |
| Confirmed manual run in a private repository | Yes | Yes |
| `repository_dispatch: backend-deployed` in a private repository | Yes | Yes |

The Playwright job uploads its HTML report even when the test job fails. A deployment-triggered
run can send an `automation-complete` callback to the backend repository with the test result,
run link, backend commit SHA, and backend ref.

### Repository secrets

Configure these under **Settings → Secrets and variables → Actions → Secrets**:

- `API_URL`
- `ADMIN_URL`
- `USER_URL`
- `EMAIL_INBOX_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `BACKEND_REPOSITORY` in `owner/repository` format, when callbacks are enabled
- `BACKEND_CALLBACK_TOKEN`, when callbacks are enabled

Never place credentials, personal access tokens, or private endpoint values in workflow files,
source files, commits, screenshots, or test reports.

## Repository Dispatch Contract

The backend deployment workflow can send a `backend-deployed` event with this payload:

```json
{
  "backend_sha": "commit SHA",
  "backend_ref": "branch or ref"
}
```

The sender needs a GitHub credential authorized to dispatch events to this repository. The
callback credential is separate: it allows this automation repository to send the result to the
configured backend repository.

## If the Actions Tab Does Not Show the Workflow

Check that:

1. `.github/workflows/ci.yml` has been committed and pushed.
2. The workflow exists on the repository's default branch.
3. GitHub Actions is enabled under **Settings → Actions → General**.
4. Your account has permission to view or run workflows for the repository.

A workflow that exists only on your computer will not appear on GitHub.

## Debug Artifacts

On failure, Playwright can retain screenshots, video, traces, and an HTML report. Generated
reports and local environment files are excluded through `.gitignore`.
