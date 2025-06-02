import React, { useState } from 'react';
import { Users, Building, Calendar, MessageSquare, Target, TrendingUp, Home, Wrench, ChevronDown, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import CRMTracker from '../CRMTracker';
import MoveInTracker from '../MoveInTracker';
import MoveOutTracker from '../MoveOutTracker';
import PricingModule from '../PricingModule';

const OperatorTodayTab = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [showCRMTracker, setShowCRMTracker] = useState(false);
  const [showMoveInTracker, setShowMoveInTracker] = useState(false);
  const [showMoveOutTracker, setShowMoveOutTracker] = useState(false);
  const [showPricingModule, setShowPricingModule] = useState(false);
  const [pricingFilter, setPricingFilter] = useState<'all' | 'available' | 'vacant' | 'occupied'>('all');
  const [crmFilter, setCrmFilter] = useState<'leases' | 'shows' | 'outreach'>('leases');
  const [showGraphs, setShowGraphs] = useState(false);

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
          occupancy: '98%',
          vacant: 3,
          available: 8,
          requiredLeases: 12,
          shows: 25,
          outreach: 18,
          moveIns: 5,
          moveOuts: 3
        };
      case '30':
        return {
          occupancy: '97%',
          vacant: 6,
          available: 12,
          requiredLeases: 22,
          shows: 42,
          outreach: 35,
          moveIns: 12,
          moveOuts: 8
        };
      case '60':
        return {
          occupancy: '96%',
          vacant: 8,
          available: 15,
          requiredLeases: 35,
          shows: 68,
          outreach: 52,
          moveIns: 22,
          moveOuts: 15
        };
      case '90':
        return {
          occupancy: '95%',
          vacant: 5,
          available: 18,
          requiredLeases: 45,
          shows: 89,
          outreach: 71,
          moveIns: 35,
          moveOuts: 25
        };
      default:
        return {
          occupancy: '97%',
          vacant: 6,
          available: 12,
          requiredLeases: 22,
          shows: 42,
          outreach: 35,
          moveIns: 12,
          moveOuts: 8
        };
    }
  };

  const currentCounts = getCountsForTimeframe(selectedTimeframe);

  // Chart data
  const occupancyTrendData = [
    { month: 'Jan', rate: 96.2 },
    { month: 'Feb', rate: 97.8 },
    { month: 'Mar', rate: 98.1 },
    { month: 'Apr', rate: 97.5 },
    { month: 'May', rate: 98.2 },
    { month: 'Jun', rate: parseFloat(currentCounts.occupancy) }
  ];

  const leasingPipelineData = [
    { name: 'Leads', value: 45, color: '#3B82F6' },
    { name: 'Tours', value: 28, color: '#10B981' },
    { name: 'Applications', value: 15, color: '#F59E0B' },
    { name: 'Leases', value: 8, color: '#EF4444' }
  ];

  const handleCRMClick = (filter: 'leases' | 'shows' | 'outreach') => {
    console.log('CRM Click:', filter);
    setCrmFilter(filter);
    setShowCRMTracker(true);
  };

  const handleMoveInClick = () => {
    console.log('Move In Click');
    setShowMoveInTracker(true);
  };

  const handleMoveOutClick = () => {
    console.log('Move Out Click');
    setShowMoveOutTracker(true);
  };

  const handlePricingClick = (filter: 'all' | 'available' | 'vacant' | 'occupied' = 'all') => {
    console.log('Pricing Module Click - Opening PricingModule with filter:', filter);
    setPricingFilter(filter);
    setShowPricingModule(true);
  };

  if (showCRMTracker) {
    return <CRMTracker onClose={() => setShowCRMTracker(false)} initialFilter={crmFilter} />;
  }

  if (showMoveInTracker) {
    return <MoveInTracker onClose={() => setShowMoveInTracker(false)} />;
  }

  if (showMoveOutTracker) {
    return <MoveOutTracker onClose={() => setShowMoveOutTracker(false)} />;
  }

  if (showPricingModule) {
    return <PricingModule onClose={() => setShowPricingModule(false)} initialFilter={pricingFilter} />;
  }

  const overview = [
    {
      title: 'Total Units',
      count: '150',
      status: 'total',
      module: 'pricing',
      filter: 'all' as const
    },
    {
      title: 'Current Residents',
      count: '144',
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
      status: 'available',
      module: 'pricing',
      filter: 'vacant' as const
    },
    {
      title: 'Available Units',
      count: currentCounts.available,
      status: 'ready',
      module: 'pricing',
      filter: 'available' as const
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

  const movement = [
    {
      title: 'Move-Ins',
      count: currentCounts.moveIns,
      status: 'incoming',
      module: 'movein'
    },
    {
      title: 'Move-Outs',
      count: currentCounts.moveOuts,
      status: 'outgoing',
      module: 'moveout'
    }
  ];

  const handleModuleClick = (module: string, filter?: any) => {
    console.log('Module click:', module, filter);
    if (module === 'crm' && filter) {
      handleCRMClick(filter);
    } else if (module === 'movein') {
      handleMoveInClick();
    } else if (module === 'moveout') {
      handleMoveOutClick();
    } else if (module === 'pricing') {
      console.log('Calling handlePricingClick for pricing module with filter:', filter);
      handlePricingClick(filter);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations Dashboard</h1>
        <p className="text-gray-600">The Meridian • Live Data</p>
      </div>

      {/* Graph Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowGraphs(!showGraphs)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showGraphs ? <PieChart size={20} /> : <BarChart3 size={20} />}
          {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
        </button>
      </div>

      {/* Graphs Section */}
      {showGraphs && (
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="text-purple-600" size={24} />
            ANALYTICS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Occupancy Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={occupancyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[94, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Leasing Pipeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={leasingPipelineData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {leasingPipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

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

      {/* Movement Tracking */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Home className="text-orange-600" size={24} />
          MOVEMENT TRACKING
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {movement.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleModuleClick(item.module)}
            >
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-600">{item.title}</div>
              <div className={`text-xs mt-1 ${
                item.status === 'incoming' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.status === 'incoming' ? 'Scheduled' : 'Planned'}
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
          
          {/* Timeframe Toggle - Cleaner Design */}
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
              onClick={() => {
                console.log('Leasing item clicked:', item.title, item.module, item.filter);
                if (item.title === 'Vacant Units' || item.title === 'Available Units') {
                  handleModuleClick('pricing');
                } else if (item.module && item.filter) {
                  handleModuleClick(item.module, item.filter);
                } else if (item.module) {
                  handleModuleClick(item.module);
                }
              }}
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
