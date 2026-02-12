import { test, expect } from "@playwright/test"

test.describe("Job Management", () => {
    test.use({ storageState: "playwright/.auth/user.json" })

    test("Add new job listing", async ({ page }) => {
        // Debugging: Use absolute URL
        await page.goto("http://localhost:5173/jobs/add")
        
        // Check if we are on the correct page
        await expect(page.getByText("Nayi Job Add Karein")).toBeVisible({ timeout: 15000 })
        
        // Fill form
        await page.getByLabel("Job Title").fill("Senior React Developer")
        await page.getByLabel("Company Name").fill("Meta")
        await page.getByLabel("Job Link").fill("https://facebook.com/careers")
        await page.getByLabel("Job Description").fill("React, GraphQL, Relay experience required.")
        
        // Submit
        await page.getByRole("button", { name: "Save Job" }).click()
        
        // Verify success message
        await expect(page.getByText("Job successfully saved!")).toBeVisible()
        
        // Verify redirection (assuming dashboard or list page)
        // await expect(page).toHaveURL("/")
    })
    
    test("Validation errors on empty submit", async ({ page }) => {
        await page.goto("http://localhost:5173/jobs/add")
        await page.getByRole("button", { name: "Save Job" }).click()
        
        await expect(page.getByText("Job title zaroori hai")).toBeVisible()
        await expect(page.getByText("Company name zaroori hai")).toBeVisible()
        await expect(page.getByText("Job Description (JD) zaroori hai")).toBeVisible()
    })

    test("Jobs Dashboard", async ({ page }) => {
        // Navigate to dashboard
        await page.goto("http://localhost:5173/jobs")

        // Check if dashboard title is visible
        await expect(page.getByText("Jobs Dashboard")).toBeVisible()
        
        // Check if "Add Job" button is visible and works
        const addJobButton = page.getByRole("link", { name: "Add Job" })
        await expect(addJobButton).toBeVisible()
        await addJobButton.click()
        
        // Should navigate to add job page
        await expect(page).toHaveURL(/.*\/jobs\/add/)
        await expect(page.getByText("Nayi Job Add Karein")).toBeVisible()
    })
    
    test('should allow user to view jobs dashboard', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveURL(/.*\/jobs/);
    await expect(page.getByRole('heading', { name: 'Jobs Dashboard' })).toBeVisible();
  });

  test('should allow user to delete a job', async ({ page }) => {
    // 1. Create a job first
    const uniqueTitle = `Job to Delete ${Date.now()}`;
    await page.goto('/jobs/add');
    await page.getByLabel('Job Title').fill(uniqueTitle);
    await page.getByLabel('Company Name').fill('Temporary Corp'); // Changed to Company Name to match existing tests
    await page.getByLabel('Job Description').fill('This job will be deleted.');
    await page.getByRole('button', { name: 'Save Job' }).click();
    
    // Wait for navigation back to jobs list
    await expect(page).toHaveURL(/.*\/jobs/);
    await expect(page.getByText(uniqueTitle)).toBeVisible();

    // 2. Delete the job
    // Open dropdown menu
    const row = page.getByRole('row', { name: uniqueTitle });
    await row.getByRole('button', { name: 'Open menu' }).click();
    
    // Click Delete
    await page.getByRole('menuitem', { name: 'Delete Job' }).click();
    
    // 3. Handle Confirmation Dialog
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
    
    // 4. Verify Deletion
    await expect(page.getByText('Job delete ho gayi')).toBeVisible(); // Success Toast
    await expect(page.getByText(uniqueTitle)).not.toBeVisible();
  });
})
