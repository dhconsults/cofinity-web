// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getData } from "@/lib/storageHelper";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api-client";
import { TENANT_API } from "@/constants";

type Props = {
  children: React.ReactNode;
  requireCooperative?: boolean;
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  requireCooperative = true,
  redirectTo = "/login",
}: Props) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCheckingCoop, setIsCheckingCoop] = useState(true);
  const [isCoopActive, setIsCoopActive] = useState<boolean | null>(null);

  // Get locally saved cooperative ID
  const localCoopId = getData<string | number>("selected_cooperative_id");

  useEffect(() => {
    const checkCooperativeStatus = async () => {
      if (!requireCooperative || !isAuthenticated || !localCoopId) {
        setIsCheckingCoop(false);
        return;
      }

      try {
        // Call your backend to verify this cooperative is active and belongs to user
        const response = await apiClient.get(TENANT_API.TENANT_STATUS(localCoopId));

        if (response.success && response.data?.is_active) {
          setIsCoopActive(true);
        } else {
          // Invalid or inactive → force re-selection
          localStorage.removeItem("selected_cooperative_id");
          setIsCoopActive(false);
        }
      } catch (error) {
        console.warn("Failed to verify cooperative status:", error);
        // Optional: fallback to local if API down
        setIsCoopActive(true);
      } finally {
        setIsCheckingCoop(false);
      }
    };

    if (!authLoading) {
      checkCooperativeStatus();
    }
  }, [isAuthenticated, authLoading, localCoopId, requireCooperative]);

  // 1. Still loading auth
  if (authLoading || (requireCooperative && isCheckingCoop)) {
    return <ProtectedRouteSkeleton />;
  }

  // 2. Not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 3. Needs cooperative but none selected or invalid
  if (requireCooperative && (!localCoopId || isCoopActive === false)) {
    return <Navigate to="/cooperative-selection" replace />;
  }

  // 4. All good!
  return <>{children}</>;
}

// Beautiful skeleton while loading
function ProtectedRouteSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 space-y-6">
          <Skeleton className="h-10 w-40" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Skeleton className="h-16 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}