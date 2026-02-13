
import { test, expect } from '@playwright/test';

test.describe('Probing Questions & Autosave', () => {
  // Use existing user from global auth or login
  // Assuming global auth setup is used, but for safety in this standalone test, we can ensure a job exists.
  
  test('should autosave answer on blur and persist after reload', async ({ page, request }) => {
    // 1. Setup: Ensure a job with questions exists (Seeding)
    // We'll treat this as a "system" test where we assume the seeded data exists 
    // OR we create a fresh one.  test('should autosave answer on blur and persist after reload', async ({ page, request }) => {
    // 0. Login (Bypass global setup for reliability in this specific run if needed, or just to be sure)
    await page.goto('/login');
    await page.getByTestId("email-input").fill("admin@example.com"); // Assuming default admin
    await page.getByTestId("password-input").fill("changethis");
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL('/');

    // 1. Navigate to Job List
    await page.goto('/jobs');
    
    // 2. Open the seeded job
    // We rely on the "Autosave Route Test" job being present and seeded from manual verification.
    await expect(page.getByText("Autosave Route Test").first()).toBeVisible();
    await page.getByText("Autosave Route Test").first().click();
    
    // 2. Locate Question Input
    // We know the question "What is your experience with asynchronous programming in Python?" exists.
    const input = page.locator('input').filter({ hasText: '' }).first(); // Grab first input
    // Better: locate by label
    const questionLabel = page.getByText("What is your experience with asynchronous programming in Python?");
    const answerInput = page.locator("input").first(); // Simplified for now, or use near()

    // 3. Type Answer
    const uniqueAnswer = `Test Answer ${Date.now()}`;
    await answerInput.fill(uniqueAnswer);

    // 4. Blur to Trigger Autosave
    await page.getByText("Helper Questions").click(); // Click outside

    // 5. Verify "Saved" indicator
    await expect(page.getByText("Saved")).toBeVisible({ timeout: 5000 });

    // 6. Reload and Verify Persistence
    await page.reload();
    await expect(answerInput).toHaveValue(uniqueAnswer);
  });
});
