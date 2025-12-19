'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';


 

export const useFinancialSummary = (year: number = 2025) =>
  useQuery({
    queryKey: ['financial-summary', year],
    queryFn: () => apiClient.get('/api/reports/financial-summary', { params: { year } }).then(res => res.data),
  });

export const useUserGrowth = (year: number = 2025) =>
  useQuery({
    queryKey: ['user-growth', year],
    queryFn: () => apiClient.get('/api/reports/user-growth', { params: { year } }).then(res => res.data),
  });

export const useLoanDistribution = () =>
  useQuery({
    queryKey: ['loan-distribution'],
    queryFn: () => apiClient.get('/api/reports/loan-distribution').then(res => res.data),
  });

export const useRevenueBreakdown = (year: number = 2025) =>
  useQuery({
    queryKey: ['revenue-breakdown', year],
    queryFn: () => apiClient.get('/api/reports/revenue-breakdown', { params: { year } }).then(res => res.data),
  });

export const useKycVerification = () =>
  useQuery({
    queryKey: ['kyc-verification'],
    queryFn: () => apiClient.get('/api/reports/kyc-verification').then(res => res.data),
  });

export const useSavingsTrend = (year: number = 2025) =>
  useQuery({
    queryKey: ['savings-trend', year],
    queryFn: () => apiClient.get('/api/reports/savings-trend', { params: { year } }).then(res => res.data),
  });