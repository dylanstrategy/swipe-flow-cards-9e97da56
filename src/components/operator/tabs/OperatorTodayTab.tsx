import React, { useState } from 'react';
import { Users, Building, Calendar, MessageSquare, Target, TrendingUp, Home, Wrench } from 'lucide-react';
import CRMTracker from '../CRMTracker';

const OperatorTodayTab = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [showCRMTracker, setShowCRMTracker] = useState(false);
  const [crmFilter, setCrmFilter] = useState<'leases' | 'shows' | 'outreach'>('leases');

  const timeframeOptions = [
    { value: 'week', label: 'End of Week' },
    { value: '30', label: '30 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' }
  ];

  const getCountsForTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case 'week':
        return {
          occupancy: '92%',
          vacant: 8,
          available: 12,
          requiredLeases: 15,
          shows: 25,
          outreach: 18
        };
      case '30':
        return {
          occupancy: '88%',
          vacant: 12,
          available: 18,
          requiredLeases: 28,
          shows: 42,
          outreach: 35
        };
      case '60':
        return {
          occupancy: '85%',
          vacant: 15,
          available: 22,
          requiredLeases: 45,
          shows: 68,
          outreach: 52
        };
      case '90':
        return {
          occupancy: '82%',
          vacant: 18,
          available: 28,
          requiredLeases: 62,
          shows: 89,
          outreach: 71
        };
      default:
        return {
          occupancy: '88%',
          vacant: 12,
          available: 18,
          requiredLeases: 28,
          shows: 42,
          outreach: 35
        };
    }
  };

  const currentCounts = getCountsForTimeframe(selectedTimeframe);

  const handleCRMClick = (filter: 'leases' | 'shows' | 'outreach') => {
    setCrmFilter(filter);
    setShowCRMTracker(true);
  };

  if (showCRMTracker) {
    return <CRMTracker onClose={() => setShowCRMTracker(false)} initialFilter={crmFilter} />;
  }

  const overview = [
    {
      title: 'Total Units',
      count: '150',
      status: 'total'
    },
    {
      title: 'Current Residents',
      count: '138',
      status: 'occupied'
    },
    {
      title: 'Maintenance',
      count: 7,
      status: 'pending',
      module: 'maintenance'
    },
    {
      title: 'Renewals',
      count: 12,
      status: 'due',
      module: 'renewals'
    }
  ];

  const leasing = [
    {
      title: 'Occupancy',
      count: currentCounts.occupancy,
      status: 'current'
    },
    {
      title: 'Vacant Units',
      count: currentCounts.vacant,
      status: 'available'
    },
    {
      title: 'Available Units',
      count: currentCounts.available,
      status: 'ready'
    },
    {
      title: 'Required Leases',
      count: currentCounts.requiredLeases,
      status: 'needed',
      module: 'crm',
      filter: 'leases' as const
    },
    {
      title: 'Shows',
      count: currentCounts.shows,
      status: 'scheduled',
      module: 'crm',
      filter: 'shows' as const
    },
    {
      title: 'Outreach',
      count: currentCounts.outreach,
      status: 'pending',
      module: 'crm',
      filter: 'outreach' as const
    }
  ];

  const handleModuleClick = (module: string, filter?: 'leases' | 'shows' | 'outreach') => {
    if (module === 'crm' && filter) {
      handleCRMClick(filter);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations Dashboard</h1>
        <p className="text-gray-600">The Meridian • Live Data</p>
      </div>

      {/* Property Overview */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Building className="text-blue-600" size={24} />
          PROPERTY OVERVIEW
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overview.map((item, index) => (
            <div 
              key={index} 
              className={`bg-gray-50 rounded-lg p-4 text-center ${
                item.module ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
              }`}
              onClick={() => item.module && handleModuleClick(item.module)}
            >
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-600">{item.title}</div>
              <div className={`text-xs mt-1 ${
                item.status === 'total' ? 'text-blue-600' :
                item.status === 'occupied' ? 'text-green-600' :
                item.status === 'pending' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {item.status === 'total' ? 'Total Units' :
                 item.status === 'occupied' ? 'Occupied' :
                 item.status === 'pending' ? 'Pending' :
                 'Due Soon'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leasing */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="text-green-600" size={24} />
            LEASING
          </h2>
          
          {/* Timeframe Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedTimeframe(option.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeframe === option.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {leasing.map((item, index) => (
            <div 
              key={index} 
              className={`bg-gray-50 rounded-lg p-4 text-center ${
                item.module ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
              }`}
              onClick={() => item.module && item.filter && handleModuleClick(item.module, item.filter)}
            >
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-600">{item.title}</div>
              <div className={`text-xs mt-1 ${
                item.status === 'current' ? 'text-blue-600' :
                item.status === 'available' ? 'text-gray-600' :
                item.status === 'ready' ? 'text-green-600' :
                item.status === 'needed' ? 'text-red-600' :
                item.status === 'scheduled' ? 'text-blue-600' :
                'text-yellow-600'
              }`}>
                {item.status === 'current' ? 'Current Rate' :
                 item.status === 'available' ? 'Need Prep' :
                 item.status === 'ready' ? 'Move-in Ready' :
                 item.status === 'needed' ? 'Target Goal' :
                 item.status === 'scheduled' ? 'This Period' :
                 'Needs Contact'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={24} />
          LIVE ACTIVITY FEED
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">New lead: Sarah Johnson - 2BR inquiry</span>
            <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Tour completed: Unit 5C - Mike Chen</span>
            <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Maintenance request: Unit 3A - Leaky faucet</span>
            <span className="text-xs text-gray-500 ml-auto">32 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorTodayTab;
