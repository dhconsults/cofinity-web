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


// {
//     "data": [
//         {
//             "name": "Approved",
//             "value": 2
//         },
//         {
//             "name": "Disbursed",
//             "value": 1
//         },
//         {
//             "name": "Declined",
//             "value": 1
//         }
//     ],
//     "summary": {
//         "total_loans": 4,
//         "total_disbursed": 306000,
//         "total_outstanding": 678754.82
//     }
// }


interface LoanDistributionChartProps {
  data?: {
    name: string;
    value: number;
  }[];
}




export function LoanDistributionChart({ data }: LoanDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];
const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
}));
 
 
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {chartData.map((entry, index) => (
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