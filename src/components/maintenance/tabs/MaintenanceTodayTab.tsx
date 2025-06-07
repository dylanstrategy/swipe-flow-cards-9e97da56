
import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SwipeCard from '@/components/SwipeCard';
import WorkOrderFlow from '@/components/maintenance/WorkOrderFlow';
import UnitTurnDetailTracker from '@/components/maintenance/UnitTurnDetailTracker';
import { MaintenanceContext } from './MaintenanceScheduleTab';

const MaintenanceTodayTab = () => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);
  const { todayWorkOrders } = useContext(MaintenanceContext);

  // Sample work orders data (existing ones)
  const existingWorkOrders = [
    {
      id: 'WO-544857',
      unit: '417',
      title: 'Dripping water faucet',
      description: 'Bathroom faucet dripping intermittently',
      category: 'Plumbing',
      priority: 'Medium',
      resident: 'Rumi Desai',
      phone: '(555) 123-4567',
      submitted: '2025-05-22T08:30:00Z',
      photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      status: 'Assigned',
      daysOpen: 3
    },
    {
      id: 'WO-547116',
      unit: '319-2',
      title: 'Towel rack came off wall',
      description: 'The towel rack came off the wall in the bathroom',
      category: 'Fixtures',
      priority: 'Low',
      resident: 'Francisco Giler',
      phone: '(555) 234-5678',
      submitted: '2025-05-09T14:15:00Z',
      photo: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400',
      status: 'In Progress',
      daysOpen: 8
    },
    {
      id: 'WO-548686',
      unit: '516',
      title: 'Window won\'t close properly',
      description: 'The balancer got stuck and window won\'t close',
      category: 'Windows',
      priority: 'High',
      resident: 'Kalyani Dronamraju',
      phone: '(555) 345-6789',
      submitted: '2025-05-14T11:20:00Z',
      photo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      status: 'Scheduled',
      daysOpen: 5
    }
  ];

  // Combine existing work orders with newly scheduled ones for today
  const allTodayWorkOrders = [
    ...existingWorkOrders,
    ...todayWorkOrders.map(wo => ({
      ...wo,
      submitted: wo.submittedDate + 'T08:30:00Z',
      priority: wo.priority.charAt(0).toUpperCase() + wo.priority.slice(1),
      status: 'Scheduled'
    }))
  ];

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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in progress': return 'bg-orange-100 text-orange-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWorkOrderAction = (action: string, workOrder: any) => {
    if (action === 'Open Work Order') {
      setSelectedWorkOrder(workOrder);
    }
  };

  const handleUnitTurnClick = (unitTurn: any) => {
    setSelectedUnitTurn(unitTurn);
  };

  if (selectedWorkOrder) {
    return (
      <WorkOrderFlow 
        workOrder={selectedWorkOrder}
        onClose={() => setSelectedWorkOrder(null)}
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
    <div className="px-4 py-6 pb-24">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{allTodayWorkOrders.length}</div>
            <div className="text-sm text-gray-600">Active Work Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{unitTurns.length}</div>
            <div className="text-sm text-gray-600">Unit Turns</div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Work Orders</h2>
        {allTodayWorkOrders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No work orders scheduled for today
            </CardContent>
          </Card>
        ) : (
          allTodayWorkOrders.map((workOrder) => (
            <SwipeCard
              key={workOrder.id}
              onTap={() => handleWorkOrderAction('Open Work Order', workOrder)}
              onSwipeRight={{
                label: "Start Work",
                action: () => setSelectedWorkOrder(workOrder),
                color: "#10B981",
                icon: "🔧"
              }}
              onSwipeLeft={{
                label: "Reschedule",
                action: () => handleWorkOrderAction('Reschedule', workOrder),
                color: "#F59E0B",
                icon: "📅"
              }}
              className="mb-4"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Work Order Photo */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={workOrder.photo} 
                        alt="Work order issue"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Work Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">Unit {workOrder.unit}</span>
                          <Badge className={getPriorityColor(workOrder.priority)}>
                            {workOrder.priority}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(workOrder.status)}>
                          {workOrder.status}
                        </Badge>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">{workOrder.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{workOrder.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{workOrder.resident}</span>
                        <span>{workOrder.daysOpen} days open</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwipeCard>
          ))
        )}
      </div>

      {/* Unit Turns Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Unit Turns</h2>
        {unitTurns.map((unitTurn) => (
          <Card 
            key={unitTurn.id} 
            className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleUnitTurnClick(unitTurn)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Unit {unitTurn.unit}</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {unitTurn.daysUntilMoveIn} days until move-in
                </Badge>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-600 mb-1">
                  Move Out: {new Date(unitTurn.moveOutDate).toLocaleDateString()} → 
                  Move In: {new Date(unitTurn.moveInDate).toLocaleDateString()}
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="grid grid-cols-3 gap-2">
                {unitTurn.completedSteps.map((step) => (
                  <div key={step} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded text-center">
                    ✓ {step}
                  </div>
                ))}
                {unitTurn.pendingSteps.slice(0, 3 - unitTurn.completedSteps.length).map((step) => (
                  <div key={step} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded text-center">
                    {step}
                  </div>
                ))}
              </div>
              
              {unitTurn.pendingSteps.length > (3 - unitTurn.completedSteps.length) && (
                <div className="text-xs text-gray-500 mt-2 text-center">
                  +{unitTurn.pendingSteps.length - (3 - unitTurn.completedSteps.length)} more steps
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceTodayTab;
