"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  CreditCard,
  Wallet,
  Landmark,
  FileText,
  Banknote,
  Users,
  IdCard,
  Mail,
  MessageCircle,
  Edit3,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

import React, { useState } from "react";

// Lazy-loaded components
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

  const tabs = [
    { value: "details", label: "Details", icon: User },
    { value: "overview", label: "Overview", icon: CreditCard },
    { value: "savings", label: "Savings", icon: Wallet },
    { value: "loans", label: "Loans", icon: Landmark },
    { value: "transactions", label: "Transactions", icon: FileText },
    { value: "bank-accounts", label: "Bank Accounts", icon: Banknote },
    { value: "next-of-kin", label: "Next of Kin", icon: Users },
    { value: "kyc", label: "KYC Docs", icon: IdCard },
    { value: "email", label: "Send Email", icon: Mail },
    { value: "sms", label: "Send SMS", icon: MessageCircle },
    { value: "edit", label: "Edit Member", icon: Edit3 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-40 mb-6" />
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-32" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-40" />
                </div>
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

  const renderTabContent = () => {
    return (
      <React.Suspense
        fallback={
          <div className="p-8">
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        {activeTab === "details" && <MemberDetails member={member} />}
        {activeTab === "overview" && <AccountOverview member={member} />}
        {activeTab === "savings" && <SavingsAccountTab memberId={member.id} />}
        {activeTab === "loans" && <LoansTab memberId={member.id} />}
        {activeTab === "transactions" && (
          <TransactionsTab memberId={member.id} />
        )}
        {activeTab === "bank-accounts" && (
          <BankAccountTab memberId={member.id} />
        )}
        {activeTab === "next-of-kin" && <NextOfKinTab member={member} />}
        {activeTab === "kyc" && <KYCDocuments member={member} />}
        {activeTab === "email" && <SendEmail member={member} />}
        {activeTab === "sms" && (
          <SendSMS
            memberId={member.id}
            memberName={`${member.first_name} ${member.last_name}`}
            memberPhone={member.phone || member.mobile || "N/A"}
            membershipType={member.type || "Standard"}
            status={member.status || "Active"}
          />
        )}
        {activeTab === "edit" && <EditMember member={member} />}
      </React.Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col sm:flex-row items-start sm:items-end gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Profile Info */}
          <div className="flex items-start sm:items-end gap-6 w-full">
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-300 border-4 border-white rounded-full shadow-xl" />
              <Badge className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-xs">
                {member.status}
              </Badge>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {member.first_name} {member.last_name}
              </h1>
              <p className="text-lg sm:text-xl opacity-90 mt-1">
                ID: {member.membership_id}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <Badge
                  variant={
                    member.bvn_verified || member.nin_verified
                      ? "default"
                      : "secondary"
                  }
                  className="text-sm"
                >
                  {member.bvn_verified || member.nin_verified
                    ? "KYC Verified"
                    : "KYC Pending"}
                </Badge>
                {member.branch && (
                  <Badge
                    variant="outline"
                    className="text-white border-white text-sm"
                  >
                    {member.branch.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Tabs */}
      <div className="lg:hidden px-0 sm:px-6 lg:px-8 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex gap-2 whitespace-nowrap min-w-max">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2 flex items-center gap-1 text-sm flex-shrink-0"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Desktop & Tablet */}
        <aside className="hidden lg:block lg:col-span-1">
          <nav className="bg-white rounded-2xl shadow-sm p-4 sticky top-6">
            <ScrollArea className="h-[calc(100vh-12rem)] pr-2">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? "default" : "ghost"}
                    className="w-full justify-start gap-3 text-left"
                    onClick={() => setActiveTab(tab.value)}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6 min-h-screen">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
