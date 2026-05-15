# Plan: Playwright MCP + E2E Tests for Colors Module

## Context

The admin panel (`apps/admin`) has a complete colors CRUD module (list/create/edit/delete/view) but zero E2E test coverage. The user wants to:

1. Configure the Playwright MCP server in Claude Code for interactive browser control
2. Create runnable Playwright test files for the colors module

Admin app runs at `https://admin.viteplusmono.test` (port 3002 via Portless). All dashboard routes are protected by Better Auth session guards.

---

## Part A — Frontend: Add `data-testid` attributes

Tests must use `data-testid` selectors defined in the source. All IDs are constants in a typed file, and a validation script confirms each ID exists literally in `src/`.

### A1. Extend `FieldConfig` type — `apps/admin/src/types/form.types.ts`

Add `testId?: string` to `BaseField`:

```typescript
type BaseField = {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  testId?: string; // ← add this
};
```

### A2. Pass `testId` through the form field chain

**`apps/admin/src/components/field-registry.tsx`** — in the `input` case, pass `testId`:

```tsx
return <RHFInput ... testId={c.testId} />;
```

**`apps/admin/src/rhf/RHFInput/index.tsx`** — add `testId?: string` to Props, forward to `BaseInput`:

```tsx
interface Props {
  ...
  testId?: string;
}
// in JSX:
<BaseInput {...field} ... data-testid={testId} ... />
```

(`BaseInput` already extends `InputProps` which spreads `...props` onto `<input>`, so `data-testid` flows through.)

### A3. Add `testId` to color field configs — `apps/admin/src/pages/color.config.ts`

```typescript
export const colorFields: FieldConfig[] = [
  { type: 'input', name: 'name', label: 'Name', placeholder: '...', testId: 'color-name-input' },
  {
    type: 'input',
    name: 'description',
    label: 'Description',
    placeholder: '...',
    testId: 'color-description-input',
  },
];
```

### A4. Add `submitTestId` prop to `FormBuilder` — `apps/admin/src/components/form-builder.tsx`

```typescript
interface FormBuilderProps {
  fields: FieldConfig[];
  submitText: string;
  isSubmitting?: boolean;
  submitTestId?: string;   // ← add
}
// on the button:
<button type="submit" data-testid={submitTestId} ...>
```

### A5. Pass `submitTestId` from `ColorForm` — `apps/admin/src/pages/color-form.tsx`

```tsx
<FormBuilder
  fields={colorFields}
  submitText={title}
  isSubmitting={isSubmitting}
  submitTestId="color-form-submit"
/>
```

### A6. Add `data-testid` to action buttons and search — `apps/admin/src/pages/data-table.tsx`

Search input (line ~303):

```tsx
<Input placeholder="Search name or description…" ... data-testid="data-table-search" />
```

Action buttons (lines ~155–185):

```tsx
<Button ... title="View details" data-testid="action-view">  // view
<Button ... title="Edit"         data-testid="action-edit">  // edit
<Button ... title="Delete"       data-testid="action-delete"> // delete
```

### A7. Add `data-testid` to delete modal — `apps/admin/src/pages/color-delete-modal.tsx`

```tsx
<DialogContent data-testid="color-delete-modal" ...>
  ...
  <Button variant="outline" data-testid="delete-cancel-btn" ...>Cancel</Button>
  <Button variant="destructive" data-testid="delete-confirm-btn" ...>Delete</Button>
```

### A8. Add `data-testid` to view modal — `apps/admin/src/pages/color-view-modal.tsx`

Add to `DialogContent`: `data-testid="color-view-modal"`

Restructure the fields map to add explicit `data-testid` on the Name and Description value cells:

```tsx
{([ ... ] as [string, string, string | undefined][]).map(([label, value, tid]) => (
  <div key={label}>
    <p className="...">{label}</p>
    <p className="font-medium" {...(tid ? { 'data-testid': tid } : {})}>
      {value}
    </p>
  </div>
))}
```

Array becomes:

