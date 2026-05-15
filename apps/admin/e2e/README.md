# E2E Tests — Colors Module

Playwright end-to-end tests for the admin panel colors module.

## Prerequisites

1. **Portless dev stack running**: `pnpm dev` from repo root (starts admin at `https://admin.viteplusmono.test`)
2. **Test user exists in DB**: a real email/password account with access to the colors module
3. **Credentials file**: create `apps/admin/.env.e2e` (gitignored):

```
E2E_EMAIL=you@example.com
E2E_PASSWORD=yourpassword
```

## Running Tests

```bash
# From apps/admin or via filter:
cd apps/admin

# 1. Verify all data-testid attributes exist in source
pnpm validate-test-ids

# 2. Run full E2E suite (auto-handles auth setup)
pnpm test:e2e

# 3. Run only auth setup (useful to refresh saved session)
pnpm test:e2e --project=setup

# 4. View HTML test report
npx playwright show-report
```

## How the Test ID System Works

All Playwright selectors use `data-testid` attributes — never role/label/text.

**Step 1** — constants are defined in `e2e/test-ids.ts`:

```typescript
export const TEST_IDS = {
  COLOR_NAME_INPUT: 'color-name-input',
  // ...
} as const;
```

**Step 2** — the matching `data-testid` is added to the frontend source (e.g. `color.config.ts`):

```typescript
{ type: "input", name: "name", testId: "color-name-input", ... }
```

**Step 3** — `validate-test-ids.ts` greps `src/**/*.{ts,tsx}` to confirm every ID in `TEST_IDS` exists literally in the source. Tests will fail before launch if any ID is missing.

### Adding a new test ID

1. Add the constant to `TEST_IDS` in `e2e/test-ids.ts`
2. Add `data-testid="<value>"` to the matching element in `src/`
3. Run `pnpm validate-test-ids` to confirm — done

## Test Coverage

| Test               | Route                              | What it covers                     |
| ------------------ | ---------------------------------- | ---------------------------------- |
| list view loads    | `/data-table`                      | Table columns visible              |
| create color       | `/colors/create` → `/data-table`   | Form submit + list update          |
| view color details | `/data-table`                      | Eye icon → view modal content      |
| edit color         | `/data-table` → `/colors/:id/edit` | Edit form + updated name in list   |
| delete color       | `/data-table`                      | Delete modal confirm → row removed |

Tests run serially (`workers: 1`) because they write to the shared database.
Each test creates its own data (name suffix `Date.now()`) so tests are fully independent.

## Auth

`global-setup.ts` logs in once before all tests and saves the browser session to `e2e/.auth/user.json` (gitignored). All test files automatically load this saved session via `storageState` in `playwright.config.ts`.

## CI

Set environment variables instead of `.env.e2e`:

```
E2E_EMAIL=ci-user@example.com
E2E_PASSWORD=ci-password
```

The webServer command (`pnpm --filter admin dev`) starts the Vite dev server in CI.
