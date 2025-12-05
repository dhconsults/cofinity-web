import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getData } from "@/lib/storageHelper";

type Props = {
  children: JSX.Element;
  requireCooperative?: boolean; // default: true
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  requireCooperative = true,
  redirectTo = "/login",
}: Props) {
  const { isAuthenticated, isLoading, user, tenants } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // or return a spinner

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }






    if (requireCooperative) {
    // check server state first, then local persisted selection
    const hasServerCooperative =
      (Array.isArray(tenants) && tenants.length > 0) || !!(user as any)?.selected_cooperative;

    const localSelected = getData<number | string>("selected_cooperative_id");
    const hasLocalCooperative = !!localSelected;

    if (!hasServerCooperative && !hasLocalCooperative) {
      return <Navigate to="/cooperative-selection" replace />;
    }


 
  }

  return children;
}