```tsx
["ID",          `#${...}`,          undefined],
["Name",        color.name,         "view-modal-name-value"],
["Description", color.description,  "view-modal-description-value"],
["Created",     formatDate(...),    undefined],
["Updated",     formatDate(...),    undefined],
```

### A9. Add `data-testid` to sign-in inputs — `apps/admin/src/pages/sign-in.tsx`

```tsx
<Input id="login-email"    ... data-testid="sign-in-email"    />
<Input id="login-password" ... data-testid="sign-in-password" />
<Button ... data-testid="sign-in-submit">Sign in</Button>
```

---

## Part B — E2E Infrastructure

### B1. Test ID constants — `apps/admin/e2e/test-ids.ts`

```typescript
export const TEST_IDS = {
  SIGN_IN_EMAIL: 'sign-in-email',
  SIGN_IN_PASSWORD: 'sign-in-password',
  SIGN_IN_SUBMIT: 'sign-in-submit',
  DATA_TABLE_SEARCH: 'data-table-search',
  ACTION_VIEW: 'action-view',
  ACTION_EDIT: 'action-edit',
  ACTION_DELETE: 'action-delete',
  COLOR_NAME_INPUT: 'color-name-input',
  COLOR_DESC_INPUT: 'color-description-input',
  COLOR_FORM_SUBMIT: 'color-form-submit',
  COLOR_VIEW_MODAL: 'color-view-modal',
  VIEW_NAME_VALUE: 'view-modal-name-value',
  VIEW_DESC_VALUE: 'view-modal-description-value',
  COLOR_DELETE_MODAL: 'color-delete-modal',
  DELETE_CONFIRM_BTN: 'delete-confirm-btn',
  DELETE_CANCEL_BTN: 'delete-cancel-btn',
} as const;
```

### B2. Validation script — `apps/admin/e2e/validate-test-ids.ts`

Node.js script that:

1. Reads every `.ts` / `.tsx` file under `apps/admin/src/`
2. Checks each value in `TEST_IDS` appears as a literal string in the source
3. Exits with code 1 and prints missing IDs if any are not found

```typescript
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEST_IDS } from './test-ids.js';

function allFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = path.join(dir, e);
    return statSync(p).isDirectory() ? allFiles(p) : [p];
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const content = allFiles(src)
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
  .map((f) => readFileSync(f, 'utf-8'))
  .join('\n');

const missing = Object.entries(TEST_IDS)
  .filter(([, id]) => !content.includes(id))
  .map(([key, id]) => `  ${key}: "${id}"`);

