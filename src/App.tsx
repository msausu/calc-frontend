
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css'

import Calculator from "./Calculator/CalculatorComponent";
import Login from './Login/LoginComponent';
import { ModalProvider } from './Record/ReportController';
import "./styles.css";

const App: React.FC<{ defaultAuthenticated?: boolean }> = ({ defaultAuthenticated = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultAuthenticated);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('authorization', '');
    setIsAuthenticated(false);
  };

  return (
      <ModalProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/calculator" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/calculator"
              element={
                isAuthenticated ? (
                  <Calculator onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </Router>
      </ModalProvider>
  );
};

export default App;
