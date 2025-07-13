import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SwipeCard from '@/components/SwipeCard';
import WorkOrderFlow from '@/components/maintenance/WorkOrderFlow';
import UnitTurnDetailTracker from '@/components/maintenance/UnitTurnDetailTracker';
import HourlyCalendarView from '@/components/schedule/HourlyCalendarView';
import { format, addDays, addWeeks, addMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sharedEventService } from '@/services/sharedEventService';

interface MaintenanceTodayTabProps {
  todayWorkOrders?: any[];
  onWorkOrderCompleted?: (workOrderId: string) => void;
}

const MaintenanceTodayTab = ({ onWorkOrderCompleted }: MaintenanceTodayTabProps) => {
  const { toast } = useToast();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<'day' | '3day' | 'week' | 'month'>('day');

  const today = new Date();

  // Get shared events filtered for maintenance role
  const maintenanceEvents = React.useMemo(() => {
    return sharedEventService.getEventsForRole('maintenance');
  }, []);

  console.log('MaintenanceTodayTab - maintenance events:', maintenanceEvents);

  // Sample unit turns data
  const unitTurns = [
    {
      id: 'UT-323-4',
      unit: '323-4',
      moveOutDate: '2025-06-01',
      moveInDate: '2025-06-15',
      status: 'In Progress',
      completedSteps: ['Punch', 'Upgrades/Repairs', 'Floors'],
      pendingSteps: ['Paint', 'Clean', 'Inspection'],
      daysUntilMoveIn: 13,
      priority: 'medium',
      assignedTo: 'Mike Rodriguez'
    },
    {
      id: 'UT-420-3',
      unit: '420-3',
      moveOutDate: '2025-06-06',
      moveInDate: '2025-06-20',
      status: 'Scheduled',
      completedSteps: [],
      pendingSteps: ['Punch', 'Upgrades/Repairs', 'Floors', 'Paint', 'Clean', 'Inspection'],
      daysUntilMoveIn: 18,
      priority: 'low',
      assignedTo: 'James Wilson'
    }
  ];

  // Convert maintenance events to calendar events format
  React.useEffect(() => {
    const events = [
      // Add maintenance events from shared data
      ...maintenanceEvents.map(event => {
        console.log('Converting maintenance event to calendar event:', event);
        return {
          id: event.id,
          date: today,
          time: event.time,
          title: event.title,
          description: event.description,
          category: event.type,
          priority: event.priority,
          workOrderData: event.type === 'work-order' ? event : null,
          canReschedule: true,
          canCancel: false,
          estimatedDuration: 120,
          rescheduledCount: event.rescheduledCount || 0
        };
      }),
      // Add unit turns scheduled for today
      ...unitTurns.filter(turn => turn.status === 'Scheduled').map(unitTurn => ({
        id: unitTurn.id,
        date: today,
        time: '10:00',
        title: `Unit Turn - ${unitTurn.unit}`,
        description: `${unitTurn.pendingSteps.length} steps remaining`,
        category: 'unit-turn',
        priority: unitTurn.priority,
        unitTurnData: unitTurn,
        canReschedule: true,
        canCancel: false,
        estimatedDuration: 240,
        rescheduledCount: 0
      }))
    ];
    
    setCalendarEvents(events);
    console.log('Maintenance calendar events generated:', events);
  }, [maintenanceEvents]);

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
    if (event.category === 'work-order') {
      setSelectedWorkOrder(event.workOrderData);
    } else if (event.category === 'unit-turn') {
      setSelectedUnitTurn(event.unitTurnData);
    }
  };

  const handleEventHold = (event: any) => {
    // Handle hold/reschedule if needed
    console.log('Event held:', event);
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    console.log('Event rescheduled:', event, 'to', newTime);
    
    // Update the calendar events state
    setCalendarEvents(prev => prev.map(e => 
      e.id === event.id 
        ? { ...e, time: newTime, rescheduledCount: (e.rescheduledCount || 0) + 1 }
        : e
    ));
    
    toast({
      title: "Event Rescheduled",
      description: `${event.title} moved to ${newTime}`,
    });
  };

  const handleWorkOrderCompleted = (workOrderId: string) => {
    console.log('Work order completed in Today tab:', workOrderId);
    
    // Remove from calendar events
    setCalendarEvents(prev => prev.filter(e => e.workOrderData?.id !== workOrderId));
    
    // Notify parent component if callback provided
    if (onWorkOrderCompleted) {
      onWorkOrderCompleted(workOrderId);
    }
    
    toast({
      title: "Work Order Completed",
      description: "The work order has been completed and removed from your schedule.",
    });
  };

  // Navigation functions for calendar views
  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate = new Date(selectedDate);
    
    switch (viewType) {
      case 'day':
      case '3day':
        newDate = addDays(selectedDate, direction === 'next' ? (viewType === 'day' ? 1 : 3) : (viewType === 'day' ? -1 : -3));
        break;
      case 'week':
        newDate = addWeeks(selectedDate, direction === 'next' ? 1 : -1);
        break;
      case 'month':
        newDate = addMonths(selectedDate, direction === 'next' ? 1 : -1);
        break;
    }
    
    setSelectedDate(newDate);
  };

  const getDateRangeText = () => {
    switch (viewType) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case '3day':
        return `${format(selectedDate, 'MMM d')} - ${format(addDays(selectedDate, 2), 'MMM d, yyyy')}`;
      case 'week':
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
    }
  };

  if (selectedWorkOrder) {
    console.log('Showing WorkOrderFlow for:', selectedWorkOrder);
    return (
      <WorkOrderFlow 
        workOrder={selectedWorkOrder}
        onClose={() => setSelectedWorkOrder(null)}
        onWorkOrderCompleted={handleWorkOrderCompleted}
      />
    );
  }

  if (selectedUnitTurn) {
    return (
      <UnitTurnDetailTracker 
        unitTurn={selectedUnitTurn}
        onClose={() => setSelectedUnitTurn(null)}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{maintenanceEvents.length}</div>
              <div className="text-sm text-gray-600">Work Orders Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{unitTurns.filter(ut => ut.status === 'Scheduled').length}</div>
              <div className="text-sm text-gray-600">Unit Turns Today</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar View */}
      <div className="px-4 pb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="text-blue-600" size={24} />
              SCHEDULE
            </h2>
            
            <div className="flex items-center gap-2">
              <Select value={viewType} onValueChange={(value: 'day' | '3day' | 'week' | 'month') => setViewType(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="3day">3 Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{getDateRangeText()}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <HourlyCalendarView
            selectedDate={selectedDate}
            events={calendarEvents}
            onEventClick={handleEventClick}
            onEventHold={handleEventHold}
            onEventReschedule={handleEventReschedule}
            currentUserRole="maintenance"
            viewType={viewType}
          />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTodayTab;
