import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitTurnTracker from '../UnitTurnTracker';
import WorkOrderTracker from '../WorkOrderTracker';
import UnitTurnDetailTracker from '../UnitTurnDetailTracker';
import WorkOrderTimeline from '../WorkOrderTimeline';
import WorkOrderFlow from '../WorkOrderFlow';
import WorkOrderQueue from '../WorkOrderQueue';
import ScheduleDropZone from '../ScheduleDropZone';
import DragDropProvider from '../DragDropProvider';
import { Calendar, Home, Wrench, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock work orders data - this would normally come from a state management solution or API
const initialWorkOrders = [
  {
    id: 'WO-544857',
    unit: '417',
    title: 'Dripping water faucet',
    description: 'Bathroom faucet dripping intermittently',
    category: 'Plumbing',
    priority: 'medium' as const,
    status: 'unscheduled' as const,
    assignedTo: 'Mike Rodriguez',
    resident: 'Rumi Desai',
    phone: '(555) 123-4567',
    daysOpen: 3,
    estimatedTime: '2 hours',
    submittedDate: '2025-05-22',
    photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400'
  },
  {
    id: 'WO-548686',
    unit: '516',
    title: 'Window won\'t close properly',
    description: 'The balancer got stuck and window won\'t close',
    category: 'Windows',
    priority: 'high' as const,
    status: 'unscheduled' as const,
    assignedTo: 'Sarah Johnson',
    resident: 'Kalyani Dronamraju',
    phone: '(555) 345-6789',
    daysOpen: 5,
    estimatedTime: '3 hours',
    submittedDate: '2025-05-14',
    photo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  },
  {
    id: 'WO-549321',
    unit: '204',
    title: 'HVAC not cooling properly',
    description: 'Air conditioning unit not providing adequate cooling',
    category: 'HVAC',
    priority: 'urgent' as const,
    status: 'overdue' as const,
    assignedTo: 'James Wilson',
    resident: 'Alex Thompson',
    phone: '(555) 456-7890',
    daysOpen: 12,
    estimatedTime: '4 hours',
    submittedDate: '2025-05-01',
    photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'
  },
  {
    id: 'WO-545123',
    unit: '302',
    title: 'Scheduled Inspection',
    description: 'Annual HVAC maintenance check',
    category: 'Maintenance',
    priority: 'low' as const,
    status: 'scheduled' as const,
    assignedTo: 'Mike Rodriguez',
    resident: 'Jane Smith',
    phone: '(555) 789-0123',
    daysOpen: 1,
    estimatedTime: '1 hour',
    submittedDate: '2025-06-06',
    scheduledDate: '2025-06-10',
    scheduledTime: '10:00 AM',
    photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'
  }
];

// Context for sharing work orders between tabs
interface MaintenanceContextType {
  todayWorkOrders: any[];
  addTodayWorkOrder: (workOrder: any) => void;
}

// Simple context provider for this component
const MaintenanceContext = React.createContext<MaintenanceContextType>({
  todayWorkOrders: [],
  addTodayWorkOrder: () => {}
});

interface MaintenanceScheduleTabProps {
  onTodayWorkOrdersChange?: (workOrders: any[]) => void;
  todayWorkOrders?: any[];
  onWorkOrderCompleted?: (workOrderId: string) => void;
}

const MaintenanceScheduleTab = ({ 
  onTodayWorkOrdersChange, 
  todayWorkOrders: externalTodayWorkOrders,
  onWorkOrderCompleted 
}: MaintenanceScheduleTabProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [showWorkOrderFlow, setShowWorkOrderFlow] = useState(false);
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [scheduledWorkOrders, setScheduledWorkOrders] = useState<any[]>([]);
  const [internalTodayWorkOrders, setInternalTodayWorkOrders] = useState<any[]>([]);

  // Use external state if provided, otherwise use internal state
  const todayWorkOrders = externalTodayWorkOrders || internalTodayWorkOrders;

  // Helper function to update today's work orders
  const updateTodayWorkOrders = (newWorkOrders: any[]) => {
    console.log('Updating today work orders with:', newWorkOrders);
    if (onTodayWorkOrdersChange) {
      onTodayWorkOrdersChange(newWorkOrders);
    } else {
      setInternalTodayWorkOrders(newWorkOrders);
    }
  };

  const handleWorkOrderCompleted = (workOrderId: string) => {
    console.log('Schedule tab - Work order completed:', workOrderId);
    
    // Remove from scheduled work orders
    setScheduledWorkOrders(prev => prev.filter(wo => wo.id !== workOrderId));
    
    // Remove from today's work orders
    const updatedTodayWorkOrders = todayWorkOrders.filter(wo => wo.id !== workOrderId);
    updateTodayWorkOrders(updatedTodayWorkOrders);
    
    // Notify parent component
    if (onWorkOrderCompleted) {
      onWorkOrderCompleted(workOrderId);
    }
    
    toast({
      title: "Work Order Completed",
      description: "The work order has been completed and removed from the schedule.",
    });
  };

  // Helper function to find first available time slot
  const findFirstAvailableTimeSlot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // If it's before 9 AM, start at 9 AM
    if (currentHour < 9) {
      return '09:00';
    }
    
    // If it's after 5 PM, schedule for tomorrow 9 AM
    if (currentHour >= 17) {
      return 'Tomorrow 09:00';
    }
    
    // Find next available hour slot (round up to next hour)
    let nextHour = currentMinute > 0 ? currentHour + 1 : currentHour;
    
    // Check for conflicts with existing scheduled work orders
    const timeSlot = `${nextHour.toString().padStart(2, '0')}:00`;
    const hasConflict = todayWorkOrders.some(wo => wo.scheduledTime === timeSlot);
    
    if (hasConflict) {
      // Try next hour
      nextHour += 1;
      if (nextHour >= 17) {
        return 'Tomorrow 09:00';
      }
      return `${nextHour.toString().padStart(2, '0')}:00`;
    }
    
    return timeSlot;
  };

  const handleScheduleWorkOrder = (workOrder: any, scheduledTime: string) => {
    console.log('Scheduling work order:', workOrder, 'for time:', scheduledTime);
    
    const isToday = scheduledTime.includes('Today') || !scheduledTime.includes('Tomorrow');
    const today = new Date().toISOString().split('T')[0];
    
    // If scheduling for today, find first available time slot
    const finalScheduledTime = isToday ? findFirstAvailableTimeSlot() : scheduledTime;
    
    // Update the work order with scheduled information
    const updatedWorkOrder = {
      ...workOrder,
      status: 'scheduled',
      scheduledDate: isToday ? today : new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: finalScheduledTime.includes('Tomorrow') ? '09:00' : finalScheduledTime.replace('Tomorrow ', '')
    };

    // Remove from work orders queue
    setWorkOrders(prev => prev.filter(wo => wo.id !== workOrder.id));
    
    // Add to scheduled work orders
    setScheduledWorkOrders(prev => [...prev, updatedWorkOrder]);
    
    // If scheduled for today, add to today's work orders for the Today tab
    if (isToday && !finalScheduledTime.includes('Tomorrow')) {
      console.log('Adding to today work orders:', updatedWorkOrder);
      const newTodayWorkOrders = [...todayWorkOrders, updatedWorkOrder];
      updateTodayWorkOrders(newTodayWorkOrders);
    }
    
    toast({
      title: "Work Order Scheduled",
      description: `${workOrder.title} has been scheduled for ${finalScheduledTime.includes('Tomorrow') ? 'tomorrow at 9:00 AM' : `today at ${finalScheduledTime}`}`,
    });
  };

  const addTodayWorkOrder = (workOrder: any) => {
    console.log('Adding work order to today context:', workOrder);
    const newTodayWorkOrders = [...todayWorkOrders, workOrder];
    updateTodayWorkOrders(newTodayWorkOrders);
  };

  const contextValue = {
    todayWorkOrders,
    addTodayWorkOrder
  };

  if (showWorkOrderFlow) {
    return (
      <WorkOrderFlow
        workOrder={selectedWorkOrder}
        onClose={() => {
          setShowWorkOrderFlow(false);
          setSelectedWorkOrder(null);
        }}
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

  if (selectedWorkOrder && !showWorkOrderFlow) {
    return (
      <WorkOrderTimeline 
        workOrder={selectedWorkOrder}
        onClose={() => setSelectedWorkOrder(null)}
      />
    );
  }

  const handleWorkOrderSelect = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    setShowWorkOrderFlow(true);
  };

  const handleWorkOrderDetailsView = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    // Don't set showWorkOrderFlow to true, just show the timeline
  };

  return (
    <MaintenanceContext.Provider value={contextValue}>
      <DragDropProvider>
        <div className="w-full">
          <div className="px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-orange-600" />
                Maintenance Dashboard
              </h1>
              <p className="text-gray-600">Track work orders, unit turns, and maintenance operations</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="queue" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Queue
                </TabsTrigger>
                <TabsTrigger value="unitturns" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Unit Turns
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="w-full">
            {activeTab === 'queue' && (
              <div className="w-full">
                <WorkOrderQueue 
                  workOrders={workOrders}
                  onSelectWorkOrder={handleWorkOrderDetailsView} 
                />
                <ScheduleDropZone onScheduleWorkOrder={handleScheduleWorkOrder} />
              </div>
            )}

            {activeTab === 'unitturns' && (
              <div className="w-full">
                <UnitTurnTracker onSelectUnitTurn={setSelectedUnitTurn} />
                <ScheduleDropZone onScheduleWorkOrder={handleScheduleWorkOrder} />
              </div>
            )}
          </div>
        </div>
      </DragDropProvider>
    </MaintenanceContext.Provider>
  );
};

// Export the context for use in other components
export { MaintenanceContext };
export default MaintenanceScheduleTab;
