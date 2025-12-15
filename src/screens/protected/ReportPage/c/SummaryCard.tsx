'use client';

import { Card, CardContent } from "@/components/ui/card";
import {  Download } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  icon: Download;
  color: string; // tailwind text color class
}

export function SummaryCard({ title, value, change, icon: Icon, color }: SummaryCardProps) {
  const isPositive = change.startsWith('+');
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change} vs last month
          </span>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}