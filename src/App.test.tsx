import React, { act } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

const logoutButtonName = 'Logout esc key';

describe('App Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(1000),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the Login component when not authenticated', () => {
    render(<App defaultAuthenticated={false}/>);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });


  it('renders the Calculator component when isAuthenticated', async () => {
    render(<App defaultAuthenticated={true} />);
    expect(screen.getByText(/Balance/i)).toBeInTheDocument();
    await act(async () => {
      await waitFor(() => screen.getByRole('button', { name: logoutButtonName }));
    });
    expect(screen.getByRole('button', { name: logoutButtonName })).toBeInTheDocument();
  });

  it('clicks the logout button', async () => {
    const { getByRole } = render(<App defaultAuthenticated={true} />);
    const button = getByRole('button', { name: logoutButtonName });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Balance/i)).not.toBeInTheDocument();
  });

});