if (missing.length) {
  console.error('Missing data-testid in frontend source:\n' + missing.join('\n'));
  process.exit(1);
}
console.log('All test IDs verified.');
```

Run independently: `npx tsx e2e/validate-test-ids.ts` (add `tsx` as devDep)  
Also called at the top of `global-setup.ts` before auth.

### B3. Global setup — `apps/admin/e2e/global-setup.ts`

- Loads `.env.e2e` via `fs.readFileSync` (no dotenv dependency)
- Runs `validateTestIds()` synchronously first (imports the validation logic inline)
- Creates `e2e/.auth/` directory with `mkdirSync(..., { recursive: true })`
- Navigates to `/auth/sign-in`, fills `data-testid` inputs, clicks submit
- Saves `storageState` to `e2e/.auth/user.json`

### B4. Playwright config — `apps/admin/playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1, // serial: tests share DB state
  reporter: 'html',
  use: {
    baseURL: 'https://admin.viteplusmono.test',
    storageState: 'e2e/.auth/user.json',
    ignoreHTTPSErrors: true, // Portless self-signed cert
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /global-setup\.ts/, use: { storageState: undefined } },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
  ],
  webServer: {
    command: 'pnpm --filter admin dev',
    url: 'https://admin.viteplusmono.test',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    ignoreHTTPSErrors: true,
  },
});
```

### B5. Colors spec — `apps/admin/e2e/colors.spec.ts`

Five independent tests. Each creates its own data with `Date.now()` suffix. All selectors use `page.getByTestId(TEST_IDS.XXX)`.

**Helper:**

```typescript
async function createColor(page: Page, name: string, desc: string) {
  await page.goto('/colors/create');
  await page.getByTestId(TEST_IDS.COLOR_NAME_INPUT).fill(name);
  await page.getByTestId(TEST_IDS.COLOR_DESC_INPUT).fill(desc);
  await page.getByTestId(TEST_IDS.COLOR_FORM_SUBMIT).click();
  await page.waitForURL('**/data-table');
}
```

**Tests:**

1. **list view** — navigate to `/data-table`, assert column headers `Name`, `Description`, `Created`, `Actions`
2. **create** — `createColor(...)`, search with `DATA_TABLE_SEARCH`, assert name cell visible
3. **view modal** — create, search, click `ACTION_VIEW` in matching row, assert `COLOR_VIEW_MODAL` open, check `VIEW_NAME_VALUE` and `VIEW_DESC_VALUE`
4. **edit** — create, search, click `ACTION_EDIT`, wait for `/colors/**/edit`, clear + fill name, click `COLOR_FORM_SUBMIT`, wait for `/data-table`, search for updated name, assert visible
5. **delete** — create, search, click `ACTION_DELETE`, assert `COLOR_DELETE_MODAL` open, click `DELETE_CONFIRM_BTN`, assert modal gone, assert cell not visible

---

## Part C — Configuration & Package Changes

### C1. `apps/admin/package.json`

- Add `devDependencies`: `"@playwright/test": "^1.52.0"`, `"tsx": "^4.x"`
- Add scripts:
  - `"test:e2e": "playwright test"`
  - `"validate-test-ids": "tsx e2e/validate-test-ids.ts"`

### C2. `.claude/settings.local.json` — add Playwright MCP server

```json
{
  "permissions": { ...existing... },
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### C3. Test credentials — `apps/admin/.env.e2e` (already gitignored by `.env.*` rule)

```
E2E_EMAIL=<real admin email>
E2E_PASSWORD=<real admin password>
```

### C4. Gitignore additions to root `.gitignore`

```
e2e/.auth/
playwright-report/
test-results/
```

---

## Files Summary

| File                                           | Action                                              |
| ---------------------------------------------- | --------------------------------------------------- |
| `apps/admin/src/types/form.types.ts`           | Edit — add `testId?` to BaseField                   |
| `apps/admin/src/components/field-registry.tsx` | Edit — pass `testId` to RHFInput                    |
| `apps/admin/src/rhf/RHFInput/index.tsx`        | Edit — accept + forward `data-testid`               |
| `apps/admin/src/components/form-builder.tsx`   | Edit — add `submitTestId` prop                      |
| `apps/admin/src/pages/color.config.ts`         | Edit — add `testId` to fields                       |
| `apps/admin/src/pages/color-form.tsx`          | Edit — pass `submitTestId`                          |
| `apps/admin/src/pages/data-table.tsx`          | Edit — add `data-testid` to search + action buttons |
| `apps/admin/src/pages/color-delete-modal.tsx`  | Edit — add `data-testid` to modal + buttons         |
| `apps/admin/src/pages/color-view-modal.tsx`    | Edit — add `data-testid` to modal + value cells     |
| `apps/admin/src/pages/sign-in.tsx`             | Edit — add `data-testid` to inputs + button         |
| `apps/admin/e2e/test-ids.ts`                   | Create — typed constants                            |
| `apps/admin/e2e/validate-test-ids.ts`          | Create — validation script                          |
| `apps/admin/e2e/global-setup.ts`               | Create — auth setup                                 |
| `apps/admin/e2e/colors.spec.ts`                | Create — 5 E2E tests                                |
| `apps/admin/playwright.config.ts`              | Create                                              |
| `apps/admin/.env.e2e`                          | Create — credentials                                |
| `apps/admin/package.json`                      | Edit — add deps + scripts                           |
| `.claude/settings.local.json`                  | Edit — add MCP server                               |
| `.gitignore`                                   | Edit — add e2e/.auth/ etc.                          |
| `apps/admin/e2e/README.md`                     | Create — E2E setup documentation                    |

---

## Part D — `apps/admin/e2e/README.md` (full content)

```markdown
# E2E Tests — Colors Module

Playwright end-to-end tests for the admin panel colors module.

## Prerequisites

1. **Portless dev stack running**: `pnpm dev` from repo root (starts admin at `https://admin.viteplusmono.test`)
2. **Test user exists in DB**: a real email/password account with access to the colors module
3. **Credentials file**: create `apps/admin/.env.e2e` (gitignored):
```

E2E_EMAIL=you@example.com
E2E_PASSWORD=yourpassword

````

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
````

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

```


---

## Verification

1. **Validate IDs**: `pnpm --filter admin validate-test-ids` — should print "All test IDs verified."
2. **MCP**: Restart Claude Code — Playwright browser tools appear in the tool list
3. **Auth setup only**: `pnpm --filter admin test:e2e --project=setup` — writes `e2e/.auth/user.json`
4. **Full suite**: `pnpm --filter admin test:e2e` — all 5 tests pass (requires Portless stack running)
5. **Report**: `npx playwright show-report` inside `apps/admin`
```
