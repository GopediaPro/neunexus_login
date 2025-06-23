import { createContext, useContext } from 'react';
import { useKeycloakAuth } from '../hooks';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
}
// 인증 컨텍스트
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const auth = useKeycloakAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
