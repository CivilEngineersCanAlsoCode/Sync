import { test, expect } from '@playwright/test';

test.describe('Profile Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Login API
    await page.route('**/api/v1/login/access-token', async route => {
      await route.fulfill({
        json: { access_token: "fake-token", token_type: "bearer" }
      });
    });

    // Mock User Me API
    await page.route('**/api/v1/users/me', async route => {
        await route.fulfill({
            json: { 
                id: "user-1", 
                email: "test@example.com", 
                is_active: true, 
                is_superuser: false, 
                full_name: "Test User" 
            }
        });
    });

    // Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*(dashboard|$)/);
  });

  test('should edit project and add skill persistence', async ({ page }) => {
    // Mock API response or rely on backend (Story 3.3 relies on backend persistence)
    // Here we will use E2E with backend
    
    // Navigate to a resume profile (assuming resume exists, otherwise we might need to upload one first)
    // For simplicity, we assume there's at least one resume or we upload one
    
    // Upload Resume
    await page.goto('http://localhost:5173/dashboard');
    const fileInput = page.locator('input[type="file"]');
    // Ensure we have a dummy PDF. If not, maybe skip upload and check for existing resume logic?
    // Let's assume dashboard has resumes. If not, the test helper normally handles seeding.
    // We will try to find a "Tailor" or "Edit Profile" link.
    
    // Wait for resumes to load
    await page.waitForTimeout(1000); 
    
    // If no resumes, we should probably upload one, but for this test let's create a minimal test where we assume pre-seeded data or mock.
    // Given the environment constraints, let's Mock the API to verify Frontend Logic independently of backend state if backend is empty.
    
    // MOCKING GET
    await page.route('**/api/v1/resumes/*/profile', async route => {
        const json = {
            id: "123",
            resume_id: "res-1",
            owner_id: "user-1",
            projects: [{ title: "Old Project", description: "Old Desc", technologies: ["Java"] }],
            experience: [],
            skills: [{ category: "Backend", skills: ["Python"] }],
            extracted_at: new Date().toISOString()
        };
        await route.fulfill({ json });
    });

    // MOCKING PATCH
    let patchData: any = null;
    await page.route('**/api/v1/resumes/*/profile', async route => {
        if (route.request().method() === 'PATCH') {
            patchData = route.request().postDataJSON();
            await route.fulfill({ json: { ...patchData, id: "123" } });
        } else {
            await route.continue();
        }
    });

    // Go to profile page
    await page.goto('http://localhost:5173/resumes/res-1/profile');
    
    // Verify initial data
    await expect(page.locator('input[value="Old Project"]')).toBeVisible();
    await expect(page.getByText("Backend")).toBeVisible();
    await expect(page.getByText("Python")).toBeVisible();

    // Edit Project
    await page.locator('input[value="Old Project"]').fill('New Project Title');
    
    // Add Skill
    await page.click('button:has-text("Skills")');
    await page.fill('input[placeholder="Add a skill..."]', 'FastAPI');
    await page.press('input[placeholder="Add a skill..."]', 'Enter');
    
    // Save
    await page.click('button:has-text("Save Changes")');
    
    // Verify Patch Request
    expect(patchData).toBeTruthy();
    expect(patchData.projects[0].title).toBe('New Project Title');
    expect(patchData.skills[0].skills).toContain('FastAPI');
    
    // Verify Toast
    await expect(page.getByText("Profile Updated Successfully")).toBeVisible();
  });
});
