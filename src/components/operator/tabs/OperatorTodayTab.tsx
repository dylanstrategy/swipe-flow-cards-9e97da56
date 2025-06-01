
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, BarChart3, Grid3X3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import MoveInTracker from '../MoveInTracker';
import MoveOutTracker from '../MoveOutTracker';

const OperatorTodayTab = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'dashboard'>('cards');
  const [showMoveInTracker, setShowMoveInTracker] = useState(false);
  const [showMoveOutTracker, setShowMoveOutTracker] = useState(false);
  const [moveInFilter, setMoveInFilter] = useState<'unapproved' | 'incomplete' | 'all'>('all');
  const [moveOutFilter, setMoveOutFilter] = useState<'unapproved' | 'incomplete' | 'all'>('all');

  const communityManagementData = [
    { title: 'Unsupported Move In\'s', count: 18, status: 'urgent', module: 'move-in-unapproved' },
    { title: 'Unsupported Move Out\'s', count: 8, status: 'normal', module: 'move-out-unapproved' },
    { title: 'Unscheduled Inspections', count: 26, status: 'normal' },
    { title: 'Pending Two Week Check In\'s', count: 0, status: 'normal' },
    { title: 'Move In\'s Staged/Ready', count: 0, status: 'normal' },
    { title: 'Incomplete Move In\'s', count: 14, status: 'normal', module: 'move-in-incomplete' },
    { title: 'Incomplete Move Out\'s', count: 8, status: 'normal', module: 'move-out-incomplete' },
    { title: 'Pending Dispo', count: 8, status: 'normal' },
    { title: 'Outstanding Turns', count: 0, status: 'normal' },
    { title: 'Birthdays This Month', count: 3, status: 'normal' },
    { title: 'Response Time', count: -1.00, suffix: 'days old', status: 'urgent' }
  ];

  const propertyServicesData = [
    { title: 'Work Orders', count: 32, status: 'normal' },
    { title: 'WO: Waiting On Others', count: 0, status: 'normal' },
    { title: 'Pending Make Ready', count: 32, status: 'normal' },
    { title: 'Outstanding Make Readys with MR\'s Missing Punches', count: 2, status: 'normal' },
    { title: 'Average WO Response Time', count: 33.00, suffix: 'days', status: 'urgent' },
    { title: 'Move In\'s Next 7 Days', count: 2, status: 'normal' },
    { title: 'Pending Property Walk Items', count: 7, status: 'normal' },
    { title: 'Expense Budget', count: '$432,207.30', status: 'normal' },
    { title: 'YTD Spend', count: '$92,856.32', status: 'normal' },
    { title: 'Remaining Allowance Per Line Item', count: '$300,509.75 Cleaning', status: 'normal' },
    { title: 'Suggested Monthly Line Item Allowance', count: '$329.97', status: 'normal' },
    { title: 'Average PM Response Time', count: 33, status: 'urgent' },
    { title: 'Move Out\'s Next 7 Days', count: 4, status: 'normal' }
  ];

  const leasingData = [
    { title: 'Current Occupancy', count: '97.06%', status: 'good' },
    { title: 'Total Available', count: 10.00, status: 'normal' },
    { title: 'Vacant', count: 0.00, status: 'normal' },
    { title: 'Avg. Vacancy Loss', count: 6.20, status: 'normal' },
    { title: 'Required Leases', count: 0.02, status: 'normal' },
    { title: 'Required Shows', count: 0.06, status: 'normal' },
    { title: 'Required Prospect Outreach', count: 0.51, status: 'normal' },
    { title: '30 Day Occupancy', count: '97.06%', status: 'good' },
    { title: 'Required Leases', count: 3.02, status: 'normal' },
    { title: 'Required Shows', count: 8.51, status: 'normal' },
    { title: 'Required Prospect Outreach', count: 42.55, status: 'normal' },
    { title: '60 Day Occupancy', count: '5', status: 'normal' }
  ];

  const renewalsData = [
    { title: 'Expirations 60 Days', count: 14, status: 'normal' },
    { title: 'Expirations 90 Days', count: 11, status: 'normal' },
    { title: 'Pending', count: 2, status: 'normal' },
    { title: 'Renewed', count: 5, status: 'good' },
    { title: '90 Day Retention Forecast', count: '48%', status: 'poor' },
    { title: 'New Lease Tradional', count: '8.14%', status: 'normal' },
    { title: 'New Lease Renewal', count: '0.57%', status: 'normal' },
    { title: 'All Leases', count: '8.95%', status: 'normal' },
    { title: 'Total Pending Renewal Allowance', count: '$1,379.08', status: 'normal' },
    { title: 'Per Renewal Allowance', count: '$137.91', status: 'normal' }
  ];

  const delinquencyData = [
    { title: 'Balances 30 Days', count: '$0.00', status: 'good' },
    { title: 'Balances 60 Days', count: '$0.00', status: 'good' },
    { title: 'Balances 90+ Days', count: '$0.00', status: 'good' },
    { title: 'Accounts in Legal', count: 0, status: 'good' },
    { title: 'Overdue to Send to Legal', count: 0, status: 'good' },
    { title: 'Overdue to Send Collections Email (After MO)', count: 0, status: 'good' },
    { title: 'Overdue to Send Collections Email (15 days)', count: 0, status: 'good' },
    { title: 'Overdue First Send Collections Email', count: 0, status: 'good' },
    { title: 'Overdue to Send To Collections (30 days after MO)', count: 0, status: 'good' },
    { title: 'Sent to Collections', count: 0, status: 'good' }
  ];

  // Dashboard chart data
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'good': return 'border-green-500 bg-green-50';
      case 'poor': return 'border-orange-500 bg-orange-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'text-red-700';
      case 'good': return 'text-green-700';
      case 'poor': return 'text-orange-700';
      default: return 'text-gray-900';
    }
  };

  const handleCardClick = (item: any) => {
    if (item.module === 'move-in-unapproved') {
      setMoveInFilter('unapproved');
      setShowMoveInTracker(true);
    } else if (item.module === 'move-in-incomplete') {
      setMoveInFilter('incomplete');
      setShowMoveInTracker(true);
    } else if (item.module === 'move-out-unapproved') {
      setMoveOutFilter('unapproved');
      setShowMoveOutTracker(true);
    } else if (item.module === 'move-out-incomplete') {
      setMoveOutFilter('incomplete');
      setShowMoveOutTracker(true);
    }
  };

  const renderSection = (title: string, data: any[], bgColor: string = 'bg-blue-100') => (
    <div className="mb-8">
      <div className={`${bgColor} p-4 rounded-t-lg`}>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
        {data.map((item, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(item.status)}`}
            onClick={() => handleCardClick(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className={`text-2xl font-bold ${getTextColor(item.status)}`}>
                    {item.count} {item.suffix && <span className="text-sm font-normal">{item.suffix}</span>}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDashboardView = () => (
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

      {/* Work Orders Chart */}
      <Card className="md:col-span-2">
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
      <Card className="md:col-span-2">
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

  if (showMoveInTracker) {
    return (
      <MoveInTracker 
        onClose={() => setShowMoveInTracker(false)}
        initialFilter={moveInFilter}
      />
    );
  }

  if (showMoveOutTracker) {
    return (
      <MoveOutTracker 
        onClose={() => setShowMoveOutTracker(false)}
        initialFilter={moveOutFilter}
      />
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Operations Overview</h1>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'dashboard' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>
        <p className="text-gray-600">Monday's Data - 3/24/2025</p>
      </div>

      {viewMode === 'cards' ? (
        <>
          {renderSection('COMMUNITY MANAGEMENT', communityManagementData, 'bg-blue-100')}
          {renderSection('PROPERTY SERVICES', propertyServicesData, 'bg-green-100')}
          {renderSection('LEASING', leasingData, 'bg-purple-100')}
          {renderSection('RENEWALS', renewalsData, 'bg-orange-100')}
          {renderSection('DELINQUENCY', delinquencyData, 'bg-red-100')}
        </>
      ) : (
        renderDashboardView()
      )}
    </div>
  );
};

export default OperatorTodayTab;
