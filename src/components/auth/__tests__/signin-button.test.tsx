import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { SignInButton } from '../signin-button';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SignInButton', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign-in button with the correct provider name', () => {
    render(<SignInButton provider="Google" />);
    
    const button = screen.getByRole('button', { name: /continue with google/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Continue with Google');
  });

  it('calls signIn with the correct provider when clicked', () => {
    render(<SignInButton provider="Google" />);
    
    const button = screen.getByRole('button', { name: /continue with google/i });
    fireEvent.click(button);
    
    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' });
  });

  it('shows the correct icon for Google provider', () => {
    render(<SignInButton provider="Google" />);
    
    const icon = screen.getByTestId('google-icon');
    expect(icon).toBeInTheDocument();
  });
});
