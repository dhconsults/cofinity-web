'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CardDescription } from '@/components/ui/card';

interface KycVerificationChartProps {
  data?: {
    total_members: number;
    bvn_verified_pct: number;
    nin_verified_pct: number;
    bank_account_pct: number;
    next_of_kin_pct: number;
  };
}

export function KycVerificationChart({ data }: KycVerificationChartProps) {

    console.log(data)
  if (!data) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const chartData = [
    { name: 'BVN', value: data.bvn_verified_pct, color: '#22c55e' },
    { name: 'NIN', value: data.nin_verified_pct, color: '#3b82f6' },
    { name: 'Bank', value: data.bank_account_pct, color: '#f97316' },
    { name: 'Next of Kin', value: data.next_of_kin_pct, color: '#a855f7' },
  ];

  const hasValues = chartData.some(item => item.value > 0);

  if (!hasValues) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No KYC completed yet
      </div>
    );
  }

  return (
    <div className="h-96 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Chart 1 */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData.slice(0, 2)}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.slice(0, 2).map((entry, index) => (
              <Cell key={`cell-1-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Chart 2 */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData.slice(2)}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.slice(2).map((entry, index) => (
              <Cell key={`cell-2-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <CardDescription className="col-span-full text-center -mt-4">
        KYC completion rates (donut style)
      </CardDescription>
    </div>
  );
}
