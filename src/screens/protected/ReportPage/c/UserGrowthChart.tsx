'use client';

import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

const data = [
  { month: 'Jan', newMembers: 45, cumulative: 1200 },
  { month: 'Feb', newMembers: 52, cumulative: 1252 },
  { month: 'Mar', newMembers: 48, cumulative: 1300 },
  { month: 'Apr', newMembers: 61, cumulative: 1361 },
  { month: 'May', newMembers: 58, cumulative: 1419 },
  { month: 'Jun', newMembers: 70, cumulative: 1489 },
  { month: 'Jul', newMembers: 65, cumulative: 1554 },
  { month: 'Aug', newMembers: 72, cumulative: 1626 },
  { month: 'Sep', newMembers: 68, cumulative: 1694 },
  { month: 'Oct', newMembers: 75, cumulative: 1769 },
  { month: 'Nov', newMembers: 80, cumulative: 1849 },
  { month: 'Dec', newMembers: 85, cumulative: 1934 },
];

export function UserGrowthChart() {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="cumulative" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Total Members" />
          <Line type="monotone" dataKey="newMembers" stroke="#10b981" strokeWidth={3} name="New Members" />
        </AreaChart>
      </ResponsiveContainer>
      <CardDescription className="text-center mt-4">
        Cumulative members (area) with monthly new registrations (line)
      </CardDescription>
    </div>
  );
}