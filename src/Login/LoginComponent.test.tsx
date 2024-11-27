import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from './LoginComponent';
import getAuthorization from './LoginService';

// Mocking the LoginService module
vi.mock('./LoginService', () => ({
  default: vi.fn(),
}));

describe('Login Component', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with initial values', () => {
    render(<Login onLogin={mockOnLogin} />);

    // Check if username and password fields are rendered
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    // Check if the Login button is rendered
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('shows an error message if fields are empty', async () => {
    render(<Login onLogin={mockOnLogin} />);

    // Clear the inputs
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '' } });

    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Login/i }));

    // Check if the error message is displayed
    expect(await screen.findByText(/Both fields are required/i)).toBeInTheDocument();
  });

  it('calls getAuthorization and onLogin on valid submission', async () => {
    const mockGetAuthorization = vi.mocked(getAuthorization);
    mockGetAuthorization.mockResolvedValue('mockAuthToken');

    render(<Login onLogin={mockOnLogin} />);

    // Input valid credentials
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Login/i }));

    // Wait for async actions
    await waitFor(() => {
      expect(mockGetAuthorization).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockOnLogin).toHaveBeenCalled();
      expect(sessionStorage.getItem('username')).toBe('testuser');
      expect(sessionStorage.getItem('authorization')).toBe('mockAuthToken');
    });
  });

  it('shows the LoginFailedPopup on failed login', async () => {
    const mockGetAuthorization = vi.mocked(getAuthorization);
    mockGetAuthorization.mockRejectedValue('Login failed');

    render(<Login onLogin={mockOnLogin} />);

    // Input invalid credentials
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Login/i }));

    // Check if the popup appears
    expect(await screen.findByText(/Login Failed/i)).toBeInTheDocument();
  });
});
