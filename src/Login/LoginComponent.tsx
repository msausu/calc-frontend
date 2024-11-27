import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import getAuthorization from './LoginService';
import LoginFailedPopup from './LoginFailedComponent';
import "../Calculator/CalculatorComponent.css";

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('john@gmail.com');
  const [password, setPassword] = useState<string>('john0000');
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      setError('Both fields are required');
      return;
    }

    getAuthorization(username, password).then((auth) => {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('authorization', auth);
      onLogin();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }).catch((_error: string) => {
      setLoginFailed(true);
    });
  };

  const buttonStyle = {
    backgroundColor: '#2F4F7F',
    '&:hover': {
      backgroundColor: '#0e064c', 
    },
    mt: 2
  };
  
  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={8}
        mb={2}
        p={3}
        boxShadow={3}
        borderRadius={2}
      >
      <Typography variant="h5" sx={{ color: '#333333' }}>
      Calculator
      </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            aria-description='Username'
            fullWidth
            type="text-login"
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            aria-description='Password'
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={buttonStyle}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onKeyUp={(event: any) => {
              if (event.ctrlKey && event.key === 'Enter') {
                event?.currentTarget.click(); 
              }
            }}
          >
            Login
          </Button>
        </form>
      </Box>
      <LoginFailedPopup open={loginFailed} onClose={() => setLoginFailed(false)} />
    </Container>
  );
};

export default Login;
