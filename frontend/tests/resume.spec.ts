import { test, expect } from '@playwright/test'

test.describe('Resume Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile')
  })

  test('should display resume upload UI', async ({ page }) => {
    await expect(page.locator('text=Profile')).toBeVisible()
    await expect(page.locator('text=Upload Your Resume')).toBeVisible()
    await expect(page.locator('label:has-text("Select PDF")')).toBeVisible()
  })

  test('should upload Satvik resume PDF successfully', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('frontend/tests/fixtures/resumes/Satvik-Jain-Resume.pdf')
    
    await expect(page.locator('text=Satvik-Jain-Resume.pdf')).toBeVisible()
    await page.click('button:has-text("Upload Resume")')
    await page.waitForTimeout(3000)
    
    await expect(page.locator('text=Current Resume')).toBeVisible()
    await expect(page.locator('text=Satvik-Jain-Resume.pdf')).toBeVisible()
  })

  test('should upload Sneha resume PDF successfully', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('frontend/tests/fixtures/resumes/Sneha-Arjariya-FlowCV-Resume-20251210.pdf')
    
    await expect(page.locator('text=Sneha-Arjariya-FlowCV-Resume-20251210.pdf')).toBeVisible()
    await page.click('button:has-text("Upload Resume")')
    await page.waitForTimeout(3000)
    
    await expect(page.locator('text=Current Resume')).toBeVisible()
  })

  test('should validate PDF file type', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    await expect(fileInput).toHaveAttribute('accept', '.pdf')
  })
})
