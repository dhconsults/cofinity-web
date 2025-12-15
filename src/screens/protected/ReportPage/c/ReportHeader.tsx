'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import Papa from "papaparse";

interface ReportHeaderProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function ReportHeader({ onExportCSV, onExportPDF }: ReportHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Key insights and performance metrics for your cooperative
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={onExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        <Button variant="outline" onClick={onExportPDF}>
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>
    </div>
  );
}