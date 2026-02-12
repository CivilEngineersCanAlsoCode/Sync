import { test as setup, expect } from "@playwright/test"
import { firstSuperuser, firstSuperuserPassword } from "./config.ts"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page }) => {
  setup.setTimeout(60000) // Increase timeout
  
  await page.goto("/login")
  await page.getByTestId("email-input").fill(firstSuperuser)
  await page.getByTestId("password-input").fill(firstSuperuserPassword)
  await page.getByRole("button", { name: "Log In" }).click()
  
  // Wait for either URL change OR token - whichever comes first
  await Promise.race([
    page.waitForURL("/", { timeout: 30000 }),
    page.waitForFunction(() => localStorage.getItem("access_token") !== null, { timeout: 30000 })
  ])
  
  // Verify we have a token
  const token = await page.evaluate(() => localStorage.getItem("access_token"))
  expect(token).toBeTruthy()
  
  await page.context().storageState({ path: authFile })
  console.log("✅ Auth successful, token saved")
})
