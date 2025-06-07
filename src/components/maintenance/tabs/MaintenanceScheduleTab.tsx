
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitTurnTracker from '../UnitTurnTracker';
import WorkOrderTracker from '../WorkOrderTracker';
import UnitTurnDetailTracker from '../UnitTurnDetailTracker';
import WorkOrderDetailTracker from '../WorkOrderDetailTracker';
import WorkOrderFlow from '../WorkOrderFlow';
import WorkOrderQueue from '../WorkOrderQueue';
import ScheduleDropZone from '../ScheduleDropZone';
import DragDropProvider from '../DragDropProvider';
import { Calendar, Home, Wrench, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock work orders data - this would normally come from a state management solution or API
const initialWorkOrders = [
  {
    id: 'WO-544857',
    unit: '417',
    title: 'Dripping water faucet',
    description: 'Bathroom faucet dripping intermittently',
    category: 'Plumbing',
    priority: 'medium',
    status: 'unscheduled',
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
    priority: 'high',
    status: 'unscheduled',
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
    priority: 'urgent',
    status: 'overdue',
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
    priority: 'low',
    status: 'scheduled',
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

const MaintenanceScheduleTab = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [showWorkOrderFlow, setShowWorkOrderFlow] = useState(false);
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [scheduledWorkOrders, setScheduledWorkOrders] = useState<any[]>([]);

  const handleScheduleWorkOrder = (workOrder: any, scheduledTime: string) => {
    console.log('Scheduling work order:', workOrder, 'for time:', scheduledTime);
    
    // Update the work order with scheduled information
    const updatedWorkOrder = {
      ...workOrder,
      status: 'scheduled',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: scheduledTime.includes('Tomorrow') ? '09:00 AM' : scheduledTime
    };

    // Remove from work orders queue
    setWorkOrders(prev => prev.filter(wo => wo.id !== workOrder.id));
    
    // Add to scheduled work orders for today view
    setScheduledWorkOrders(prev => [...prev, updatedWorkOrder]);
    
    toast({
      title: "Work Order Scheduled",
      description: `${workOrder.title} has been scheduled for ${scheduledTime.includes('Tomorrow') ? 'tomorrow at 9:00 AM' : `today at ${scheduledTime}`}`,
    });
  };

  if (showWorkOrderFlow) {
    return (
      <WorkOrderFlow
        workOrder={selectedWorkOrder}
        onClose={() => {
          setShowWorkOrderFlow(false);
          setSelectedWorkOrder(null);
        }}
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
      <WorkOrderDetailTracker 
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
    // Don't set showWorkOrderFlow to true, just show the detail tracker
  };

  return (
    <DragDropProvider>
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              Maintenance Dashboard
            </h1>
            <p className="text-gray-600">Track work orders, unit turns, and maintenance operations</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="queue" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Queue
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="unitturns" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Unit Turns
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'queue' && (
            <div className="h-full">
              <WorkOrderQueue 
                workOrders={workOrders}
                onSelectWorkOrder={handleWorkOrderDetailsView} 
              />
              <ScheduleDropZone onScheduleWorkOrder={handleScheduleWorkOrder} />
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="h-full overflow-y-auto pb-32">
              <div className="px-4 space-y-6">
                <WorkOrderTracker 
                  onSelectWorkOrder={handleWorkOrderSelect}
                  onViewDetails={handleWorkOrderDetailsView}
                />
                <UnitTurnTracker onSelectUnitTurn={setSelectedUnitTurn} />
                
                {/* Today's Scheduled Work Orders */}
                {scheduledWorkOrders.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Scheduled Work Orders</h3>
                    <div className="space-y-3">
                      {scheduledWorkOrders.map((workOrder) => (
                        <div key={workOrder.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img 
                                src={workOrder.photo} 
                                alt="Issue"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                Unit {workOrder.unit} - {workOrder.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-1">{workOrder.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Scheduled: {workOrder.scheduledTime}</span>
                                <span>Assigned: {workOrder.assignedTo}</span>
                                <span>Est: {workOrder.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'unitturns' && (
            <div className="h-full">
              <UnitTurnTracker onSelectUnitTurn={setSelectedUnitTurn} />
              <ScheduleDropZone onScheduleWorkOrder={handleScheduleWorkOrder} />
            </div>
          )}
        </div>
      </div>
    </DragDropProvider>
  );
};

export default MaintenanceScheduleTab;
