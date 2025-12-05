import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Props = { children: JSX.Element; redirectTo?: string };

export default function GuestRoute({ children, redirectTo = "/dashboard" }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null; // or a spinner
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  return children;
}