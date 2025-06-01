
import React, { useState } from 'react';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import ResidentTimeline from '../ResidentTimeline';

const TodayTab = () => {
  const { toast } = useToast();
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Sample calendar events
  const calendarEvents = [
    {
      id: 1,
      date: new Date(),
      type: 'message',
      title: 'Pool Maintenance Update',
      description: 'Scheduled for tomorrow 9AM-12PM',
      category: 'Building Notice'
    },
    {
      id: 2,
      date: addDays(new Date(), 1),
      type: 'event',
      title: 'Rooftop BBQ',
      description: 'Community event this Saturday 6PM',
      category: 'Community Event'
    },
    {
      id: 3,
      date: addDays(new Date(), 2),
      type: 'work_order',
      title: 'HVAC Maintenance',
      description: 'Scheduled maintenance check',
      category: 'Work Order'
    },
    {
      id: 4,
      date: addDays(new Date(), 3),
      type: 'payment',
      title: 'Rent Due Reminder',
      description: 'Monthly rent payment due',
      category: 'Payment'
    },
    {
      id: 5,
      date: addDays(new Date(), 5),
      type: 'advertisement',
      title: 'Local Gym Discount',
      description: '20% off membership for residents',
      category: 'Advertisement'
    }
  ];

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => isSameDay(event.date, date));
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      message: 'bg-blue-500',
      event: 'bg-green-500',
      work_order: 'bg-purple-500',
      payment: 'bg-orange-500',
      advertisement: 'bg-pink-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  if (showTimeline) {
    return <ResidentTimeline onClose={() => setShowTimeline(false)} />;
  }

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today</h1>
          <p className="text-gray-600">Good morning, John!</p>
        </div>
        <button
          onClick={() => setShowTimeline(true)}
          className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          title="View Resident Timeline"
        >
          <Clock className="text-white" size={20} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SwipeCard
          onSwipeRight={{
            label: "Pay Now",
            action: () => handleAction("Paid", "Rent"),
            color: "#10B981",
            icon: "💳"
          }}
          onSwipeLeft={{
            label: "Schedule",
            action: () => handleAction("Scheduled", "Rent Payment"),
            color: "#F59E0B",
            icon: "📅"
          }}
          onTap={() => handleAction("Viewed", "Rent Payment")}
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-1">Rent Due</h3>
            <p className="text-blue-100 text-sm">$1,550 • Due in 3 days</p>
          </div>
        </SwipeCard>

        <SwipeCard
          onSwipeRight={{
            label: "Create",
            action: () => handleAction("Created", "Work Order"),
            color: "#6366F1",
            icon: "🔧"
          }}
          onSwipeLeft={{
            label: "View All",
            action: () => handleAction("Viewed", "Work Orders"),
            color: "#8B5CF6",
            icon: "📋"
          }}
          onTap={() => handleAction("Opened", "Work Orders")}
        >
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-1">Work Orders</h3>
            <p className="text-purple-100 text-sm">1 active • 2 pending</p>
          </div>
        </SwipeCard>
      </div>

      {/* Weather & Building Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-4 rounded-lg text-white">
          <h3 className="font-semibold mb-1">Weather</h3>
          <p className="text-orange-100 text-sm">72°F • Sunny</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-400 to-green-500 p-4 rounded-lg text-white">
          <h3 className="font-semibold mb-1">Building Status</h3>
          <p className="text-green-100 text-sm">All systems normal</p>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar</h2>
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            modifiers={{
              hasEvents: (date) => getEventsForDate(date).length > 0
            }}
            modifiersStyles={{
              hasEvents: { 
                backgroundColor: '#3B82F6', 
                color: 'white',
                borderRadius: '50%'
              }
            }}
          />
        </div>

        {/* Selected Date Events */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <SwipeCard
                  key={event.id}
                  onSwipeRight={{
                    label: event.type === 'event' ? "RSVP" : "Mark Read",
                    action: () => handleAction(event.type === 'event' ? "RSVP'd" : "Read", event.title),
                    color: "#10B981",
                    icon: event.type === 'event' ? "✅" : "📖"
                  }}
                  onSwipeLeft={{
                    label: "Remind Me",
                    action: () => handleAction("Reminded", event.title),
                    color: "#F59E0B",
                    icon: "⏰"
                  }}
                  onTap={() => handleAction("Viewed", event.title)}
                >
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                    <div className={`w-3 h-3 ${getEventTypeColor(event.type)} rounded-full mr-3`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {event.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                    </div>
                  </div>
                </SwipeCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No events scheduled for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayTab;
