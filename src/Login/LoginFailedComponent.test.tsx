
import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import LoginFailedPopup from './LoginFailedComponent';
import userEvent from '@testing-library/user-event';

describe('LoginFailedPopup', () => {
  it('renders the Snackbar when open is true', () => {
    const handleClose = vi.fn();
    render(<LoginFailedPopup open={true} onClose={handleClose} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    expect(
      screen.getByText('Login failed. Please check your credentials.')
    ).toBeInTheDocument();
  });

  it('does not render the Snackbar when open is false', () => {
    const handleClose = vi.fn();
    render(<LoginFailedPopup open={false} onClose={handleClose} />);

    // Check that the Snackbar is not in the DOM
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('calls onClose when the Snackbar is dismissed', async () => {
    const handleClose = vi.fn();
    render(<LoginFailedPopup open={true} onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Check if the onClose function is called
    expect(handleClose).toHaveBeenCalled();
  });
});
