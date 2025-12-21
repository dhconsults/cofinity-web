'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialSummaryChart } from "@/screens/protected/ReportPage/c/FinancialSummaryChart";
import { UserGrowthChart } from "@/screens/protected/ReportPage/c/UserGrowthChart";
import { LoanDistributionChart } from "@/screens/protected/ReportPage/c/LoanDistributionChart";
import { RevenueBreakdownChart } from "@/screens/protected/ReportPage/c/RevenueBreakdownChart";
import { KycVerificationChart } from "@/screens/protected/ReportPage/c/KycVerificationChart";
import { SavingsTrendChart } from "@/screens/protected/ReportPage/c/SavingsTrendChart";
import { Activity, TrendingUp, Users, PiggyBank, FileText, Shield } from "lucide-react";

import { SummaryCard } from "@/screens/protected/ReportPage/c/SummaryCard";


import { ReportHeader } from "@/screens/protected/ReportPage/c/ReportHeader";

 

// import jsPDF from "jspdf";
// import Papa from "papaparse";
// import autoTable from "jspdf-autotable";
 import { useState } from "react";
import { ResponsiveReportNav } from "./c/VerticalTabs";


import {
  useFinancialSummary,
  useUserGrowth,
  useLoanDistribution,
  useRevenueBreakdown,
  useKycVerification,
  useSavingsTrend,
} from '@/hooks/useReports';

import { Skeleton } from '@/components/ui/skeleton';






export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('financial');
  const year = 2025;

  const financial = useFinancialSummary(year);
  const growth = useUserGrowth(year);
  const loans = useLoanDistribution();
  const revenue = useRevenueBreakdown(year);
  const kyc = useKycVerification();
  const savings = useSavingsTrend(year);

  console.log(loans?.data);


 

  const isLoading = financial.isLoading || growth.isLoading || loans.isLoading || 
                    revenue.isLoading || kyc.isLoading || savings.isLoading;

  const summaryMetrics = [
    {
      title: "Total Members",
      value: growth?.data?.summary?.total_members?.toLocaleString() || "0",
      change: `+${growth?.data?.summary?.new_this_year || 0}`,
      icon: Users,
      color: "text-blue-600",
      isLoading: growth.isLoading,
    },
    {
      title: "Total Savings",
      value: savings.data?.summary?.total_savings_balance 
        ? `₦${(savings.data.summary.total_savings_balance / 1000000).toFixed(2)}M`
        : "₦0",
      change: "+12%", // can enhance with YoY later
      icon: PiggyBank,
      color: "text-green-600",
      isLoading: savings.isLoading,
    },
    {
      title: "Active Loans",
      value: loans.data?.summary?.total_loans?.toLocaleString() || "0",
      change: "+8",
      icon: FileText,
      color: "text-amber-600",
      isLoading: loans.isLoading,
    },
    {
      title: "Monthly Revenue",
      value: revenue.data?.summary?.total_revenue 
        ? `₦${(revenue.data.summary.total_revenue / 1000).toFixed(0)}K`
        : "₦0",
      change: "+18%",
      icon: TrendingUp,
      color: "text-purple-600",
      isLoading: revenue.isLoading,
    },
    {
      title: "KYC Complete",
      value: kyc.data?.summary?.bvn_verified_pct 
        ? `${Math.max(kyc.data.summary.bvn_verified_pct, kyc.data.summary.nin_verified_pct)}%`
        : "0%",
      change: "+5%",
      icon: Shield,
      color: "text-cyan-600",
      isLoading: kyc.isLoading,
    },
    {
      title: "Net Cash Flow",
      value: financial.data?.summary?.net_flow 
        ? `₦${(financial.data.summary.net_flow / 1000).toFixed(0)}K`
        : "₦0",
      change: "+10%",
      icon: Activity,
      color: "text-indigo-600",
      isLoading: financial.isLoading,
    },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    switch (activeTab) {
      case 'financial': return <FinancialSummaryChart data={financial?.data?.data} />;
      case 'growth': return <UserGrowthChart data={growth?.data?.chart} />;
      case 'loans': return <LoanDistributionChart data={loans?.data?.data} />;
      case 'revenue': return <RevenueBreakdownChart data={revenue?.data?.data} />;
      case 'kyc': return <KycVerificationChart data={kyc.data.summary} />;
      case 'savings': return <SavingsTrendChart data={savings?.data?.data} />;
      default: return null;
    }
  };

  const exportCSV = () => { /* implement with real data */ };
  const exportPDF = () => { /* implement with real data */ };

  return (
    <div className="min-h-screen bg-background">
      <ReportHeader onExportCSV={exportCSV} onExportPDF={exportPDF} />

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {summaryMetrics.map((metric, i) => (
            <SummaryCard key={i} {...metric} />
          ))}
        </div>
      </div>

      {/* Navigation + Content */}
      <div className="flex flex-col md:flex-row">
        <ResponsiveReportNav activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}



