
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
      assignedRoles: ['resident', 'operator'],
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
      assignedRoles: ['prospect', 'operator'],
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
      assignedRoles: ['resident', 'maintenance', 'operator'],
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
      assignedRoles: ['prospect', 'operator'],
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
      assignedRoles: ['operator', 'resident'],
      metadata: {
        unit: '5F',
        building: 'Building D',
        residentName: 'Jennifer Walsh',
        residentId: 'res-004',
        inspectionType: 'move-out'
      }
    },
    {
      id: 'amenity-reservation-006',
      date: today,
      time: '16:00',
      title: 'Pool Reservation - Weekend',
      description: 'Private pool access for Johnson family',
      type: 'amenity-reservation',
      category: 'Amenities',
      priority: 'low' as const,
      status: 'scheduled',
      unit: '4B',
      building: 'Building A',
      residentName: 'Sarah Johnson',
      rescheduledCount: 0,
      assignedRoles: ['resident', 'operator'],
      metadata: {
        amenityType: 'pool',
        residentName: 'Sarah Johnson',
        residentId: 'res-001',
        duration: '2 hours'
      }
    },
    {
      id: 'community-event-007',
      date: addDays(today, 3),
      time: '18:00',
      title: 'Community BBQ - Summer Kickoff',
      description: 'Annual summer community barbecue event',
      type: 'community-event',
      category: 'Community',
      priority: 'low' as const,
      status: 'scheduled',
      building: 'Community Center',
      rescheduledCount: 0,
      assignedRoles: ['operator', 'resident'],
      metadata: {
        eventType: 'bbq',
        capacity: 50,
        rsvpDeadline: addDays(today, 2)
      }
    },
    {
      id: 'message-008',
      date: today,
      time: '13:30',
      title: 'Maintenance Follow-up',
      description: 'Follow-up message regarding AC repair completion',
      type: 'message',
      category: 'Communication',
      priority: 'medium' as const,
      status: 'pending',
      unit: '3A',
      building: 'Building C',
      residentName: 'Emily Davis',
      rescheduledCount: 0,
      assignedRoles: ['resident', 'operator'],
      metadata: {
        messageType: 'follow-up',
        relatedWorkOrder: 'work-order-003',
        residentId: 'res-003'
      }
    },
    {
      id: 'collections-009',
      date: today,
      time: '12:00',
      title: 'Payment Plan Discussion',
      description: 'Discuss payment arrangement for outstanding balance',
      type: 'collections',
      category: 'Collections',
      priority: 'high' as const,
      status: 'scheduled',
      unit: '6A',
      building: 'Building E',
      residentName: 'Robert Kim',
      rescheduledCount: 0,
      assignedRoles: ['resident', 'operator'],
      metadata: {
        balanceAmount: 2350,
        daysPastDue: 15,
        residentId: 'res-005'
      }
    },
    {
      id: 'move-out-010',
      date: addDays(today, 7),
      time: '10:00',
      title: 'Move-Out Process - Unit 7C',
      description: 'Complete move-out checklist for departing resident',
      type: 'move-out',
      category: 'Resident Services',
      priority: 'medium' as const,
      status: 'scheduled',
      unit: '7C',
      building: 'Building F',
      residentName: 'Michael Torres',
      rescheduledCount: 0,
      assignedRoles: ['resident', 'operator'],
      metadata: {
        unit: '7C',
        building: 'Building F',
        residentName: 'Michael Torres',
        residentId: 'res-006',
        moveOutDate: addDays(today, 7)
      }
    }
  ];
};

// Promotional events based on lifestyle tags
export const createPromotionalEvents = (lifestyleTags: string[]) => {
  const today = new Date();
  const promoEvents = [];

  const lifestyleToPromos = {
    "wellness": [
      {
        id: 'promo-yoga-001',
        title: 'Morning Yoga Class - Special Rate',
        description: 'Start your day with mindful movement - 50% off first class',
        promoType: 'fitness',
        originalPrice: '$30',
        discountPrice: '$15',
        vendor: 'Zen Studio Downtown',
        validUntil: addDays(today, 7)
      },
      {
        id: 'promo-gym-002',
        title: 'Gym Membership Credit',
        description: 'Get $50 credit toward annual membership',
        promoType: 'fitness',
        originalPrice: '$100',
        discountPrice: '$50',
        vendor: 'FitLife Gym',
        validUntil: addDays(today, 14)
      }
    ],
    "foodAndDrinks": [
      {
        id: 'promo-tasting-003',
        title: 'Local Tasting Tour',
        description: 'Explore 3 neighborhood restaurants with guided tour',
        promoType: 'food',
        originalPrice: '$75',
        discountPrice: '$45',
        vendor: 'Neighborhood Eats',
        validUntil: addDays(today, 10)
      },
      {
        id: 'promo-restaurant-004',
        title: 'Fine Dining Discount',
        description: '25% off dinner at award-winning restaurant',
        promoType: 'food',
        originalPrice: '$120',
        discountPrice: '$90',
        vendor: 'Bistro Excellence',
        validUntil: addDays(today, 5)
      }
    ],
    "creativity": [
      {
        id: 'promo-art-005',
        title: 'Pottery Workshop',
        description: 'Create your own ceramic pieces in 2-hour session',
        promoType: 'creative',
        originalPrice: '$60',
        discountPrice: '$35',
        vendor: 'Clay & Create Studio',
        validUntil: addDays(today, 12)
      },
      {
        id: 'promo-studio-006',
        title: 'Photography Studio Rental',
        description: 'Professional studio space for your creative projects',
        promoType: 'creative',
        originalPrice: '$150',
        discountPrice: '$90',
        vendor: 'Light Box Studios',
        validUntil: addDays(today, 21)
      }
    ]
  };

  // Generate promo events based on user's lifestyle tags
  lifestyleTags.forEach(tag => {
    if (lifestyleToPromos[tag]) {
      lifestyleToPromos[tag].forEach((promo, index) => {
        promoEvents.push({
          id: promo.id,
          date: addDays(today, index), // Spread them across different days
          time: '15:00', // Afternoon time slot
          title: promo.title,
          description: promo.description,
          type: 'promotional',
          category: 'Promotional',
          priority: 'medium' as const,
          status: 'scheduled',
          rescheduledCount: 0,
          assignedRoles: ['resident'],
          metadata: {
            promoType: promo.promoType,
            originalPrice: promo.originalPrice,
            discountPrice: promo.discountPrice,
            vendor: promo.vendor,
            validUntil: promo.validUntil,
            lifestyleTag: tag,
            canRedeem: true,
            isRedeemed: false
          }
        });
      });
    }
  });

  return promoEvents;
};

// Helper function to filter events by role
export const getEventsForRole = (events: any[], userRole: string) => {
  return events.filter(event => 
    event.assignedRoles && event.assignedRoles.includes(userRole)
  );
};
