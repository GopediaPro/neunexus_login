import { ROUTERS } from "@/constant/route";
import { useAuthContext } from "@/contexts";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTERS.MAIN} replace />;
  }

  return <>{children}</>;
};
