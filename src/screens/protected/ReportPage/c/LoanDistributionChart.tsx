'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

const data = [
  { name: 'Disbursed', value: 45, color: '#10b981' },
  { name: 'Repaid', value: 28, color: '#6366f1' },
  { name: 'Outstanding', value: 15, color: '#f59e0b' },
  { name: 'Defaulted', value: 8, color: '#ef4444' },
  { name: 'Pending/Approved', value: 4, color: '#8b5cf6' },
];

export function LoanDistributionChart() {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <CardDescription className="text-center mt-4">
        Loan portfolio distribution by current status
      </CardDescription>
    </div>
  );
}