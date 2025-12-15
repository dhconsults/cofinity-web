'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

const data = [
  { source: 'Membership Fees', amount: 250000 },
  { source: 'Loan Interest', amount: 480000 },
  { source: 'Application/Processing Fees', amount: 120000 },
  { source: 'Late Penalties', amount: 65000 },
  { source: 'Dividend Income', amount: 90000 },
  { source: 'Other', amount: 35000 },
];

export function RevenueBreakdownChart() {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
          <YAxis dataKey="source" type="category" width={150} />
          <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
          <Bar dataKey="amount" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
      <CardDescription className="text-center mt-4">
        Annual revenue by source (horizontal for better label readability)
      </CardDescription>
    </div>
  );
}