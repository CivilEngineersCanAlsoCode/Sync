import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { isLoggedIn } from "@/hooks/useAuth"
import { Login } from "./login"
import { vi, describe, it, expect, beforeEach } from "vitest"

// Mock useAuth
const mockLoginMutation = {
  mutate: vi.fn(),
  isPending: false,
}

vi.mock("@/hooks/useAuth", () => ({
  default: () => ({
    loginMutation: mockLoginMutation,
  }),
  isLoggedIn: vi.fn(),
}))

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({ component: () => null }),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  redirect: vi.fn(),
}))

vi.mock("@/components/Common/AuthLayout", () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const renderLogin = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  )
}

describe("Login Page Form Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isLoggedIn).mockReturnValue(false)
  })

  it("shows error for invalid email format", async () => {
    renderLogin()
    const user = userEvent.setup()
    
    const emailInput = screen.getByTestId("email-input")

    await user.type(emailInput, "invalid-email")
    await user.tab() // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument()
    })
  })

  it("shows error for password less than 8 characters", async () => {
    renderLogin()
    const user = userEvent.setup()
    
    const passwordInput = screen.getByTestId("password-input")
    await user.type(passwordInput, "short")
    await user.tab() // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it("shows error for empty required fields on submit", async () => {
    renderLogin()
    const user = userEvent.setup()
    
    const submitButton = screen.getByRole("button", { name: /Log In/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument()
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument()
    })
    
    expect(mockLoginMutation.mutate).not.toHaveBeenCalled()
  })

  it("prevents submission when form is invalid", async () => {
    renderLogin()
    const user = userEvent.setup()
    
    const emailInput = screen.getByTestId("email-input")
    await user.type(emailInput, "invalid")
    
    const submitButton = screen.getByRole("button", { name: /Log In/i })
    await user.click(submitButton)
    
    expect(mockLoginMutation.mutate).not.toHaveBeenCalled()
  })

  it("submits form when valid", async () => {
    renderLogin()
    const user = userEvent.setup()
    
    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")
    
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    
    const submitButton = screen.getByRole("button", { name: /Log In/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockLoginMutation.mutate).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password123",
      })
    })
  })

  it("shows loading state when pending", () => {
    mockLoginMutation.isPending = true
    renderLogin()
    
    const button = screen.getByRole("button", { name: /Log In/i })
    expect(button).toBeDisabled()
    
    // Check for spinner (SVG with animate-spin class)
    // Query inside button
    // Using container.querySelector because testing-library queries might not find hidden SVGs easily or by role
    const spinner = button.querySelector(".animate-spin")
    expect(spinner).toBeInTheDocument()
    
    mockLoginMutation.isPending = false // Reset
  })
})
