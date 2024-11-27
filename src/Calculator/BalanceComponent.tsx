import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import OperationResponse from './OperationResponse';

const logEndpoint = import.meta.env.VITE_APP_LOG_ENDPOINT || '';

interface BalanceServiceProps {
  balance: number,
  setBalance: (balance: number) => void;
}

const BalanceService: React.FC<BalanceServiceProps> = ({ balance, setBalance }) => {

  const fetchLastBalance = async (): Promise<void> => {
    const user = sessionStorage.getItem('username') || '';
    const balanceEndpoint = `${logEndpoint}/${encodeURIComponent(user)}/last-balance`;
    const headers = new Headers();
    headers.append(
      'Authorization',
      sessionStorage?.getItem('authorization') || ''
    );
    headers.append('Content-Type', 'application/json');
    const response = await fetch(balanceEndpoint, {
      headers: new Headers(headers),
      credentials: 'include',
    });
    const data: OperationResponse = await response.json();
    setBalance(+data);
  };

  useEffect(() => {
    fetchLastBalance();
  }, []);

  return (
    <Typography variant='h6' sx={{ color: '#333333'}}>
      Balance: {balance}
    </Typography>
  );
};

export default BalanceService;
