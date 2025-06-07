
import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SwipeCard from '@/components/SwipeCard';
import WorkOrderFlow from '@/components/maintenance/WorkOrderFlow';
import UnitTurnDetailTracker from '@/components/maintenance/UnitTurnDetailTracker';
import HourlyCalendarView from '@/components/schedule/HourlyCalendarView';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceTodayTabProps {
  todayWorkOrders?: any[];
  todayUnitTurns?: any[];
  onWorkOrderCompleted?: (workOrderId: string) => void;
}

const MaintenanceTodayTab = ({ 
  todayWorkOrders = [], 
  todayUnitTurns = [],
  onWorkOrderCompleted 
}: MaintenanceTodayTabProps) => {
  const { toast } = useToast();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);

  const today = new Date();

  console.log('MaintenanceTodayTab - received todayWorkOrders:', todayWorkOrders);
  console.log('MaintenanceTodayTab - received todayUnitTurns:', todayUnitTurns);

  // Convert work orders and unit turns to calendar events format
  const calendarEvents = [
    // Add today's scheduled work orders from props
    ...todayWorkOrders.map(workOrder => {
      console.log('Converting work order to calendar event:', workOrder);
      return {
        id: workOrder.id,
        date: today,
        time: workOrder.scheduledTime || '09:00',
        title: `Work Order - Unit ${workOrder.unit}`,
        description: workOrder.title,
        category: 'work-order',
        priority: workOrder.priority,
        workOrderData: workOrder,
        canReschedule: true,
        canCancel: false,
        estimatedDuration: 120,
        rescheduledCount: 0
      };
    }),
    // Add today's scheduled unit turns from props
    ...todayUnitTurns.map(unitTurn => ({
      id: unitTurn.id,
      date: today,
      time: unitTurn.scheduledTime || '10:00',
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

  console.log('Calendar events generated:', calendarEvents);

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

  const handleWorkOrderCompleted = (workOrderId: string) => {
    console.log('Work order completed in Today tab:', workOrderId);
    
    // Notify parent component if callback provided
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
              <div className="text-2xl font-bold text-orange-600">{todayWorkOrders.length}</div>
              <div className="text-sm text-gray-600">Work Orders Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{todayUnitTurns.length}</div>
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
        />
      </div>
    </div>
  );
};

export default MaintenanceTodayTab;
