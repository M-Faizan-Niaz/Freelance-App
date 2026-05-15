import { test, expect, type Page } from '@playwright/test';
import { TEST_IDS } from './test-ids.js';

async function createColor(page: Page, name: string, desc: string) {
  await page.goto('/colors/create');
  await page.getByTestId(TEST_IDS.COLOR_NAME_INPUT).fill(name);
  await page.getByTestId(TEST_IDS.COLOR_DESC_INPUT).fill(desc);
  await page.getByTestId(TEST_IDS.COLOR_FORM_SUBMIT).click();
  await page.waitForURL('**/data-table');
}

test('list view loads with expected columns', async ({ page }) => {
  await page.goto('/data-table');
  await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Created' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
});

test('create color and verify it appears in list', async ({ page }) => {
  const name = `TestColor${Date.now()}`;
  const desc = `Description ${Date.now()}`;

  await createColor(page, name, desc);

  await page.getByTestId(TEST_IDS.DATA_TABLE_SEARCH).fill(name);
  await expect(page.getByRole('cell', { name })).toBeVisible();
});

test('view color details in modal', async ({ page }) => {
  const name = `ViewColor${Date.now()}`;
  const desc = `ViewDesc-${Date.now()}`;

  await createColor(page, name, desc);

  await page.getByTestId(TEST_IDS.DATA_TABLE_SEARCH).fill(name);
  const row = page.getByRole('row', { name: new RegExp(name) });
  await row.getByTestId(TEST_IDS.ACTION_VIEW).click();

  await expect(page.getByTestId(TEST_IDS.COLOR_VIEW_MODAL)).toBeVisible();
  await expect(page.getByTestId(TEST_IDS.VIEW_NAME_VALUE)).toHaveText(name);
  await expect(page.getByTestId(TEST_IDS.VIEW_DESC_VALUE)).toHaveText(desc);
});

test('edit color and verify updated name in list', async ({ page }) => {
  const name = `EditColor${Date.now()}`;
  const desc = `EditDesc${Date.now()}`;
  const updatedName = `Edited${Date.now()}`;

  await createColor(page, name, desc);

  await page.getByTestId(TEST_IDS.DATA_TABLE_SEARCH).fill(name);
  const row = page.getByRole('row', { name: new RegExp(name) });
  await row.getByTestId(TEST_IDS.ACTION_EDIT).click();
  await page.waitForURL('**/colors/**/edit');

  const nameInput = page.getByTestId(TEST_IDS.COLOR_NAME_INPUT);
  await nameInput.clear();
  await nameInput.fill(updatedName);
  await page.getByTestId(TEST_IDS.COLOR_FORM_SUBMIT).click();
  await page.waitForURL('**/data-table');

  await page.getByTestId(TEST_IDS.DATA_TABLE_SEARCH).fill(updatedName);
  await expect(page.getByRole('cell', { name: updatedName })).toBeVisible();
});

test('delete color and verify it is removed from list', async ({ page }) => {
  const name = `DeleteColor${Date.now()}`;
  const desc = `DeleteDesc-${Date.now()}`;

  await createColor(page, name, desc);

  await page.getByTestId(TEST_IDS.DATA_TABLE_SEARCH).fill(name);
  const row = page.getByRole('row', { name: new RegExp(name) });
  await row.getByTestId(TEST_IDS.ACTION_DELETE).click();

  await expect(page.getByTestId(TEST_IDS.COLOR_DELETE_MODAL)).toBeVisible();
  await page.getByTestId(TEST_IDS.DELETE_CONFIRM_BTN).click();

  await expect(page.getByTestId(TEST_IDS.COLOR_DELETE_MODAL)).not.toBeVisible();
  await expect(page.getByRole('cell', { name })).not.toBeVisible();
});
