
import React, { useState } from 'react';
import { Clock, MapPin, AlertTriangle, Check, Home, MessageSquare, Users, Calendar, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import SwipeCard from '@/components/SwipeCard';
import { useRealtimeOverdueDetection } from '@/hooks/useRealtimeOverdueDetection';

const OperatorTodayTab = () => {
  const { toast } = useToast();

  const [todayEvents] = useState([
    {
      id: 1,
      date: new Date(), // Add date property for today
      time: '09:00',
      title: 'Move-in Inspection',
      description: 'Unit 204A - Sarah Johnson',
      type: 'inspection',
      priority: 'high',
      status: 'pending',
      building: 'Building A',
      unit: '204A',
      category: 'Community Management'
    },
    {
      id: 2,
      date: new Date(), // Add date property for today
      time: '10:30',
      title: 'Lease Signing',
      description: 'Michael Chen - Unit 156B renewal',
      type: 'lease',
      priority: 'medium',
      status: 'pending',
      building: 'Building B',
      unit: '156B',
      category: 'Leasing'
    },
    {
      id: 3,
      date: new Date(), // Add date property for today
      time: '11:45',
      title: 'Delinquency Follow-up',
      description: 'Payment plan discussion - Unit 108',
      type: 'meeting',
      priority: 'high',
      status: 'pending',
      building: 'Building A',
      unit: '108',
      category: 'Collections'
    },
    {
      id: 4,
      date: new Date(), // Add date property for today
      time: '14:00',
      title: 'Maintenance Coordination',
      description: 'HVAC repair scheduling for Units 301-305',
      type: 'maintenance',
      priority: 'medium',
      status: 'pending',
      building: 'Building C',
      unit: '301-305',
      category: 'Property Services'
    },
    {
      id: 5,
      date: new Date(), // Add date property for today
      time: '15:30',
      title: 'Prospect Tour',
      description: 'Jennifer Adams - 1BR apartment viewing',
      type: 'tour',
      priority: 'medium',
      status: 'pending',
      building: 'Building B',
      unit: 'Multiple',
      category: 'Leasing'
    },
    {
      id: 6,
      date: new Date(), // Add date property for today
      time: '16:45',
      title: 'Renewal Discussion',
      description: 'Thompson Family - Lease renewal negotiation',
      type: 'meeting',
      priority: 'high',
      status: 'pending',
      building: 'Building A',
      unit: '405',
      category: 'Renewals'
    }
  ]);

  // Use real-time overdue detection
  const { isEventOverdue } = useRealtimeOverdueDetection(todayEvents);

  const handleAction = (action: string, event: any) => {
    toast({
      title: `${action}`,
      description: `${event.title} - ${action.toLowerCase()} successfully`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <Home size={16} className="text-blue-600" />;
      case 'lease': return <Users size={16} className="text-green-600" />;
      case 'maintenance': return <Wrench size={16} className="text-orange-600" />;
      case 'meeting': return <Calendar size={16} className="text-purple-600" />;
      case 'tour': return <MapPin size={16} className="text-indigo-600" />;
      case 'message': return <MessageSquare size={16} className="text-gray-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyClass = (event: any) => {
    const isOverdue = isEventOverdue(event);
    
    if (isOverdue) {
      return 'wiggle-urgent pulse-urgent';
    }
    
    if (event.priority === 'high') {
      return 'wiggle-urgent';
    }
    
    return '';
  };

  const getEventCardClass = (event: any) => {
    const isOverdue = isEventOverdue(event);
    const baseClass = 'flex items-center justify-between p-4 rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors';
    
    if (isOverdue) {
      return `${baseClass} bg-red-50 border-red-200 wiggle-urgent pulse-urgent`;
    }
    
    return `${baseClass} bg-white`;
  };

  const getSwipeActionsForEvent = (event: any) => {
    return {
      onSwipeRight: {
        label: "Complete",
        action: () => handleAction("Completed", event),
        color: "#10B981",
        icon: "✅"
      },
      onSwipeLeft: {
        label: "Reschedule",
        action: () => handleAction("Rescheduled", event),
        color: "#F59E0B",
        icon: "📅"
      }
    };
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          {format(new Date(), 'd')}
        </h1>
        <p className="text-lg text-gray-900 font-medium">
          {format(new Date(), 'EEEE, MMMM yyyy')}
        </p>
        <p className="text-blue-600 text-sm font-medium">
          {todayEvents.length} events scheduled
        </p>
      </div>

      {/* Today's Events */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        
        <div className="space-y-3">
          {todayEvents.map((event) => {
            const swipeActions = getSwipeActionsForEvent(event);
            const isOverdue = isEventOverdue(event);
            
            return (
              <SwipeCard
                key={event.id}
                onSwipeRight={swipeActions.onSwipeRight}
                onSwipeLeft={swipeActions.onSwipeLeft}
                onTap={() => handleAction("Viewed", event)}
              >
                <div className={getEventCardClass(event)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <h3 className={`font-medium ${isOverdue ? 'text-red-800' : 'text-gray-900'}`}>
                        {event.title}
                      </h3>
                      <p className={`text-sm ${isOverdue ? 'text-red-700' : 'text-gray-600'}`}>
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={14} className={isOverdue ? 'text-red-500' : 'text-gray-400'} />
                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          {formatTime(event.time)}
                        </span>
                        <span className={`text-sm ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>•</span>
                        <span className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                          {event.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={isOverdue ? 'bg-red-200 text-red-800' : getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                    {isOverdue && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle size={12} className="mr-1" />
                        <span className="text-xs font-medium">Overdue</span>
                      </div>
                    )}
                  </div>
                </div>
              </SwipeCard>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <Check className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{todayEvents.length}</p>
            </div>
            <Clock className="text-orange-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorTodayTab;
