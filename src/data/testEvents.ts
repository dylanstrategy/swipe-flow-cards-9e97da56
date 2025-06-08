
import { addDays } from 'date-fns';

export const createTestEvents = () => {
  const today = new Date();
  
  return [
    {
      id: 'move-in-001',
      date: today,
      time: '09:00',
      title: 'Move-In Process - Unit 4B',
      description: 'Complete move-in checklist for new resident Sarah Johnson',
      type: 'move-in',
      category: 'Resident Services',
      priority: 'high' as const,
      status: 'scheduled',
      unit: '4B',
      building: 'Building A',
      residentName: 'Sarah Johnson',
      rescheduledCount: 0,
      metadata: {
        unit: '4B',
        building: 'Building A',
        residentName: 'Sarah Johnson',
        residentId: 'res-001'
      }
    },
    {
      id: 'lease-signing-002',
      date: today,
      time: '10:30',
      title: 'Lease Signing - Unit 2C',
      description: 'Mike Chen lease renewal signing appointment',
      type: 'lease-signing',
      category: 'Leasing',
      priority: 'medium' as const,
      status: 'scheduled',
      unit: '2C',
      building: 'Building B',
      residentName: 'Mike Chen',
      rescheduledCount: 0,
      metadata: {
        unit: '2C',
        building: 'Building B',
        residentName: 'Mike Chen',
        residentId: 'res-002'
      }
    },
    {
      id: 'work-order-003',
      date: today,
      time: '14:00',
      title: 'Work Order - Kitchen Faucet Repair',
      description: 'Repair leaky kitchen faucet in Unit 3A',
      type: 'work-order',
      category: 'Maintenance',
      priority: 'urgent' as const,
      status: 'scheduled',
      unit: '3A',
      building: 'Building C',
      residentName: 'Emily Davis',
      rescheduledCount: 0,
      metadata: {
        unit: '3A',
        building: 'Building C',
        residentName: 'Emily Davis',
        residentId: 'res-003',
        workOrderType: 'plumbing'
      }
    },
    {
      id: 'tour-004',
      date: addDays(today, 1),
      time: '15:00',
      title: 'Property Tour - Prospect Visit',
      description: 'Show available units to prospective tenant Alex Rivera',
      type: 'tour',
      category: 'Leasing',
      priority: 'medium' as const,
      status: 'scheduled',
      unit: '1D',
      building: 'Building A',
      residentName: 'Alex Rivera',
      rescheduledCount: 0,
      metadata: {
        unit: '1D',
        building: 'Building A',
        prospectName: 'Alex Rivera',
        prospectId: 'pros-001'
      }
    },
    {
      id: 'inspection-005',
      date: addDays(today, 2),
      time: '11:00',
      title: 'Move-Out Inspection - Unit 5F',
      description: 'Final inspection before tenant move-out',
      type: 'inspection',
      category: 'Resident Services',
      priority: 'medium' as const,
      status: 'scheduled',
      unit: '5F',
      building: 'Building D',
      residentName: 'Jennifer Walsh',
      rescheduledCount: 0,
      metadata: {
        unit: '5F',
        building: 'Building D',
        residentName: 'Jennifer Walsh',
        residentId: 'res-004',
        inspectionType: 'move-out'
      }
    }
  ];
};
