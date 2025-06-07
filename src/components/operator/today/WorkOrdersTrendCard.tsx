
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wrench } from 'lucide-react';

const WorkOrdersTrendCard = () => {
  const workOrderData = [
    { month: 'Jan', completed: 45, pending: 12 },
    { month: 'Feb', completed: 52, pending: 8 },
    { month: 'Mar', completed: 38, pending: 15 },
    { month: 'Apr', completed: 61, pending: 6 },
    { month: 'May', completed: 43, pending: 11 },
    { month: 'Jun', completed: 57, pending: 9 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          Work Orders Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={workOrderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#10B981" name="Completed" />
            <Bar dataKey="pending" fill="#EF4444" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WorkOrdersTrendCard;
