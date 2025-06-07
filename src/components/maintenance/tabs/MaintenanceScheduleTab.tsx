
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

const MaintenanceScheduleTab = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [showWorkOrderFlow, setShowWorkOrderFlow] = useState(false);

  const handleScheduleWorkOrder = (workOrder: any, scheduledTime: string) => {
    console.log('Scheduling work order:', workOrder, 'for time:', scheduledTime);
    
    // In a real app, this would update the backend
    // For now, we'll just show a success message
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
        <div className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              Maintenance Dashboard
            </h1>
            <p className="text-gray-600">Track work orders, unit turns, and maintenance operations</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
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

            <div className="flex-1 relative">
              <TabsContent value="queue" className="h-full mt-6">
                <WorkOrderQueue onSelectWorkOrder={handleWorkOrderDetailsView} />
                <ScheduleDropZone onScheduleWorkOrder={handleScheduleWorkOrder} />
              </TabsContent>

              <TabsContent value="overview" className="h-full mt-6">
                <div className="h-full overflow-y-auto pb-32">
                  <div className="px-4 space-y-6">
                    <WorkOrderTracker 
                      onSelectWorkOrder={handleWorkOrderSelect}
                      onViewDetails={handleWorkOrderDetailsView}
                    />
                    <UnitTurnTracker onSelectUnitTurn={setSelectedUnitTurn} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="unitturns" className="h-full mt-6">
                <DragDropProvider>
                  <div className="h-full relative">
                    <UnitTurnTracker onSelectUnitTurn={setSelectedUnitTurn} />
                    <ScheduleDropZone onScheduleWorkOrder={handleScheduleWorkOrder} />
                  </div>
                </DragDropProvider>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DragDropProvider>
  );
};

export default MaintenanceScheduleTab;
