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

 

import jsPDF from "jspdf";
import Papa from "papaparse";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
  // Mock summary data (will come from API later)
  const summaryMetrics = [
    { title: "Total Members", value: "1,934", change: "+85", icon: Users, color: "text-blue-600" },
    { title: "Total Savings", value: "₦7.02M", change: "+12%", icon: PiggyBank, color: "text-green-600" },
    { title: "Active Loans", value: "156", change: "+8", icon: FileText, color: "text-amber-600" },
    { title: "Monthly Revenue", value: "₦985K", change: "+18%", icon: TrendingUp, color: "text-purple-600" },
    { title: "KYC Complete", value: "88%", change: "+5%", icon: Shield, color: "text-cyan-600" },
    { title: "Net Cash Flow", value: "₦222K", change: "+10%", icon: Activity, color: "text-indigo-600" },
  ];

  // Mock full report data for export
  const exportData = [
    { report: "Financial Summary", date: "Dec 15, 2025", inflows: "₦610K", outflows: "₦388K", net: "₦222K" },
    { report: "Member Growth", date: "Dec 15, 2025", newMembers: 85, total: 1934 },
    { report: "Loan Distribution", date: "Dec 15, 2025", disbursed: "45%", outstanding: "15%" },
    // Add more rows as needed...
  ];

  const exportCSV = () => {
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cooperative-reports-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(20);
    doc.text("Cooperative Reports Summary", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      head: [['Report', 'Date', 'Key Metrics']],
      body: exportData.map(d => [d.report, d.date, Object.entries(d).filter(([k]) => !['report','date'].includes(k)).map(([_,v]) => `${v}`).join(' | ')]),
      startY: 40,
    });

    doc.save(`cooperative-reports-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <ReportHeader onExportCSV={exportCSV} onExportPDF={exportPDF} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
        {summaryMetrics.map((metric, i) => (
          <SummaryCard key={i} {...metric} />
        ))}
      </div>

      {/* Tabs with Charts */}
      <Tabs defaultValue="financial" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="financial"><Activity className="h-4 w-4 mr-2" /> Financial</TabsTrigger>
          <TabsTrigger value="growth"><Users className="h-4 w-4 mr-2" /> Growth</TabsTrigger>
          <TabsTrigger value="loans"><FileText className="h-4 w-4 mr-2" /> Loans</TabsTrigger>
          <TabsTrigger value="revenue"><TrendingUp className="h-4 w-4 mr-2" /> Revenue</TabsTrigger>
          <TabsTrigger value="kyc"><Shield className="h-4 w-4 mr-2" /> KYC</TabsTrigger>
          <TabsTrigger value="savings"><PiggyBank className="h-4 w-4 mr-2" /> Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="financial"><FinancialSummaryChart /></TabsContent>
        <TabsContent value="growth"><UserGrowthChart /></TabsContent>
        <TabsContent value="loans"><LoanDistributionChart /></TabsContent>
        <TabsContent value="revenue"><RevenueBreakdownChart /></TabsContent>
        <TabsContent value="kyc"><KycVerificationChart /></TabsContent>
        <TabsContent value="savings"><SavingsTrendChart /></TabsContent>
      </Tabs>
    </div>
  );
}