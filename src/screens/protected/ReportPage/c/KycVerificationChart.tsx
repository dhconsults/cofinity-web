'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

const data = [
  { name: 'BVN Verified', value: 88, color: '#10b981' },
  { name: 'BVN Pending', value: 12, color: '#f59e0b' },
  { name: 'NIN Verified', value: 82, color: '#6366f1' },
  { name: 'NIN Pending', value: 18, color: '#ef4444' },
  { name: 'Bank Account Linked', value: 75, color: '#8b5cf6' },
  { name: 'Next of Kin Added', value: 92, color: '#06b6d4' },
];

export function KycVerificationChart() {
  return (
    <div className="h-96 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data.slice(0, 2)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
            {data.slice(0, 2).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <ResponsiveContainer>
        <PieChart>
          <Pie data={data.slice(2)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
            {data.slice(2).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <CardDescription className="col-span-full text-center -mt-4">
        KYC completion rates (donut style) – split for clarity
      </CardDescription>
    </div>
  );
}