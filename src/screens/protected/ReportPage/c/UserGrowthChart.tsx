'use client';

import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';

 


//    "data": [
//         {
//             "month": "Dec",
//             "newMembers": 5,
//             "cumulative": 5
//         }
//     ],
//     "summary": {
//         "total_members": 5,
//         "new_this_year": 5
//     }



interface UserGrowthChartProps {
  data?: {
    month: string;
    newMembers:number;
    cumulative: number;
  }[];
}


export function UserGrowthChart({ data }: UserGrowthChartProps) {

    console.log(data)
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