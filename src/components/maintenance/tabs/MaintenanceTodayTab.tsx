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
    console.log('MaintenanceTodayTab - Setting up shared event subscription');
    
    // Subscribe to shared event service for real-time updates
    const unsubscribe = sharedEventService.subscribe(() => {
      console.log('MaintenanceTodayTab - Received shared event update, refreshing events');
      const updatedMaintenanceEvents = sharedEventService.getEventsForRole('maintenance');
      console.log('MaintenanceTodayTab - Updated maintenance events:', updatedMaintenanceEvents);
      
      const events = [
        // Add maintenance events from shared data (work orders scheduled via drag and drop)
        ...updatedMaintenanceEvents.map(event => {
          console.log('🏗️ Converting shared maintenance event to calendar event:', {
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            isToday: event.date instanceof Date ? 
              event.date.toDateString() === new Date().toDateString() : 
              new Date(event.date).toDateString() === new Date().toDateString()
          });
          return {
            id: event.id,
            date: event.date instanceof Date ? event.date : new Date(event.date),
            time: event.time,
            title: event.title,
            description: event.description,
            category: event.type,
            priority: event.priority,
            status: event.status,
            workOrderData: event.type === 'work-order' ? event : null,
            canReschedule: true,
            canCancel: false,
            estimatedDuration: event.metadata?.estimatedDuration || 120,
            rescheduledCount: event.rescheduledCount || 0,
            building: event.metadata?.building || '',
            unit: event.metadata?.unit || '',
            residentName: event.assignedUsers?.find(u => u.role === 'resident')?.name || '',
            tasks: event.tasks || [],
            taskCompletionStamps: event.taskCompletionStamps || []
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
          status: 'scheduled',
          unitTurnData: unitTurn,
          canReschedule: true,
          canCancel: false,
          estimatedDuration: 240,
          rescheduledCount: 0
        }))
      ];
      
      setCalendarEvents([...events]); // Force re-render with new array reference
      console.log('MaintenanceTodayTab - Calendar events updated:', events);
    });

    // Initial load
    const initialMaintenanceEvents = sharedEventService.getEventsForRole('maintenance');
    console.log('MaintenanceTodayTab - Initial maintenance events:', initialMaintenanceEvents);
    
    const initialEvents = [
      // Add maintenance events from shared data
      ...initialMaintenanceEvents.map(event => {
        console.log('Converting initial maintenance event to calendar event:', event);
        return {
          id: event.id,
          date: event.date instanceof Date ? event.date : new Date(event.date),
          time: event.time,
          title: event.title,
          description: event.description,
          category: event.type,
          priority: event.priority,
          status: event.status,
          workOrderData: event.type === 'work-order' ? event : null,
          canReschedule: true,
          canCancel: false,
          estimatedDuration: event.metadata?.estimatedDuration || 120,
          rescheduledCount: event.rescheduledCount || 0,
          building: event.metadata?.building || '',
          unit: event.metadata?.unit || '',
          residentName: event.assignedUsers?.find(u => u.role === 'resident')?.name || '',
          tasks: event.tasks || [],
          taskCompletionStamps: event.taskCompletionStamps || []
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
        status: 'scheduled',
        unitTurnData: unitTurn,
        canReschedule: true,
        canCancel: false,
        estimatedDuration: 240,
        rescheduledCount: 0
      }))
    ];
    
    setCalendarEvents([...initialEvents]); // Force re-render with new array reference
    console.log('MaintenanceTodayTab - Initial calendar events set:', initialEvents);

    // Cleanup subscription
    return () => {
      console.log('MaintenanceTodayTab - Cleaning up shared event subscription');
      unsubscribe();
    };
  }, []); // Only run once on mount

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
    console.log('MaintenanceTodayTab - Event rescheduled:', event, 'to', newTime);
    
    // If it's a shared work order event, update it in the shared service
    if (event.workOrderData && event.workOrderData.id) {
      const success = sharedEventService.rescheduleEvent(event.id, selectedDate, newTime);
      if (success) {
        console.log('MaintenanceTodayTab - Successfully rescheduled shared event');
        // The subscription will automatically update our calendar events
      } else {
        console.error('MaintenanceTodayTab - Failed to reschedule shared event');
      }
    } else {
      // For non-shared events (like unit turns), update locally
      setCalendarEvents(prev => prev.map(e => 
        e.id === event.id 
          ? { ...e, time: newTime, rescheduledCount: (e.rescheduledCount || 0) + 1 }
          : e
      ));
    }
    
    toast({
      title: "Event Rescheduled",
      description: `${event.title} moved to ${newTime}`,
    });
  };

  const handleWorkOrderCompleted = (workOrderId: string) => {
    console.log('MaintenanceTodayTab - Work order completed:', workOrderId);
    
    // Find the event in calendar
    const event = calendarEvents.find(e => e.workOrderData?.id === workOrderId || e.id === workOrderId);
    
    if (event && event.workOrderData) {
      // If it's a shared work order, remove from shared service
      const success = sharedEventService.removeEvent(event.id);
      if (success) {
        console.log('MaintenanceTodayTab - Successfully removed shared event');
        // The subscription will automatically update our calendar events
      } else {
        console.error('MaintenanceTodayTab - Failed to remove shared event');
      }
    } else {
      // For non-shared events, remove locally
      setCalendarEvents(prev => prev.filter(e => e.workOrderData?.id !== workOrderId && e.id !== workOrderId));
    }
    
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
          
          {/* Debug info */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <div>Total calendar events: {calendarEvents.length}</div>
            <div>Events for today: {calendarEvents.filter(e => {
              const eventDate = e.date instanceof Date ? e.date : new Date(e.date);
              const today = new Date();
              return eventDate.toDateString() === today.toDateString();
            }).length}</div>
            {calendarEvents.map(e => (
              <div key={e.id}>
                {e.title} - {e.unit} - {(e.date instanceof Date ? e.date : new Date(e.date)).toDateString()} at {e.time}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTodayTab;
