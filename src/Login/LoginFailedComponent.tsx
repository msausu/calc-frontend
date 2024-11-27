import {  Snackbar, Alert } from '@mui/material';

interface LoginFailedPopupProps {
  open: boolean;
  onClose: () => void;
}

const LoginFailedPopup: React.FC<LoginFailedPopupProps> = ({ open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="error" variant="filled">
        Login failed. Please check your credentials.
      </Alert>
    </Snackbar>
  );
};

export default LoginFailedPopup;
