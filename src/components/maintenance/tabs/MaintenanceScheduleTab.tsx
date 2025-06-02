
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitTurnTracker from '../UnitTurnTracker';
import WorkOrderTracker from '../WorkOrderTracker';
import { Calendar, Home, Wrench, BarChart3 } from 'lucide-react';

const MaintenanceScheduleTab = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
        <TabsList className="grid w-full grid-cols-3">
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
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <WorkOrderTracker />
            <UnitTurnTracker />
          </div>
        </TabsContent>

        <TabsContent value="workorders">
          <WorkOrderTracker />
        </TabsContent>

        <TabsContent value="unitturns">
          <UnitTurnTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceScheduleTab;
