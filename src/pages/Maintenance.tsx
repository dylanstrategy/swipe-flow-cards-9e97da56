
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaintenanceScheduleTab from '@/components/maintenance/tabs/MaintenanceScheduleTab';
import MaintenanceTodayTab from '@/components/maintenance/tabs/MaintenanceTodayTab';
import MaintenanceInventoryTab from '@/components/maintenance/tabs/MaintenanceInventoryTab';
import MaintenanceVendorsTab from '@/components/maintenance/tabs/MaintenanceVendorsTab';
import { Calendar, Home, Wrench, Package, Users } from 'lucide-react';

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [sharedTodayWorkOrders, setSharedTodayWorkOrders] = useState<any[]>([]);

  const handleTodayWorkOrdersChange = (workOrders: any[]) => {
    console.log('Parent - Updating shared today work orders:', workOrders);
    setSharedTodayWorkOrders(workOrders);
  };

  return (
    <div className="h-screen flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Vendors
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="today" className="h-full">
            <MaintenanceTodayTab todayWorkOrders={sharedTodayWorkOrders} />
          </TabsContent>
          
          <TabsContent value="schedule" className="h-full">
            <MaintenanceScheduleTab 
              onTodayWorkOrdersChange={handleTodayWorkOrdersChange}
              todayWorkOrders={sharedTodayWorkOrders}
            />
          </TabsContent>
          
          <TabsContent value="inventory" className="h-full">
            <MaintenanceInventoryTab />
          </TabsContent>
          
          <TabsContent value="vendors" className="h-full">
            <MaintenanceVendorsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Maintenance;
