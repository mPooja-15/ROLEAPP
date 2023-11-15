
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authenticationService } from './services';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authenticationService.currentUserValue;
  return isAuthenticated ? children : <Navigate to="/login" />;
};
export default PrivateRoute;