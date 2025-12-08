// src/pages/ViewMember.tsx
"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  User, Phone, Mail, MapPin, Calendar, Shield, Building2,
  CreditCard, FileText, MessageCircle, Edit3, ArrowLeft, Landmark, IdCard
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";

import MemberDetailsSkeleton from "@/screens/Components/skeletons/MemberDetailsSkeleton";
import TransactionsSkeleton from "@/screens/Components/skeletons/TransactionsSkeleton";
import LoansSkeleton from "@/screens/Components/skeletons/LoansSkeleton";
import KYCSkeleton from "@/screens/Components/skeletons/KYCSkeleton";
import React from "react";
import { MEMBERS_API } from "@/constants";

// Lazy load tab content
const MemberDetails = React.lazy(() => import("@/screens/protected/members/member/c/MemberDetails"));
const AccountOverview = React.lazy(() => import("@/screens/protected/members/member/c/AccountOverview"));
const TransactionsTab = React.lazy(() => import("@/screens/protected/members/member/c/TransactionsTab"));
const LoansTab = React.lazy(() => import("@/screens/protected/members/member/c/LoansTab"));
const KYCDocuments = React.lazy(() => import("@/screens/protected/members/member/c/KYCDocuments"));  
const SendEmail = React.lazy(() => import("@/screens/protected/members/member/c/SendEmail"));
const SendSMS = React.lazy(() => import("@/screens/protected/members/member/c/SendSMS")); 
const EditMember = React.lazy(() => import("@/screens/protected/members/member/c/EditMember"));

export default function ViewMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: member, isLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      const res = await apiClient.get(MEMBERS_API.SHOW(Number(id)));
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6">
        <div className="mx-auto">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-6 mb-8">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return <div className="p-8 text-center text-red-600">Member not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="  mx-auto px-6 py-12">
          <Button
            variant="ghost"
            size="icon"
            className="mb-6 text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-end gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-300 border-4 border-white rounded-full shadow-xl" />
              <Badge className="absolute bottom-0 right-0" variant="default">
                {member.status}
              </Badge>
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                {member.first_name} {member.last_name}
              </h1>
              <p className="text-xl opacity-90">ID: {member.membership_id}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant={member.bvn_verified || member.nin_verified ? "default" : "secondary"}>
                  {member.bvn_verified || member.nin_verified ? "KYC Verified" : "KYC Pending"}
                </Badge>
                {member.branch && (
                  <Badge variant="outline" className="text-white border-white">
                    <Building2 className="w-3 h-3 mr-1" />
                    {member.branch.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className=" mx-auto px-6 -mt-8">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full h-auto p-1 bg-white rounded-xl shadow-lg">
            <TabsTrigger value="details" className="text-xs lg:text-sm"><User className="w-4 h-4 mr-2" />Details</TabsTrigger>
            <TabsTrigger value="overview"><CreditCard className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="transactions"><FileText className="w-4 h-4 mr-2" />Transactions</TabsTrigger>
            <TabsTrigger value="loans"><Landmark className="w-4 h-4 mr-2" />Loans</TabsTrigger>
            <TabsTrigger value="kyc"><IdCard className="w-4 h-4 mr-2" />KYC Docs</TabsTrigger>
            <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" />Email</TabsTrigger>
            <TabsTrigger value="sms"><MessageCircle className="w-4 h-4 mr-2" />SMS</TabsTrigger>
            <TabsTrigger value="edit"><Edit3 className="w-4 h-4 mr-2" />Edit</TabsTrigger>
          </TabsList>

          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 min-h-screen">
            <React.Suspense fallback={<MemberDetailsSkeleton />}>
              <TabsContent value="details"><MemberDetails member={member} /></TabsContent>
            </React.Suspense>

            <React.Suspense fallback={<div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>}>
              <TabsContent value="overview"><AccountOverview member={member} /></TabsContent>
            </React.Suspense>

            <React.Suspense fallback={<TransactionsSkeleton />}>
              <TabsContent value="transactions"><TransactionsTab memberId={member.id} /></TabsContent>
            </React.Suspense>

            <React.Suspense fallback={<LoansSkeleton />}>
              <TabsContent value="loans"><LoansTab memberId={member.id} /></TabsContent>
            </React.Suspense>

            <React.Suspense fallback={<KYCSkeleton />}>
              <TabsContent value="kyc"><KYCDocuments member={member} /></TabsContent>
            </React.Suspense>

            <React.Suspense fallback={<div className="text-center p-12"><Skeleton className="h-64 w-full mx-auto" /></div>}>
              <TabsContent value="email"><SendEmail member={member} /></TabsContent>
            </React.Suspense>

            <React.Suspense fallback={<div className="text-center p-12"><Skeleton className="h-64 w-full mx-auto" /></div>}>
              <TabsContent value="sms"><SendSMS member={member} /></TabsContent>
            </React.Suspense>

            <React.Suspense fallback={<MemberDetailsSkeleton />}>
              <TabsContent value="edit"><EditMember member={member} /></TabsContent>
            </React.Suspense>
          </div>
        </Tabs>
      </div>
    </div>
  );
}