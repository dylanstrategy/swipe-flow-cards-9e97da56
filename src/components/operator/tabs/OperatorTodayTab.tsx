import React, { useState } from 'react';
import { Users, Building, Calendar, MessageSquare, Target, TrendingUp, Home, Wrench, ChevronDown, BarChart3, PieChart, CalendarDays, Activity, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CRMTracker from '../CRMTracker';
import MoveInTracker from '../MoveInTracker';
import MoveOutTracker from '../MoveOutTracker';
import PricingModule from '../PricingModule';
import CancelNoticeButton from '../CancelNoticeButton';
import CancelMoveOutButton from '../CancelMoveOutButton';
import SwipeCard from '@/components/SwipeCard';
import RescheduleFlow from '@/components/events/RescheduleFlow';
import EventDetailModal from '@/components/events/EventDetailModal';
import { useToast } from '@/hooks/use-toast';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';
import { useResident } from '@/contexts/ResidentContext';
import { getFullName } from '@/utils/nameUtils';

const OperatorTodayTab = () => {
  const { toast } = useToast();
  const { 
    allResidents, 
    getCurrentResidents, 
    getFutureResidents, 
    getVacantUnits, 
    getOccupancyRate,
    getNoticeResidents
  } = useResident();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [showCRMTracker, setShowCRMTracker] = useState(false);
  const [showMoveInTracker, setShowMoveInTracker] = useState(false);
  const [showMoveOutTracker, setShowMoveOutTracker] = useState(false);
  const [showPricingModule, setShowPricingModule] = useState(false);
  const [pricingFilter, setPricingFilter] = useState<'all' | 'available' | 'vacant' | 'occupied'>('all');
  const [crmFilter, setCrmFilter] = useState<'leases' | 'shows' | 'outreach'>('leases');
  const [showGraphs, setShowGraphs] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);
  const [selectedEventForReschedule, setSelectedEventForReschedule] = useState<EnhancedEvent | null>(null);

  // Calculate real data from resident context
  const currentResidents = getCurrentResidents();
  const futureResidents = getFutureResidents();
  const noticeResidents = getNoticeResidents();
  const vacantUnits = getVacantUnits();
  const occupancyRate = getOccupancyRate();
  
  // Calculate additional metrics
  const totalUnits = 100;
  const currentOccupied = currentResidents.length;
  const vacantCount = vacantUnits.length;
  const availableUnits = vacantCount; // Units ready for move-in
  const delinquentResidents = currentResidents.filter(r => r.leaseStatus === 'delinquent').length;
  const expiringLeases = currentResidents.filter(r => r.leaseStatus === 'expiring').length;
  const renewalsPending = currentResidents.filter(r => r.renewalStatus === 'pending').length;
  
  // Calculate PPF metrics based on timeframe
  const getCountsForTimeframe = (timeframe: string) => {
    const baseFutureResidents = futureResidents.length;
    const baseVacant = vacantCount;
    const baseAvailable = availableUnits;
    
    // Project based on timeframe
    const multiplier = timeframe === 'week' ? 0.25 : 
                     timeframe === '30' ? 1 : 
                     timeframe === '60' ? 1.8 : 2.5;
    
    return {
      occupancy: `${Math.round(occupancyRate)}%`,
      vacant: baseVacant,
      available: baseAvailable,
      requiredLeases: Math.round(baseVacant * multiplier * 0.8), // Assume 80% lease rate target
      shows: Math.round(baseVacant * multiplier * 2), // Typically 2-3 shows per lease
      outreach: Math.round(baseVacant * multiplier * 1.5), // Follow-ups needed
      moveIns: baseFutureResidents + Math.round(multiplier * 2),
      moveOuts: Math.round(multiplier * 1.5) // Expected move-outs
    };
  };

  const currentCounts = getCountsForTimeframe(selectedTimeframe);

  // Daily scheduled events for calendar view
  const dailyEvents = [
    {
      id: 1,
      time: '09:00 AM',
      title: 'Move-In Inspection',
      description: 'Unit 4B - Sarah Johnson',
      type: 'move-in',
      priority: 'high',
      status: 'scheduled',
      building: 'Building A',
      unit: '4B'
    },
    {
      id: 2,
      time: '10:30 AM',
      title: 'Lease Signing',
      description: 'Unit 2C - Mike Chen renewal',
      type: 'lease',
      priority: 'medium',
      status: 'confirmed',
      building: 'Building B',
      unit: '2C'
    },
    {
      id: 3,
      time: '11:15 AM',
      title: 'Resident Message',
      description: 'Unit 5A - HVAC repair follow-up',
      type: 'message',
      priority: 'normal',
      status: 'pending',
      building: 'Building C',
      unit: '5A'
    },
    {
      id: 4,
      time: '02:00 PM',
      title: 'Tour Scheduled',
      description: 'Studio unit - Alex Rodriguez',
      type: 'tour',
      priority: 'normal',
      status: 'confirmed',
      building: 'Building A',
      unit: 'Studio-12'
    },
    {
      id: 5,
      time: '03:30 PM',
      title: 'Move-Out Notice',
      description: 'Unit 1A - Notice processing',
      type: 'move-out',
      priority: 'medium',
      status: 'processing',
      building: 'Building A',
      unit: '1A'
    },
    {
      id: 6,
      time: '04:15 PM',
      title: 'Payment Follow-up',
      description: 'Unit 3D - Late rent discussion',
      type: 'payment',
      priority: 'high',
      status: 'urgent',
      building: 'Building B',
      unit: '3D'
    }
  ];

  // Chart data using real occupancy rate
  const occupancyTrendData = [
    { month: 'Jan', rate: 96.2 },
    { month: 'Feb', rate: 97.8 },
    { month: 'Mar', rate: 98.1 },
    { month: 'Apr', rate: 97.5 },
    { month: 'May', rate: 98.2 },
    { month: 'Jun', rate: occupancyRate }
  ];

  const leasingPipelineData = [
    { name: 'Leads', value: 45, color: '#3B82F6' },
    { name: 'Tours', value: 28, color: '#10B981' },
    { name: 'Applications', value: 15, color: '#F59E0B' },
    { name: 'Leases', value: 8, color: '#EF4444' }
  ];

  const timeframeOptions = [
    { value: 'week', label: 'End of Week' },
    { value: '30', label: '30 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' }
  ];

  const enhanceEventForReschedule = (event: any): EnhancedEvent => {
    const assignedTeamMember = teamAvailabilityService.assignTeamMember({ category: event.type });
    
    return {
      id: event.id,
      date: new Date(),
      time: event.time.replace(/\s(AM|PM)/, ''),
      title: event.title,
      description: event.description,
      category: event.type,
      priority: event.priority,
      assignedTeamMember,
      residentName: 'John Doe',
      phone: '(555) 123-4567',
      unit: event.unit,
      building: event.building,
      canReschedule: true,
      canCancel: true,
      estimatedDuration: event.type === 'move-in' || event.type === 'move-out' ? 120 : 60,
      rescheduledCount: 0
    };
  };

  const handleHoldEvent = (event: any) => {
    const enhancedEvent = enhanceEventForReschedule(event);
    setSelectedEventForReschedule(enhancedEvent);
    setShowEventDetail(true);
  };

  const handleEventDetailReschedule = (rescheduleData: any) => {
    setShowEventDetail(false);
    setShowRescheduleFlow(true);
  };

  const handleRescheduleConfirm = (rescheduleData: any) => {
    toast({
      title: "Event Rescheduled",
      description: `${selectedEventForReschedule?.title} has been rescheduled successfully.`,
    });
    setShowRescheduleFlow(false);
    setSelectedEventForReschedule(null);
  };

  const handleEventDetailCancel = () => {
    toast({
      title: "Event Cancelled",
      description: `${selectedEventForReschedule?.title} has been cancelled.`,
    });
    setShowEventDetail(false);
    setSelectedEventForReschedule(null);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'move-in': return <Home size={16} className="text-green-600" />;
      case 'move-out': return <Home size={16} className="text-red-600" />;
      case 'lease': return <Users size={16} className="text-blue-600" />;
      case 'message': return <MessageSquare size={16} className="text-purple-600" />;
      case 'tour': return <Calendar size={16} className="text-orange-600" />;
      case 'payment': return <Target size={16} className="text-red-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getEventPriorityColor = (priority: string, status: string) => {
    if (status === 'urgent') return 'bg-red-100 text-red-800 border-red-200';
    switch (priority) {
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  if (showRescheduleFlow && selectedEventForReschedule) {
    return (
      <RescheduleFlow
        event={selectedEventForReschedule}
        onClose={() => {
          setShowRescheduleFlow(false);
          setSelectedEventForReschedule(null);
        }}
        onConfirm={handleRescheduleConfirm}
        userRole="operator"
      />
    );
  }

  if (showEventDetail && selectedEventForReschedule) {
    return (
      <EventDetailModal
        event={selectedEventForReschedule}
        onClose={() => {
          setShowEventDetail(false);
          setSelectedEventForReschedule(null);
        }}
        onReschedule={handleEventDetailReschedule}
        onCancel={handleEventDetailCancel}
        userRole="operator"
      />
    );
  }

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

  // Use real data for overview
  const overview = [
    {
      title: 'Total Units',
      count: totalUnits.toString(),
      status: 'total',
      module: 'pricing',
      filter: 'all' as const
    },
    {
      title: 'Current Residents',
      count: currentOccupied.toString(),
      status: 'occupied'
    },
    {
      title: 'Maintenance',
      count: 7, // This would come from work orders system
      status: 'pending',
      module: 'maintenance'
    },
    {
      title: 'Renewals',
      count: renewalsPending,
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

      {/* Active Notices - Using standardized name utility */}
      {noticeResidents.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={24} />
            ACTIVE NOTICES TO VACATE ({noticeResidents.length})
          </h2>
          <div className="space-y-3">
            {noticeResidents.map((resident) => (
              <div key={resident.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{getFullName(resident.firstName, resident.lastName)}</h3>
                  <p className="text-sm text-gray-600">Unit {resident.unitNumber}</p>
                  <p className="text-xs text-orange-600">
                    Move-out: {resident.moveOutDate ? new Date(resident.moveOutDate).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <CancelNoticeButton 
                    residentId={resident.id} 
                    residentName={getFullName(resident.firstName, resident.lastName)}
                    variant="outline"
                    size="sm"
                  />
                  <CancelMoveOutButton 
                    residentId={resident.id} 
                    residentName={getFullName(resident.firstName, resident.lastName)}
                    variant="destructive"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Live Activity Feed / Daily Calendar Toggle */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {showCalendarView ? (
              <>
                <CalendarDays className="text-blue-600" size={24} />
                TODAY'S SCHEDULE
              </>
            ) : (
              <>
                <TrendingUp className="text-purple-600" size={24} />
                LIVE FEED
              </>
            )}
          </h2>
          
          <button
            onClick={() => setShowCalendarView(!showCalendarView)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {showCalendarView ? (
              <>
                <Activity size={14} />
                <span className="text-xs">Feed</span>
              </>
            ) : (
              <>
                <CalendarDays size={14} />
                <span className="text-xs">Calendar</span>
              </>
            )}
          </button>
        </div>

        {showCalendarView ? (
          /* Daily Calendar View with Hold-to-Reschedule */
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-gray-500">{dailyEvents.length} events scheduled</p>
            </div>
            
            {dailyEvents.map((event) => (
              <SwipeCard
                key={event.id}
                onTap={() => toast({ title: "Event Details", description: `Viewing ${event.title}` })}
                onHold={() => handleHoldEvent(event)}
              >
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-sm font-medium text-gray-900">{event.time}</div>
                  </div>
                  
                  <div className="flex-shrink-0 mt-1">
                    {getEventTypeIcon(event.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <Badge className={getEventPriorityColor(event.priority, event.status)}>
                        {event.status === 'urgent' ? 'URGENT' : event.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {event.type.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500 capitalize">{event.status}</span>
                    </div>
                  </div>
                </div>
              </SwipeCard>
            ))}
          </div>
        ) : (
          /* Live Activity Feed */
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
        )}
      </div>
    </div>
  );
};

export default OperatorTodayTab;
