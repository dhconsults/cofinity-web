// src/components/reports/FinancialSummaryChart.tsx
'use client';

import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

 

interface FinancialSummaryChartProps {
  data?: Array<{ month: string; inflows: number; outflows: number; net: number }>;
}

export function FinancialSummaryChart({ data }: FinancialSummaryChartProps) {
    console.log(data)
  if (!data || data.length === 0) {
    return <div className="h-96 flex items-center justify-center text-muted-foreground">No data available</div>;
  }



  return (
    <div className="h-96 w-full " style={{ overflow: 'hidden' }}>
      <ResponsiveContainer width="100%" height="100%" >
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
          <Legend />
          <Area type="monotone" dataKey="inflows" stackId="1" stroke="#10b981" fill="#10b981" name="Inflows" />
          <Area type="monotone" dataKey="outflows" stackId="1" stroke="#ef4444" fill="#ef4444" name="Outflows" />
          <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={3} name="Net Flow" />
        </AreaChart>
      </ResponsiveContainer>
      <CardDescription className="text-center mt-4">
        Stacked inflows/outflows with net flow overlay
      </CardDescription>
    </div>
  );
}