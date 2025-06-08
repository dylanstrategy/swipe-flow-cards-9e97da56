import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SwipeCard from '@/components/SwipeCard';
import WorkOrderFlow from '@/components/maintenance/WorkOrderFlow';
import UnitTurnDetailTracker from '@/components/maintenance/UnitTurnDetailTracker';
import HourlyCalendarView from '@/components/schedule/HourlyCalendarView';
import { format } from 'date-fns';
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

  const today = new Date();

  // Use shared event service for unified data
  useEffect(() => {
    const updateEvents = () => {
      // Use unified method for today's events - ensures sync with ScheduleTab
      const maintenanceEvents = sharedEventService.getEventsForRoleAndDate('maintenance', today);
      console.log('MaintenanceTodayTab - unified maintenance events:', maintenanceEvents.length);
      setCalendarEvents(maintenanceEvents);
    };

    // Initial load
    updateEvents();

    // Subscribe to changes
    const unsubscribe = sharedEventService.subscribe(updateEvents);
    return unsubscribe;
  }, []); // Remove today dependency since we always want today

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

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event);
    if (event.category === 'work-order' || event.type === 'work-order') {
      setSelectedWorkOrder(event);
    } else if (event.category === 'unit-turn') {
      setSelectedUnitTurn(event);
    }
  };

  const handleEventHold = (event: any) => {
    console.log('Event held:', event);
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    console.log('Event rescheduled:', event, 'to', newTime);
    
    // Use shared service to reschedule
    const success = sharedEventService.rescheduleEvent(event.id, event.date, newTime);
    
    if (success) {
      toast({
        title: "Event Rescheduled",
        description: `${event.title} moved to ${newTime}`,
      });
    }
  };

  const handleWorkOrderCompleted = (workOrderId: string) => {
    console.log('Work order completed in Today tab:', workOrderId);
    
    if (onWorkOrderCompleted) {
      onWorkOrderCompleted(workOrderId);
    }
    
    toast({
      title: "Work Order Completed",
      description: "The work order has been completed and removed from your schedule.",
    });
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
              <div className="text-2xl font-bold text-orange-600">{calendarEvents.length}</div>
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
        <HourlyCalendarView
          selectedDate={today}
          events={calendarEvents}
          onEventClick={handleEventClick}
          onEventHold={handleEventHold}
          onEventReschedule={handleEventReschedule}
        />
      </div>
    </div>
  );
};

export default MaintenanceTodayTab;
