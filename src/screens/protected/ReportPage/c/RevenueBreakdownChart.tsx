'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CardDescription } from '@/components/ui/card';

interface RevenueBreakdownChartProps {
  data?: {
    source: string;
    amount: number;
  }[];
}

export function RevenueBreakdownChart({ data }: RevenueBreakdownChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No revenue data
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="source" />
          <YAxis
            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number) => `₦${value.toLocaleString()}`}
          />
          <Bar
            dataKey="amount"
            fill="#22c55e"
            radius={[8, 8, 0, 0]}
            activeBar={{ fill: '#16a34a' }}
          />
        </BarChart>
      </ResponsiveContainer>

      <CardDescription className="text-center mt-4">
        Revenue by source
      </CardDescription>
    </div>
  );
}