// export default function ReportsPage() {
//   // Mock summary data (will come from API later)
//   const summaryMetrics = [
//     { title: "Total Members", value: "1,934", change: "+85", icon: Users, color: "text-blue-600" },
//     { title: "Total Savings", value: "₦7.02M", change: "+12%", icon: PiggyBank, color: "text-green-600" },
//     { title: "Active Loans", value: "156", change: "+8", icon: FileText, color: "text-amber-600" },
//     { title: "Monthly Revenue", value: "₦985K", change: "+18%", icon: TrendingUp, color: "text-purple-600" },
//     { title: "KYC Complete", value: "88%", change: "+5%", icon: Shield, color: "text-cyan-600" },
//     { title: "Net Cash Flow", value: "₦222K", change: "+10%", icon: Activity, color: "text-indigo-600" },
//   ];

//   // Mock full report data for export
//   const exportData = [
//     { report: "Financial Summary", date: "Dec 15, 2025", inflows: "₦610K", outflows: "₦388K", net: "₦222K" },
//     { report: "Member Growth", date: "Dec 15, 2025", newMembers: 85, total: 1934 },
//     { report: "Loan Distribution", date: "Dec 15, 2025", disbursed: "45%", outstanding: "15%" },
//     // Add more rows as needed...
//   ];



//   const tabItems = [
//     { value: "financial", label: "Financial Summary", icon: Activity, content: <FinancialSummaryChart /> },
//     { value: "growth", label: "User Growth", icon: Users, content: <UserGrowthChart /> },
//     { value: "loans", label: "Loan Distribution", icon: FileText, content: <LoanDistributionChart /> },
//     { value: "revenue", label: "Revenue Breakdown", icon: TrendingUp, content: <RevenueBreakdownChart /> },
//     { value: "kyc", label: "KYC Verification", icon: Shield, content: <KycVerificationChart /> },
//     { value: "savings", label: "Savings Trend", icon: PiggyBank, content: <SavingsTrendChart /> },
//   ];




//   const exportCSVs = () => {
//     const csv = Papa.unparse(exportData);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `cooperative-reports-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   };

//   const exportPDsF = () => {
//     const doc = new jsPDF('l', 'mm', 'a4');
//     doc.setFontSize(20);
//     doc.text("Cooperative Reports Summary", 14, 20);
//     doc.setFontSize(12);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

//     autoTable(doc, {
//       head: [['Report', 'Date', 'Key Metrics']],
//       body: exportData.map(d => [d.report, d.date, Object.entries(d).filter(([k]) => !['report','date'].includes(k)).map(([_,v]) => `${v}`).join(' | ')]),
//       startY: 40,
//     });

//     doc.save(`cooperative-reports-${new Date().toISOString().split('T')[0]}.pdf`);
//   };



//   const [activeTab, setActiveTab] = useState('financial');

 
//   const exportCSV = () => { /* same */ };
//   const exportPDF = () => { /* same */ };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'financial': return <FinancialSummaryChart />;
//       case 'growth': return <UserGrowthChart />;
//       case 'loans': return <LoanDistributionChart />;
//       case 'revenue': return <RevenueBreakdownChart />;
//       case 'kyc': return <KycVerificationChart />;
//       case 'savings': return <SavingsTrendChart />;
//       default: return null; 
//     }
//   };




  

//   return (

//    <div className="p-6 space-y-6 bg-gray-50 min-h-screen ">
//       <ReportHeader onExportCSV={exportCSV} onExportPDF={exportPDF} />

//       {/* Summary Cards */}
//       <div className="container mx-auto ">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
//           {summaryMetrics.map((metric, i) => (
//             <SummaryCard key={i} {...metric} />
//           ))}
//         </div>
//       </div>

//       {/* Layout: Nav + Content */}
//       <div className="flex flex-col md:flex-row container  ">
//         <ResponsiveReportNav activeTab={activeTab} onTabChange={setActiveTab} />
        
//         <main className="flex-1 p-6 md:p-8 overflow-auto w-full ">
//           <div className="max-w-6xl mx-auto">
//             {renderContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }