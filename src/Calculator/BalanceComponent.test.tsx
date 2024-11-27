import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import BalanceService from './BalanceComponent';

describe('BalanceService', () => {

  beforeEach(() => {
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn((key) => {
        if (key === 'username') return 'username';
        if (key === 'authorization') return 'Bearer token';
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('renders initial balance before fetch', () => {
    const initialBalance = 0;
    const setBalance = vi.fn();
    // delay fetch so initial state may be presented
    global.fetch = vi.fn(() => Promise.resolve({
      json: () => setTimeout(() => { Promise.resolve(100); }, 1000)
    } as unknown as Response));

    render(<BalanceService balance={initialBalance} setBalance={setBalance} />);

    expect(screen.getByText(/Balance: 0/i)).toBeInTheDocument();
  });

  it('fetches and displays the balance', async () => {

    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(100) } as Response));

    let balance = 0;
    const setBalance = (newBalance: number) => { balance = newBalance; };
    const mockBalance = 100;

    render(<BalanceService balance={balance} setBalance={setBalance} />);

    setTimeout(() => {
      expect(screen.getByText(`Balance: ${mockBalance}`)).toBeInTheDocument();
    }, 1000);    
  });
});
