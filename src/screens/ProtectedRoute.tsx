'use client';

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getData } from '@/lib/storageHelper';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/lib/api-client';
import { TENANT_API } from '@/constants';

type Props = {
  children: React.ReactNode;
  requireCooperative?: boolean; // if true, must have valid active cooperative
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  requireCooperative = true,
  redirectTo = '/login',
}: Props) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();

  const [isChecking, setIsChecking] = useState(true);
  const [tenantStatus, setTenantStatus] = useState<'active' | 'grace_period' | 'suspended' | null>(null);

  const selectedCoopId = getData<string | number>('selected_cooperative_id');

  useEffect(() => {
    const verifyTenant = async () => {
      if (!isAuthenticated || !requireCooperative || !selectedCoopId) {
        setIsChecking(false);
        return;
      }

      try {
        // This endpoint should return tenant details including status
        const response = await apiClient.post(TENANT_API.SWITCH, { tenant_id: selectedCoopId });

        if (response.success && response.data?.tenant) {
          const status = response.data.tenant.status; // 'active' | 'grace_period' | 'suspended'
          setTenantStatus(status);

          // If suspended, clear selection to force re-login/selection later
          if (status === 'suspended') {
            localStorage.removeItem('selected_cooperative_id');
          }
        } else {
          // Invalid tenant
          localStorage.removeItem('selected_cooperative_id');
          setTenantStatus(null);
        }
      } catch (error) {
        console.warn('Failed to verify tenant status:', error);
        // Optional: fallback to allow access if API down
        setTenantStatus('active');
      } finally {
        setIsChecking(false);
      }
    };

    if (!authLoading) {
      verifyTenant();
    }
  }, [isAuthenticated, authLoading, selectedCoopId, requireCooperative]);

  // Still loading
  if (authLoading || (requireCooperative && isChecking)) {
    return <ProtectedRouteSkeleton />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Needs cooperative but none selected or invalid
  if (requireCooperative && (!selectedCoopId || tenantStatus === null)) {
    return <Navigate to="/cooperative-selection" replace />;
  }

  // SUSPENDED: only allow access to billing page
  if (tenantStatus === 'suspended') {
    if (location.pathname.startsWith('/billing')) {
      return <>{children}</>;
    }
    return <Navigate to="/billing" replace />;
  }

  // GRACE PERIOD: optional – you can restrict mutations here if needed
  // For now, allow full access with warning banner shown in UI

  // All good
  return <>{children}</>;
}

// Skeleton remains unchanged
function ProtectedRouteSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>

      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 p-6 space-y-8">
        <Skeleton className="h-10 w-40 mx-auto" />
        <nav className="space-y-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </nav>
        <Skeleton className="h-11 w-full rounded-lg mt-auto" />
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-hidden">
        <Skeleton className="h-10 w-64 mb-8 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}