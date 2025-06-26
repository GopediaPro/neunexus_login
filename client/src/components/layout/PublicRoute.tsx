import { ROUTERS } from "@/constant/route";
import { useAuthContext } from "@/contexts";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={ROUTERS.MAIN} replace />;
  }

  return <>{children}</>;
};
