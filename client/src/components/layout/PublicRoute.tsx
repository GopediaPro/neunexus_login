import { ROUTERS } from "@/constant/route";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const isLogin = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  if (isLogin) {
    return <Navigate to={ROUTERS.MAIN} replace />;
  }

  return <>{children}</>;
};
