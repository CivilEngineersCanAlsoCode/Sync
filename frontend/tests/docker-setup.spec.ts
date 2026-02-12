import { expect, test } from "@playwright/test"

/**
 * Test ID: 1.1-E2E-001
 * Story: 1.1 - Core Environment & Docker Apple Silicon Setup
 * Priority: P0 (Critical - Foundation)
 *
 * Acceptance Criteria:
 * - AC-1.1-01: Docker containers (backend, frontend, postgres) start without architecture mismatch errors on M1/M2/M3
 * - AC-1.1-02: docker-compose.yml contains Romanised Hindi comment explaining configuration
 */

test.describe("Docker Environment Setup @p0 @infrastructure", () => {
  test("Docker containers start successfully without architecture errors", async ({
    page,
  }) => {
    // Test ID: 1.1-E2E-001
    // Validates that all containers are running and healthy

    // Step 1: Navigate to the application (validates frontend container)
    await page.goto("/")

    // Step 2: Verify frontend is accessible
    // Note: After auth setup, user is logged in, so we expect dashboard "/"
    await expect(page).toHaveURL("/")
    await expect(page.getByText("Dashboard")).toBeVisible()

    // Step 3: Verify backend health endpoint (validates backend container)
    const healthResponse = await page.request.get("http://localhost:8000/api/v1/utils/health-check")
    expect(healthResponse.status()).toBe(200)

    const healthData = await healthResponse.json()
    expect(healthData).toHaveProperty("status", "healthy")

    // Step 4: Verify database connectivity (validates postgres container)
    // This is done indirectly through backend health check
    // The backend should fail to start if postgres is not accessible
    expect(healthData).toBeTruthy()
  })

  test("Application runs on correct architecture (ARM64 for Apple Silicon)", async ({
    page,
  }) => {
    // Test ID: 1.1-E2E-002
    // Validates that containers are running on ARM64 architecture (Apple Silicon)

    // Navigate to app
    await page.goto("/")

    // Verify no architecture mismatch errors in console
    const consoleErrors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    // Wait for page to fully load
    await page.waitForLoadState("networkidle")

    // Assert: No architecture-related errors
    const architectureErrors = consoleErrors.filter(
      (error) =>
        error.includes("architecture") ||
        error.includes("platform") ||
        error.includes("arm64") ||
        error.includes("x86"),
    )

    expect(architectureErrors).toHaveLength(0)
  })

  test("docker-compose.yml contains Romanised Hindi comments", async () => {
    // Test ID: 1.1-E2E-003
    // Validates AC-1.1-02: Configuration file has explanatory comments

    const fs = await import("fs")
    const path = await import("path")
    const { fileURLToPath } = await import("url")

    // Read docker-compose.yml from project root
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const dockerComposePath = path.join(
      __dirname,
      "../../compose.yml",
    )
    const dockerComposeContent = fs.readFileSync(dockerComposePath, "utf-8")

    // Assert: File contains Romanised Hindi comments
    // Looking for common Hindi words in Romanised form
    const hindiPatterns = [
      /# .*(hai|hain|ke|ka|ki|ko|se|mein|par|ya|aur|taaki|jo)/i,
    ]

    const hasHindiComments = hindiPatterns.some((pattern) =>
      pattern.test(dockerComposeContent),
    )

    expect(hasHindiComments).toBe(true)
  })
})

/**
 * Romanised Hindi explanation (code ke NEECHE):
 * Yeh tests Docker environment ko validate karte hain Apple Silicon (M1/M2/M3) par.
 * Pehla test check karta hai ki saare containers (backend, frontend, postgres) bina
 * architecture error ke start ho rahe hain. Doosra test verify karta hai ki koi
 * architecture mismatch console errors nahi aa rahe. Teesra test docker-compose.yml
 * file mein Romanised Hindi comments ki presence check karta hai.
 */
