'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

const data = [
  { month: 'Jan', deposits: 420000, withdrawals: 180000 },
  { month: 'Feb', deposits: 435000, withdrawals: 195000 },
  { month: 'Mar', deposits: 450000, withdrawals: 210000 },
  { month: 'Apr', deposits: 465000, withdrawals: 225000 },
  { month: 'May', deposits: 480000, withdrawals: 240000 },
  { month: 'Jun', deposits: 495000, withdrawals: 255000 },
  { month: 'Jul', deposits: 510000, withdrawals: 270000 },
  { month: 'Aug', deposits: 525000, withdrawals: 285000 },
  { month: 'Sep', deposits: 540000, withdrawals: 300000 },
  { month: 'Oct', deposits: 555000, withdrawals: 315000 },
  { month: 'Nov', deposits: 570000, withdrawals: 330000 },
  { month: 'Dec', deposits: 585000, withdrawals: 345000 },
];


interface SavingsTrendProp { 
    data?: {
        month: string; 
        deposits: number; 
        withdrawals: number; 

    }[];
}

export function SavingsTrendChart({data}: SavingsTrendProp) {
   

      if (!data || data.length === 0) {
    return <div className="h-96 flex items-center justify-center text-muted-foreground">No data available</div>;
  }

    


  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
          <Legend />
          <Line type="monotone" dataKey="deposits" stroke="#10b981" strokeWidth={3} name="Deposits" />
          <Line type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={3} name="Withdrawals" />
        </LineChart>
      </ResponsiveContainer>
      <CardDescription className="text-center mt-4">
        Monthly savings deposits vs withdrawals (2025)
      </CardDescription>
    </div>
  );
}