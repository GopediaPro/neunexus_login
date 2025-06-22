import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const isLogin = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
