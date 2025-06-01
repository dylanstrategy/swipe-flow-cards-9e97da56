
import React from 'react';
import { ArrowLeft, Home, CreditCard, Wrench, MessageSquare, Calendar, Star } from 'lucide-react';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

interface ResidentTimelineProps {
  onClose: () => void;
}

const ResidentTimeline = ({ onClose }: ResidentTimelineProps) => {
  const timelineEvents = [
    {
      id: 1,
      type: 'payment',
      title: 'Rent Payment',
      description: 'Monthly rent payment processed',
      amount: '$1,550',
      date: new Date(),
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      id: 2,
      type: 'message',
      title: 'Pool Maintenance Notice',
      description: 'Building management sent an update',
      date: subDays(new Date(), 1),
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'work_order',
      title: 'Work Order Completed',
      description: 'HVAC maintenance request #1234',
      date: subDays(new Date(), 3),
      icon: Wrench,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      type: 'event',
      title: 'Community Event RSVP',
      description: 'Rooftop BBQ - Confirmed attendance',
      date: subWeeks(new Date(), 1),
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      id: 5,
      type: 'payment',
      title: 'Rent Payment',
      description: 'Monthly rent payment processed',
      amount: '$1,550',
      date: subMonths(new Date(), 1),
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      id: 6,
      type: 'move_in',
      title: 'Move-in Complete',
      description: 'Welcome to The Meridian, Apt 204!',
      date: subMonths(new Date(), 3),
      icon: Home,
      color: 'bg-indigo-500'
    },
    {
      id: 7,
      type: 'lease',
      title: 'Lease Agreement Signed',
      description: '12-month lease agreement executed',
      date: subMonths(new Date(), 4),
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center mb-6">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg mr-3"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resident Timeline</h1>
          <p className="text-gray-600">Complete activity history</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            const IconComponent = event.icon;
            
            return (
              <div key={event.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div className={`relative z-10 w-12 h-12 ${event.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <IconComponent className="text-white" size={20} />
                </div>
                
                {/* Event content */}
                <div className="ml-4 flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <span className="text-sm text-gray-500">
                      {format(event.date, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{event.description}</p>
                  {event.amount && (
                    <p className="text-green-600 font-semibold">{event.amount}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {format(event.date, 'h:mm a')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResidentTimeline;
