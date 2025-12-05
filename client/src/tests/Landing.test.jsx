import { render, screen, fireEvent } from '@testing-library/react';
import Landing from '../core/Landing.jsx';

// Mock react-router's useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  // keep other exports if needed
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

describe('Landing page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('shows intro text and buttons', () => {
    render(<Landing />);

    expect(
      screen.getByText(/Welcome! Sign in to see my profile/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /create an account/i })
    ).toBeInTheDocument();
  });

  test('Sign In button navigates to /signin', () => {
    render(<Landing />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  test('Create an account button navigates to /signup', () => {
    render(<Landing />);

    fireEvent.click(
      screen.getByRole('button', { name: /create an account/i })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });
});
