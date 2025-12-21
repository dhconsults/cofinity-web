// src/components/reports/ReportHeader.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export function ReportHeader() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/reports/export-pdf', {
        responseType: 'blob',
        params: { year: 2025 },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cooperative-reports-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('PDF report downloaded!');
    } catch (error:any) {
      toast.error(  "Error", { description: "Failed to generate PDF"});
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Key insights and performance metrics for your cooperative
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleExportPdf} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Generating..." : "Export PDF"}
        </Button>
      </div>
    </div>
  );
}