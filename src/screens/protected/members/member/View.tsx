"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Building2,
  CreditCard,
  FileText,
  MessageCircle,
  Edit3,
  ArrowLeft,
  Landmark,
  IdCard,
  Users,
  Wallet,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import MemberDetailsSkeleton from "@/screens/Components/skeletons/MemberDetailsSkeleton";
import TransactionsSkeleton from "@/screens/Components/skeletons/TransactionsSkeleton";
import LoansSkeleton from "@/screens/Components/skeletons/LoansSkeleton";
import KYCSkeleton from "@/screens/Components/skeletons/KYCSkeleton";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"; // <-- New import

import { MEMBERS_API } from "@/constants";
// Lazy load tab content
const MemberDetails = React.lazy(
  () => import("@/screens/protected/members/member/c/MemberDetails")
);
const AccountOverview = React.lazy(
  () => import("@/screens/protected/members/member/c/AccountOverview")
);
const TransactionsTab = React.lazy(
  () => import("@/screens/protected/members/member/c/TransactionsTab")
);
const LoansTab = React.lazy(
  () => import("@/screens/protected/members/member/c/LoansTab")
);
const KYCDocuments = React.lazy(
  () => import("@/screens/protected/members/member/c/KYCDocuments")
);
const SendEmail = React.lazy(
  () => import("@/screens/protected/members/member/c/SendEmail")
);
const SendSMS = React.lazy(
  () => import("@/screens/protected/members/member/c/SendSMS")
);
const EditMember = React.lazy(
  () => import("@/screens/protected/members/member/c/EditMember")
);
// New lazy loaded components
const SavingsAccountTab = React.lazy(
  () => import("@/screens/protected/members/member/c/SavingsAccountTab")
);
const NextOfKinTab = React.lazy(
  () => import("@/screens/protected/members/member/c/NextOfKinTab")
);
const BankAccountTab = React.lazy(
  () => import("@/screens/protected/members/member/c/BankAccountTab")
);

export default function ViewMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

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

  const tabs = [
    { value: "details", label: "Details", icon: User },
    { value: "overview", label: "Overview", icon: CreditCard },
    { value: "savings", label: "Savings Accounts", icon: Wallet },
    { value: "loans", label: "Loans", icon: Landmark },
    { value: "transactions", label: "Transactions", icon: FileText },
    { value: "bank-accounts", label: "Bank Accounts", icon: Banknote },
    { value: "next-of-kin", label: "Next of Kin", icon: Users },
    { value: "kyc", label: "KYC Docs", icon: IdCard },
    { value: "email", label: "Send Email", icon: Mail },
    { value: "sms", label: "Send SMS", icon: MessageCircle },
    { value: "edit", label: "Edit Member", icon: Edit3 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white -mx-6 px-6 ">
        <div className="mx-auto px-6 py-12">
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
                <Badge
                  variant={
                    member.bvn_verified || member.nin_verified
                      ? "default"
                      : "secondary"
                  }
                >
                  {member.bvn_verified || member.nin_verified
                    ? "KYC Verified"
                    : "KYC Pending"}
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

      {/* Main Content with Sidebar */}
      <div className="mx-auto px-6 -mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <nav className="w-full md:w-64 bg-white rounded-2xl shadow-sm p-4 md:sticky md:top-4 md:h-fit">
            <ScrollArea className="h-[calc(100vh-8rem)] md:h-auto pr-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.value}>
                    <Button
                      variant={activeTab === tab.value ? "default" : "ghost"}
                      className="w-full justify-start text-left text-sm py-3 px-4 rounded-lg"
                      onClick={() => setActiveTab(tab.value)}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </nav>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 min-h-screen">
            <React.Suspense fallback={<MemberDetailsSkeleton />}>
              {activeTab === "details" && <MemberDetails member={member} />}
            </React.Suspense>
            <React.Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              }
            >
              {activeTab === "overview" && <AccountOverview member={member} />}
            </React.Suspense>
            <React.Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              }
            >
              {activeTab === "savings" && (
                <SavingsAccountTab memberId={member.id} />
              )}
            </React.Suspense>
            <React.Suspense fallback={<LoansSkeleton />}>
              {activeTab === "loans" && <LoansTab memberId={member.id} />}
            </React.Suspense>
            <React.Suspense fallback={<TransactionsSkeleton />}>
              {activeTab === "transactions" && (
                <TransactionsTab memberId={member.id} />
              )}
            </React.Suspense>
            <React.Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              }
            >
              {activeTab === "bank-accounts" && (
                <BankAccountTab memberId={member.id} />
              )}
            </React.Suspense>
            <React.Suspense fallback={<MemberDetailsSkeleton />}>
              {activeTab === "next-of-kin" && <NextOfKinTab member={member} />}
            </React.Suspense>
            <React.Suspense fallback={<KYCSkeleton />}>
              {activeTab === "kyc" && <KYCDocuments member={member} />}
            </React.Suspense>
            <React.Suspense
              fallback={
                <div className="text-center p-12">
                  <Skeleton className="h-64 w-full mx-auto" />
                </div>
              }
            >
              {activeTab === "email" && <SendEmail member={member} />}
            </React.Suspense>
            <React.Suspense
              fallback={
                <div className="text-center p-12">
                  <Skeleton className="h-64 w-full mx-auto" />
                </div>
              }
            >
              {activeTab === "sms" && <SendSMS member={member} />}
            </React.Suspense>
            <React.Suspense fallback={<MemberDetailsSkeleton />}>
              {activeTab === "edit" && <EditMember member={member} />}
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
