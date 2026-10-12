import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment configuration - no hardcoded values
const LOGIN_URL = process.env.LOGIN_URL 
const USERNAME = process.env.OPENMRS_USERNAME 
const PASSWORD = process.env.OPENMRS_PASSWORD 
const SEARCH_POSITIVE = process.env.PATIENT_SEARCH_POSITIVE 
const SEARCH_NEGATIVE = process.env.PATIENT_SEARCH_NEGATIVE 
if (
  !LOGIN_URL ||
  !USERNAME ||
  !PASSWORD ||
  !SEARCH_POSITIVE ||
  !SEARCH_NEGATIVE
) {
  throw new Error(
    'Missing required environment variables. Check your .env file.'
  );
}

test.describe('OpenMRS Patient Search Scenarios', () => {

  // Reusable helper: Log in and navigate to Find/Create Patient
  async function loginAndGoToPatientSearch(page) {
    // 1. Open OpenMRS login page from environment variable
    await page.goto(LOGIN_URL);
    await page.waitForLoadState('domcontentloaded');

    // 2. Perform login with credentials from environment variables
    const isLoggedIn = await page.getByText('Currently logged in as Super User').isVisible().catch(() => false);
    if (!isLoggedIn) {
      await page.locator('#username').fill(USERNAME);
      await page.locator('#password').fill(PASSWORD);
      await page.locator('input[type="submit"]').click();
      await page.waitForLoadState('networkidle');
      await expect(page.getByText('Currently logged in as Super User')).toBeVisible();
    }

    // 3. Click on Find/Create Patient
    await page.getByRole('link', { name: 'Find/Create Patient' }).click();
    await page.waitForLoadState('networkidle');

    // Handle edge-case re-authentication challenge
    if (page.url().includes('login.htm')) {
      await page.locator('#username').fill(USERNAME);
      await page.locator('#password').fill(PASSWORD);
      await page.locator('input[type="submit"]').click();
      await page.waitForLoadState('networkidle');
      await page.getByRole('link', { name: 'Find/Create Patient' }).click();
      await page.waitForLoadState('networkidle');
    }

    await expect(page).toHaveURL(/.*findPatient\.htm/);
  }

  // Clean up session after each test
  test.afterEach(async ({ page }) => {
    const logoutLink = page.getByRole('link', { name: 'Log out' });
    if (await logoutLink.isVisible().catch(() => false)) {
      await logoutLink.click().catch(() => {});
    }
  });

  // 1. Positive Scenario: Search using PATIENT_SEARCH_POSITIVE from env
  test(`Positive: Search for "${SEARCH_POSITIVE}" and verify matching patient records found`, async ({ page }) => {
    await loginAndGoToPatientSearch(page);

    // Search for patient input from env
    const searchBox = page.locator('#inputNode');
    await searchBox.click();
    await searchBox.pressSequentially(SEARCH_POSITIVE, { delay: 250 });

    // Verify matching records are displayed
    await expect(page.getByText(new RegExp(`Viewing results for '${SEARCH_POSITIVE}'`, 'i'))).toBeVisible();
    await expect(page.locator('#openmrsSearchTable tbody tr').first()).toBeVisible();
    await expect(page.getByText('No matching records found')).not.toBeVisible();
  });

  // 2. Negative Scenario: Search using PATIENT_SEARCH_NEGATIVE from env
  test(`Negative: Search for "${SEARCH_NEGATIVE}" and verify no matching records found`, async ({ page }) => {
    await loginAndGoToPatientSearch(page);

    // Search for patient input from env
    const searchBox = page.locator('#inputNode');
    await searchBox.click();
    await searchBox.pressSequentially(SEARCH_NEGATIVE, { delay: 250 });

    // Verify no matching records message is displayed
    await expect(page.getByText('No matching records found')).toBeVisible();
  });

});
