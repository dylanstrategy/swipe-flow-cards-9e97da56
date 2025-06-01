
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

const OperatorTodayTab = () => {
  const communityManagementData = [
    { title: 'Unsupported Move In\'s', count: 18, status: 'urgent' },
    { title: 'Unsupported Move Out\'s', count: 8, status: 'normal' },
    { title: 'Unscheduled Inspections', count: 4, status: 'normal' },
    { title: 'Pending Two Week Check In\'s', count: 0, status: 'normal' },
    { title: 'Move In\'s Staged/Ready', count: 0, status: 'normal' },
    { title: 'Incomplete Move In\'s', count: 14, status: 'normal' },
    { title: 'Incomplete Move Out\'s', count: 8, status: 'normal' },
    { title: 'Pending Diego\'s', count: 8, status: 'normal' },
    { title: 'Outstanding Terms', count: 0, status: 'normal' },
    { title: 'Agent Make Ready Inspections', count: 0, status: 'normal' },
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

  const renderSection = (title: string, data: any[], bgColor: string = 'bg-blue-100') => (
    <div className="mb-8">
      <div className={`${bgColor} p-4 rounded-t-lg`}>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
        {data.map((item, index) => (
          <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(item.status)}`}>
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

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Operations Overview</h1>
        <p className="text-gray-600">Monday's Data - 3/24/2025</p>
      </div>

      {renderSection('COMMUNITY MANAGEMENT', communityManagementData, 'bg-blue-100')}
      {renderSection('PROPERTY SERVICES', propertyServicesData, 'bg-green-100')}
      {renderSection('LEASING', leasingData, 'bg-purple-100')}
      {renderSection('RENEWALS', renewalsData, 'bg-orange-100')}
      {renderSection('DELINQUENCY', delinquencyData, 'bg-red-100')}
    </div>
  );
};

export default OperatorTodayTab;
