
import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { useResident } from '@/contexts/ResidentContext';

interface MoveCalendarEventsProps {
  selectedDate: Date;
  onEventClick?: (event: any) => void;
}

const MoveCalendarEvents = ({ selectedDate, onEventClick }: MoveCalendarEventsProps) => {
  const { profile } = useResident();

  const generateMoveInEvents = () => {
    if (!profile.leaseStartDate || profile.status === 'current') return [];

    const leaseStart = new Date(profile.leaseStartDate);
    const events = [];

    // Generate events based on move-in checklist
    if (profile.moveInChecklist) {
      Object.entries(profile.moveInChecklist).forEach(([stepId, step], index) => {
        if (!step.completed) {
          const dueDate = addDays(leaseStart, -(10 - index)); // Stagger due dates
          events.push({
            id: `movein-${stepId}`,
            date: dueDate,
            time: '12:00',
            title: `Move-In: ${getStepTitle(stepId)}`,
            description: getStepDescription(stepId),
            category: 'Move-In',
            priority: index < 3 ? 'high' : 'medium',
            stepId,
            type: 'moveIn'
          });
        }
      });
    }

    return events;
  };

  const generateMoveOutEvents = () => {
    if (!profile.moveOutDate || profile.status !== 'notice') return [];

    const moveOutDate = new Date(profile.moveOutDate);
    const events = [];

    // Generate events based on move-out checklist
    if (profile.moveOutChecklist) {
      Object.entries(profile.moveOutChecklist).forEach(([stepId, step], index) => {
        if (!step.completed) {
          const dueDate = addDays(moveOutDate, -(8 - index)); // Stagger due dates before move-out
          events.push({
            id: `moveout-${stepId}`,
            date: dueDate,
            time: '14:00',
            title: `Move-Out: ${getStepTitle(stepId)}`,
            description: getStepDescription(stepId),
            category: 'Move-Out',
            priority: stepId === 'notice-to-vacate' || stepId === 'final-inspection' ? 'high' : 'medium',
            stepId,
            type: 'moveOut'
          });
        }
      });
    }

    return events;
  };

  const getStepTitle = (stepId: string) => {
    const titles: { [key: string]: string } = {
      'sign-lease': 'Sign Lease Agreement',
      'payment': 'Complete Payment',
      'renters-insurance': 'Upload Renter\'s Insurance',
      'book-movers': 'Book Moving Services',
      'utilities': 'Set Up Utilities',
      'inspection': 'Schedule Move-In Inspection',
      'community-guidelines': 'Review Community Guidelines',
      'move-in': 'Complete Move-In',
      'notice-to-vacate': 'Submit Notice to Vacate',
      'forwarding-address': 'Provide Forwarding Address',
      'final-inspection': 'Complete Final Inspection',
      'exit-survey': 'Complete Exit Survey',
      'key-return': 'Return Keys',
      'final-balance': 'Pay Final Balance',
      'deposit-release': 'Confirm Deposit Release',
      'move-out-confirmation': 'Final Move-Out Confirmation'
    };
    return titles[stepId] || stepId;
  };

  const getStepDescription = (stepId: string) => {
    const descriptions: { [key: string]: string } = {
      'sign-lease': 'Review and digitally sign your lease agreement',
      'payment': 'Complete initial payment and security deposit',
      'renters-insurance': 'Upload proof of renter\'s insurance coverage',
      'book-movers': 'Schedule professional moving services',
      'utilities': 'Arrange electricity, water, gas, and internet services',
      'inspection': 'Schedule your move-in inspection with maintenance',
      'community-guidelines': 'Read and acknowledge community rules and guidelines',
      'move-in': 'Complete final move-in inspection and receive keys',
      'notice-to-vacate': 'Submit signed Notice to Vacate form',
      'forwarding-address': 'Provide new address for deposit return',
      'final-inspection': 'Complete move-out inspection with staff or video',
      'exit-survey': 'Share feedback about your residency experience',
      'key-return': 'Return all keys and access cards',
      'final-balance': 'Pay any outstanding balance on account',
      'deposit-release': 'Confirm security deposit release details',
      'move-out-confirmation': 'Final confirmation of move-out completion'
    };
    return descriptions[stepId] || 'Complete this move-related task';
  };

  const allEvents = [...generateMoveInEvents(), ...generateMoveOutEvents()];
  const selectedDateEvents = allEvents.filter(event => isSameDay(event.date, selectedDate));

  if (selectedDateEvents.length === 0) return null;

  return (
    <div className="space-y-2">
      {selectedDateEvents.map((event) => (
        <div
          key={event.id}
          onClick={() => onEventClick?.(event)}
          className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  event.category === 'Move-In' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {event.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.priority === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {event.priority}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
              <p className="text-xs text-gray-500 mt-1">Due: {format(event.date, 'MMM d')} at {event.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoveCalendarEvents;
