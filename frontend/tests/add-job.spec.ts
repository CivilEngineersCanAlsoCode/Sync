import { expect, test } from "@playwright/test"

test.describe("Add Job Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Welcome back!")).toBeVisible()
  })

  test("Modal opens and shows mandatory fields", async ({ page }) => {
    await page.getByRole("button", { name: "Add Job" }).click()
    await expect(page.getByText("Add New Job")).toBeVisible()
    await expect(page.getByLabel("Job Title")).toBeVisible()
    await expect(page.getByLabel("Company")).toBeVisible()
    await expect(page.getByLabel("Job URL")).toBeVisible()
    await expect(page.getByLabel("Location")).toBeVisible()
    await expect(page.getByLabel("Description (JD Text)")).toBeVisible()
  })

  test("Validation: Error shows on blur for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: "Add Job" }).click()
    
    const titleInput = page.getByLabel("Job Title")
    await titleInput.fill("a")
    await titleInput.clear()
    await expect(page.getByText("Job title bharna zaroori hai")).toBeVisible()
  })

  test("Validation: Error shows for invalid URL", async ({ page }) => {
    await page.getByRole("button", { name: "Add Job" }).click()
    
    await page.getByLabel("Job URL").fill("not-a-url")
    // Trigger validation by blurring or clicking away
    await page.getByLabel("Job Title").click()
    await expect(page.getByText("Sahi URL format use karein")).toBeVisible()
  })

  test("Happy Path: Successfully add a job", async ({ page }) => {
    await page.getByRole("button", { name: "Add Job" }).click()
    
    const id = Math.random().toString(36).substring(7)
    await page.getByLabel("Job Title").fill(`Test Engineer ${id}`)
    await page.getByLabel("Company").fill(`Test Corp ${id}`)
    await page.getByLabel("Job URL").fill("https://example.com/jobs/1")
    await page.getByLabel("Location").fill("Remote")
    await page.getByLabel("Description (JD Text)").fill("This is a test job description.")
    
    const saveButton = page.getByRole("button", { name: "Save Job" })
    await expect(saveButton).toBeEnabled()
    await saveButton.click()
    
    // Success toast
    await expect(page.getByText("Job successfully added!").first()).toBeVisible()
    
    // Refresh check (table) - use locator for specific cell
    await expect(page.locator("table")).toContainText(`Test Engineer ${id}`)
  })

  test("Edge Case: Prevent duplicate jobs", async ({ page }) => {
    const title = `Duplicate Job ${Math.random().toString(36).substring(7)}`
    const company = "Duplicate Corp"
    
    // First save
    await page.getByRole("button", { name: "Add Job" }).click()
    await page.getByLabel("Job Title").fill(title)
    await page.getByLabel("Company").fill(company)
    await page.getByLabel("Job URL").fill("https://example.com/1")
    await page.getByLabel("Location").fill("Online")
    await page.getByLabel("Description (JD Text)").fill("First JD")
    await page.getByRole("button", { name: "Save Job" }).click()
    
    // Wait for modal to close and success toast
    await expect(page.getByText("Job successfully added!").first()).toBeVisible()
    await expect(page.locator("table")).toContainText(title)

    // Second save (same title/company)
    await page.getByRole("button", { name: "Add Job" }).click()
    await page.getByLabel("Job Title").fill(title)
    await page.getByLabel("Company").fill(company)
    await page.getByLabel("Job URL").fill("https://example.com/2")
    await page.getByLabel("Location").fill("Online")
    await page.getByLabel("Description (JD Text)").fill("Second JD")
    await page.getByRole("button", { name: "Save Job" }).click()
    
    // Error message from backend
    await expect(page.getByText("Same details wala job pehle se exists karta hai").first()).toBeVisible()
  })
})
