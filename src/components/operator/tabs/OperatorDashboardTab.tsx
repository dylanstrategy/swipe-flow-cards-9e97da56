
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const OperatorDashboardTab = () => {
  const workOrderData = [
    { month: 'Jan', completed: 45, pending: 12 },
    { month: 'Feb', completed: 52, pending: 8 },
    { month: 'Mar', completed: 38, pending: 15 },
    { month: 'Apr', completed: 61, pending: 6 },
    { month: 'May', completed: 43, pending: 11 },
    { month: 'Jun', completed: 57, pending: 9 }
  ];

  const occupancyData = [
    { month: 'Jan', rate: 94.2 },
    { month: 'Feb', rate: 96.1 },
    { month: 'Mar', rate: 97.8 },
    { month: 'Apr', rate: 95.4 },
    { month: 'May', rate: 98.1 },
    { month: 'Jun', rate: 97.2 }
  ];

  const leaseStatusData = [
    { name: 'Active', value: 89, color: '#10B981' },
    { name: 'Expiring 30 Days', value: 14, color: '#F59E0B' },
    { name: 'Expiring 60 Days', value: 11, color: '#EF4444' },
    { name: 'Vacant', value: 6, color: '#6B7280' }
  ];

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Property Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">120</p>
                <p className="text-sm text-gray-600">Total Units</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">97.2%</p>
                <p className="text-sm text-gray-600">Occupancy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">32</p>
                <p className="text-sm text-gray-600">Open Work Orders</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">14</p>
                <p className="text-sm text-gray-600">Pending Renewals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lease Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Lease Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={leaseStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {leaseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Work Orders Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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

      {/* Occupancy Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorDashboardTab;
