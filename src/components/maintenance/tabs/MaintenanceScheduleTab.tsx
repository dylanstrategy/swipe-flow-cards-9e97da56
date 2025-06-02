
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitTurnTracker from '../UnitTurnTracker';
import WorkOrderTracker from '../WorkOrderTracker';
import UnitTurnDetailTracker from '../UnitTurnDetailTracker';
import WorkOrderDetailTracker from '../WorkOrderDetailTracker';
import WorkOrderFlow from '../WorkOrderFlow';
import MaintenanceInventoryTab from './MaintenanceInventoryTab';
import { Calendar, Home, Wrench, BarChart3, Package } from 'lucide-react';

const MaintenanceScheduleTab = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [showWorkOrderFlow, setShowWorkOrderFlow] = useState(false);

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
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          Maintenance Dashboard
        </h1>
        <p className="text-gray-600">Track work orders, unit turns, and maintenance operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="workorders" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Work Orders
          </TabsTrigger>
          <TabsTrigger value="unitturns" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Unit Turns
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <WorkOrderTracker 
              onSelectWorkOrder={handleWorkOrderSelect}
              onViewDetails={handleWorkOrderDetailsView}
            />
            <UnitTurnTracker onSelectUnitTurn={setSelectedUnitTurn} />
          </div>
        </TabsContent>

        <TabsContent value="workorders">
          <WorkOrderTracker 
            onSelectWorkOrder={handleWorkOrderSelect}
            onViewDetails={handleWorkOrderDetailsView}
          />
        </TabsContent>

        <TabsContent value="unitturns">
          <UnitTurnTracker onSelectUnitTurn={setSelectedUnitTurn} />
        </TabsContent>

        <TabsContent value="inventory">
          <MaintenanceInventoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceScheduleTab;
