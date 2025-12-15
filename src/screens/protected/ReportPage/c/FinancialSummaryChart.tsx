// src/components/reports/FinancialSummaryChart.tsx
'use client';

import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

const data = [
  { month: 'Jan', inflows: 500000, outflows: 300000, net: 200000 },
  { month: 'Feb', inflows: 510000, outflows: 308000, net: 202000 },
  { month: 'Mar', inflows: 520000, outflows: 316000, net: 204000 },
  { month: 'Apr', inflows: 530000, outflows: 324000, net: 206000 },
  { month: 'May', inflows: 540000, outflows: 332000, net: 208000 },
  { month: 'Jun', inflows: 550000, outflows: 340000, net: 210000 },
  { month: 'Jul', inflows: 560000, outflows: 348000, net: 212000 },
  { month: 'Aug', inflows: 570000, outflows: 356000, net: 214000 },
  { month: 'Sep', inflows: 580000, outflows: 364000, net: 216000 },
  { month: 'Oct', inflows: 590000, outflows: 372000, net: 218000 },
  { month: 'Nov', inflows: 600000, outflows: 380000, net: 220000 },
  { month: 'Dec', inflows: 610000, outflows: 388000, net: 222000 },
];

export function FinancialSummaryChart() {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
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