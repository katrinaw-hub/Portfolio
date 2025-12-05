import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../user/Signup.jsx";

// Helper to always provide router context
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

beforeAll(() => {
  const originalWarn = console.warn;

  jest.spyOn(console, "warn").mockImplementation((...args) => {
    const [first] = args;
    if (
      typeof first === "string" &&
      first.includes("React Router Future Flag Warning")
    ) {
      // Ignore ONLY this specific warning
      return;
    }
    originalWarn(...args);
  });
});

describe("Signup form", () => {
  test("shows error if fields are empty", async () => {
    renderWithRouter(<Signup />);

    // Click Submit with empty fields
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Expect the validation error from your component
    expect(
      await screen.findByText(/all fields are required/i)
    ).toBeInTheDocument();
  });

  test("shows error for weak password", async () => {
    renderWithRouter(<Signup />);

    // Fill valid name + email but weak password
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Katrina" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "katrina@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "abc" }, // too short and no special char
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Expect the user password validation message
    expect(
      await screen.findByText(
        /password must be at least 8 characters and include at least one special character/i
      )
    ).toBeInTheDocument();
  });
});