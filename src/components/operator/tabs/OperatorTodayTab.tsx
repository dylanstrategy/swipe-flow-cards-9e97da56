
import React, { useState } from 'react';
import { useResident } from '@/contexts/ResidentContext';
import WorkOrdersReview from '@/components/tabs/today/WorkOrdersReview';
import WorkOrderTimeline from '@/components/maintenance/WorkOrderTimeline';
import TodayHeader from '@/components/operator/today/TodayHeader';
import PropertyOverviewCard from '@/components/operator/today/PropertyOverviewCard';
import MovementTrackingCard from '@/components/operator/today/MovementTrackingCard';
import QuickActionsCard from '@/components/operator/today/QuickActionsCard';
import WorkOrdersTrendCard from '@/components/operator/today/WorkOrdersTrendCard';

interface OperatorTodayTabProps {
  onTabChange?: (tab: string) => void;
}

const OperatorTodayTab = ({ onTabChange }: OperatorTodayTabProps) => {
  const { getCurrentResidents, getNoticeResidents, getOccupancyRate } = useResident();
  const [showWorkOrders, setShowWorkOrders] = useState(false);
  const [showWorkOrderTimeline, setShowWorkOrderTimeline] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const currentResidents = getCurrentResidents();
  const noticeResidents = getNoticeResidents();
  const occupancyRate = getOccupancyRate();

  const propertyStats = {
    totalUnits: 100,
    currentResidents: currentResidents.length,
    maintenancePending: 7,
    renewalsDueSoon: 24
  };

  const handleResidentsClick = () => {
    onTabChange?.('residents');
  };

  const handleMaintenanceClick = () => {
    setShowWorkOrders(true);
  };

  const handleWorkOrderClick = (workOrder: any) => {
    console.log('Opening work order timeline:', workOrder);
    setSelectedWorkOrder(workOrder);
    setShowWorkOrderTimeline(true);
  };

  if (showWorkOrderTimeline && selectedWorkOrder) {
    return (
      <WorkOrderTimeline
        workOrder={selectedWorkOrder}
        onClose={() => {
          setShowWorkOrderTimeline(false);
          setSelectedWorkOrder(null);
        }}
      />
    );
  }

  if (showWorkOrders) {
    return (
      <WorkOrdersReview
        onCreateWorkOrder={() => {}}
        onClose={() => setShowWorkOrders(false)}
        onWorkOrderClick={handleWorkOrderClick}
      />
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <TodayHeader />
      
      <PropertyOverviewCard
        totalUnits={propertyStats.totalUnits}
        currentResidents={propertyStats.currentResidents}
        maintenancePending={propertyStats.maintenancePending}
        renewalsDueSoon={propertyStats.renewalsDueSoon}
        onResidentsClick={handleResidentsClick}
        onMaintenanceClick={handleMaintenanceClick}
      />

      <MovementTrackingCard occupancyRate={occupancyRate} />

      <QuickActionsCard />

      <WorkOrdersTrendCard />
    </div>
  );
};

export default OperatorTodayTab;
