
import React, { useState } from 'react';
import DragDropProvider from '../DragDropProvider';
import WorkOrderQueue from '../WorkOrderQueue';
import UnitTurnTracker from '../UnitTurnTracker';
import ScheduleDropZone from '../ScheduleDropZone';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceScheduleTabProps {
  onTodayWorkOrdersChange?: (workOrders: any[]) => void;
  onTodayUnitTurnsChange?: (unitTurns: any[]) => void;
  todayWorkOrders?: any[];
  onWorkOrderCompleted?: (workOrderId: string) => void;
}

const MaintenanceScheduleTab = ({ 
  onTodayWorkOrdersChange, 
  onTodayUnitTurnsChange,
  todayWorkOrders = [], 
  onWorkOrderCompleted 
}: MaintenanceScheduleTabProps) => {
  const { toast } = useToast();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [selectedUnitTurn, setSelectedUnitTurn] = useState<any>(null);
  const [scheduledUnitTurns, setScheduledUnitTurns] = useState<any[]>([]);

  const workOrders = [
    {
      id: 'WO-2024-1',
      unit: '204',
      title: 'Leaky Faucet',
      description: 'Faucet leaking in the kitchen. Requires new washers.',
      category: 'Plumbing',
      priority: 'medium',
      status: 'unscheduled',
      assignedTo: 'Mike Rodriguez',
      resident: 'John Smith',
      phone: '555-123-4567',
      daysOpen: 3,
      estimatedTime: '2 hours',
      submittedDate: '2024-07-15',
      photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      timeline: [
        {
          date: '2024-07-15',
          time: '08:30',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'John Smith'
        },
        {
          date: '2024-07-15',
          time: '09:15',
          type: 'assigned',
          message: 'Assigned to Mike Rodriguez',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-2',
      unit: '301',
      title: 'Broken AC',
      description: 'AC not cooling. Possible refrigerant leak.',
      category: 'HVAC',
      priority: 'high',
      status: 'unscheduled',
      assignedTo: 'Sarah Johnson',
      resident: 'Emily White',
      phone: '555-987-6543',
      daysOpen: 7,
      estimatedTime: '4 hours',
      submittedDate: '2024-07-09',
      photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      timeline: [
        {
          date: '2024-07-09',
          time: '10:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Emily White'
        },
        {
          date: '2024-07-09',
          time: '11:00',
          type: 'assigned',
          message: 'Assigned to Sarah Johnson',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-3',
      unit: '102',
      title: 'Electrical Issue',
      description: 'Outlet not working in the living room.',
      category: 'Electrical',
      priority: 'urgent',
      status: 'overdue',
      assignedTo: 'Mike Rodriguez',
      resident: 'David Lee',
      phone: '555-456-7890',
      daysOpen: 10,
      estimatedTime: '1 hour',
      submittedDate: '2024-07-06',
      photo: 'https://images.unsplash.com/photo-1629241447774-97423ca9e381?w=400',
      timeline: [
        {
          date: '2024-07-06',
          time: '14:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'David Lee'
        },
        {
          date: '2024-07-06',
          time: '15:00',
          type: 'assigned',
          message: 'Assigned to Mike Rodriguez',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-4',
      unit: '404',
      title: 'Clogged Drain',
      description: 'Bathroom sink drain clogged.',
      category: 'Plumbing',
      priority: 'medium',
      status: 'unscheduled',
      assignedTo: 'Sarah Johnson',
      resident: 'Linda Brown',
      phone: '555-789-1234',
      daysOpen: 2,
      estimatedTime: '1.5 hours',
      submittedDate: '2024-07-14',
      photo: 'https://images.unsplash.com/photo-1616624364804-94c87959b447?w=400',
      timeline: [
        {
          date: '2024-07-14',
          time: '09:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Linda Brown'
        },
        {
          date: '2024-07-14',
          time: '10:00',
          type: 'assigned',
          message: 'Assigned to Sarah Johnson',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-5',
      unit: '201',
      title: 'Clogged Toilet',
      description: 'Toilet is clogged and overflowing.',
      category: 'Plumbing',
      priority: 'high',
      status: 'unscheduled',
      assignedTo: 'Mike Rodriguez',
      resident: 'Alice Johnson',
      phone: '555-234-5678',
      daysOpen: 5,
      estimatedTime: '2 hours',
      submittedDate: '2024-07-11',
      photo: 'https://plus.unsplash.com/premium_photo-1663050487995-45380599867c?w=400',
      timeline: [
        {
          date: '2024-07-11',
          time: '11:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Alice Johnson'
        },
        {
          date: '2024-07-11',
          time: '12:00',
          type: 'assigned',
          message: 'Assigned to Mike Rodriguez',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-6',
      unit: '303',
      title: 'Broken Window',
      description: 'Window cracked in the bedroom.',
      category: 'Maintenance',
      priority: 'medium',
      status: 'unscheduled',
      assignedTo: 'Sarah Johnson',
      resident: 'Tom Wilson',
      phone: '555-567-8901',
      daysOpen: 1,
      estimatedTime: '3 hours',
      submittedDate: '2024-07-15',
      photo: 'https://images.unsplash.com/photo-1614333029639-58cb941c82a0?w=400',
      timeline: [
        {
          date: '2024-07-15',
          time: '13:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Tom Wilson'
        },
        {
          date: '2024-07-15',
          time: '14:00',
          type: 'assigned',
          message: 'Assigned to Sarah Johnson',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-7',
      unit: '101',
      title: 'Pest Control',
      description: 'Ants in the kitchen.',
      category: 'Pest Control',
      priority: 'low',
      status: 'unscheduled',
      assignedTo: 'Mike Rodriguez',
      resident: 'Karen Davis',
      phone: '555-345-6789',
      daysOpen: 4,
      estimatedTime: '1 hour',
      submittedDate: '2024-07-12',
      photo: 'https://images.unsplash.com/photo-1605281488533-5bb0b95708c7?w=400',
      timeline: [
        {
          date: '2024-07-12',
          time: '15:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Karen Davis'
        },
        {
          date: '2024-07-12',
          time: '16:00',
          type: 'assigned',
          message: 'Assigned to Mike Rodriguez',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-8',
      unit: '401',
      title: 'Leaky Roof',
      description: 'Roof leaking during heavy rain.',
      category: 'Roofing',
      priority: 'high',
      status: 'unscheduled',
      assignedTo: 'Sarah Johnson',
      resident: 'George Martin',
      phone: '555-678-9012',
      daysOpen: 9,
      estimatedTime: '6 hours',
      submittedDate: '2024-07-07',
      photo: 'https://images.unsplash.com/photo-1543178284-79e56d81c208?w=400',
      timeline: [
        {
          date: '2024-07-07',
          time: '16:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'George Martin'
        },
        {
          date: '2024-07-07',
          time: '17:00',
          type: 'assigned',
          message: 'Assigned to Sarah Johnson',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-9',
      unit: '203',
      title: 'Faulty Wiring',
      description: 'Lights flickering in the bathroom.',
      category: 'Electrical',
      priority: 'medium',
      status: 'unscheduled',
      assignedTo: 'Mike Rodriguez',
      resident: 'Susan Taylor',
      phone: '555-890-1234',
      daysOpen: 6,
      estimatedTime: '2 hours',
      submittedDate: '2024-07-10',
      photo: 'https://images.unsplash.com/photo-1555709952-3403778f409a?w=400',
      timeline: [
        {
          date: '2024-07-10',
          time: '17:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Susan Taylor'
        },
        {
          date: '2024-07-10',
          time: '18:00',
          type: 'assigned',
          message: 'Assigned to Mike Rodriguez',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-2024-10',
      unit: '302',
      title: 'Water Damage',
      description: 'Water stain on the ceiling.',
      category: 'Plumbing',
      priority: 'high',
      status: 'unscheduled',
      assignedTo: 'Sarah Johnson',
      resident: 'Robert Green',
      phone: '555-012-3456',
      daysOpen: 8,
      estimatedTime: '5 hours',
      submittedDate: '2024-07-08',
      photo: 'https://images.unsplash.com/photo-1614333029639-58cb941c82a0?w=400',
      timeline: [
        {
          date: '2024-07-08',
          time: '18:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Robert Green'
        },
        {
          date: '2024-07-08',
          time: '19:00',
          type: 'assigned',
          message: 'Assigned to Sarah Johnson',
          user: 'System'
        }
      ]
    }
  ];

  const handleScheduleWorkOrder = (workOrder: any, scheduledTime: string) => {
    console.log('Scheduling work order:', workOrder, 'at', scheduledTime);
    
    const scheduledWorkOrder = {
      ...workOrder,
      status: 'scheduled',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: scheduledTime
    };

    const updatedTodayWorkOrders = [...todayWorkOrders, scheduledWorkOrder];
    console.log('Updated today work orders:', updatedTodayWorkOrders);
    
    if (onTodayWorkOrdersChange) {
      onTodayWorkOrdersChange(updatedTodayWorkOrders);
    }
  };

  const handleScheduleUnitTurn = (unitTurn: any, scheduledTime: string) => {
    console.log('Scheduling unit turn:', unitTurn, 'at', scheduledTime);
    
    const scheduledUnitTurn = {
      ...unitTurn,
      status: 'scheduled',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: scheduledTime
    };

    const updatedScheduledUnitTurns = [...scheduledUnitTurns, scheduledUnitTurn];
    setScheduledUnitTurns(updatedScheduledUnitTurns);
    
    if (onTodayUnitTurnsChange) {
      onTodayUnitTurnsChange(updatedScheduledUnitTurns);
    }
  };

  const handleUnitTurnScheduled = (unitTurnId: string) => {
    console.log('Unit turn scheduled and removed from queue:', unitTurnId);
  };

  if (selectedWorkOrder) {
    toast({
      title: "Work Order Selected",
      description: `You have selected work order ${selectedWorkOrder.id}`,
    });
  }

  if (selectedUnitTurn) {
    toast({
      title: "Unit Turn Selected",
      description: `You have selected unit turn ${selectedUnitTurn.id}`,
    });
  }

  return (
    <DragDropProvider>
      <div className="min-h-screen relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          <div>
            <WorkOrderQueue 
              workOrders={workOrders}
              onSelectWorkOrder={setSelectedWorkOrder}
            />
          </div>
          
          <div>
            <UnitTurnTracker 
              onSelectUnitTurn={setSelectedUnitTurn}
              onUnitTurnScheduled={handleUnitTurnScheduled}
            />
          </div>
        </div>
        
        <ScheduleDropZone 
          onScheduleWorkOrder={handleScheduleWorkOrder}
          onScheduleUnitTurn={handleScheduleUnitTurn}
        />
      </div>
    </DragDropProvider>
  );
};

export default MaintenanceScheduleTab;
