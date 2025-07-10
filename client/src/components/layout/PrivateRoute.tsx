import { useAuthContext } from '@/contexts';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-10 h-10 border-4 border-stroke-base-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
