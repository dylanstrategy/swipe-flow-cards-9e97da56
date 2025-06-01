import React, { useState, useEffect } from 'react';
import SwipeCard from '../SwipeCard';
import MessageModule from '../message/MessageModule';
import { useToast } from '@/hooks/use-toast';
import { Clock, ChevronLeft, ChevronRight, CloudSun } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, differenceInDays, isPast, isToday } from 'date-fns';
import ResidentTimeline from '../ResidentTimeline';
import { cn } from '@/lib/utils';

const TodayTab = () => {
  const { toast } = useToast();
  const [showTimeline, setShowTimeline] = useState(false);
  const [showMessageModule, setShowMessageModule] = useState(false);
  const [messageConfig, setMessageConfig] = useState({
    subject: '',
    recipientType: 'management' as 'management' | 'maintenance' | 'leasing',
    mode: 'compose' as 'compose' | 'reply'
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [weather, setWeather] = useState({ temp: 72, condition: 'Sunny' });

  // Simulate live weather updates
  useEffect(() => {
    const updateWeather = () => {
      const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Clear'];
      const temps = [68, 70, 72, 74, 76];
      setWeather({
        temp: temps[Math.floor(Math.random() * temps.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)]
      });
    };

    const interval = setInterval(updateWeather, 30000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced calendar events with realistic examples and times
  const calendarEvents = [
    {
      id: 1,
      date: new Date(),
      time: '09:00',
      title: 'Work Order',
      description: 'Broken outlet - Unit 4B',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      category: 'Work Order',
      priority: 'high',
      dueDate: addDays(new Date(), -1) // Overdue
    },
    {
      id: 2,
      date: new Date(),
      time: '10:30',
      title: 'Message from Management',
      description: 'Please submit your lease renewal documents by Friday',
      category: 'Management',
      priority: 'medium'
    },
    {
      id: 3,
      date: new Date(),
      time: '11:00',
      title: 'Lease Renewal',
      description: 'New rent: $1,550/month starting March 1st',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400',
      category: 'Lease',
      priority: 'high',
      dueDate: addDays(new Date(), 2) // Due soon
    },
    {
      id: 4,
      date: new Date(),
      time: '14:00',
      title: 'Local Business Offer',
      description: '20% OFF at Joe\'s Burger Joint - Show this message',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      category: 'Point of Sale',
      priority: 'low'
    },
    {
      id: 5,
      date: addDays(new Date(), 1),
      time: '14:00',
      title: 'Rooftop BBQ Social',
      description: 'Community event - RSVP required',
      category: 'Community Event',
      priority: 'low'
    },
    {
      id: 6,
      date: addDays(new Date(), 2),
      time: '09:00',
      title: 'HVAC Maintenance',
      description: 'Filter replacement scheduled',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      category: 'Work Order',
      priority: 'medium'
    }
  ];

  // Add special event for rent due
  const rentDueEvent = {
    id: 999,
    date: new Date(),
    time: '14:00',
    title: 'Rent Payment Due',
    description: '$1,550 due in 3 days',
    category: 'Payment',
    priority: 'high',
    dueDate: addDays(new Date(), 3) // Due in 3 days
  };

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const handleQuickReply = (subject: string, recipientType: 'management' | 'maintenance' | 'leasing' = 'management') => {
    setMessageConfig({
      subject: `Re: ${subject}`,
      recipientType,
      mode: 'reply'
    });
    setShowMessageModule(true);
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => isSameDay(event.date, date))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getUrgencyClass = (event: any) => {
    if (!event.dueDate) return '';
    
    const daysUntilDue = differenceInDays(event.dueDate, new Date());
    const isOverdue = isPast(event.dueDate) && !isToday(event.dueDate);
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    
    if (isOverdue) {
      return 'wiggle-urgent pulse-urgent';
    } else if (isDueSoon && event.priority === 'high') {
      return 'wiggle-urgent';
    }
    
    return '';
  };

  const getRentUrgencyClass = () => {
    const daysUntilRentDue = 3; // Rent due in 3 days
    if (daysUntilRentDue <= 3) {
      return 'wiggle-urgent';
    }
    return '';
  };

  const getSwipeActionsForEvent = (event: any) => {
    switch (event.category) {
      case 'Work Order':
        return {
          onSwipeRight: {
            label: "Reschedule",
            action: () => handleAction("Requested reschedule", event.title),
            color: "#F59E0B",
            icon: "📅"
          }
        };
      
      case 'Management':
        return {
          onSwipeRight: {
            label: "Archive",
            action: () => handleAction("Archived", event.title),
            color: "#6B7280",
            icon: "📦"
          },
          onSwipeLeft: {
            label: "Quick Reply",
            action: () => handleQuickReply(event.title, 'management'),
            color: "#3B82F6",
            icon: "💬"
          }
        };
      
      case 'Lease':
        return {
          onSwipeRight: {
            label: "Accept",
            action: () => handleAction("Accepted lease renewal", event.title),
            color: "#10B981",
            icon: "✅"
          }
        };
      
      case 'Point of Sale':
        return {
          onSwipeRight: {
            label: "Save to Wallet",
            action: () => handleAction("Saved to wallet", event.title),
            color: "#10B981",
            icon: "💾"
          }
        };
      
      case 'Community Event':
        return {
          onSwipeRight: {
            label: "Confirm Attendance",
            action: () => handleAction("Confirmed attendance", event.title),
            color: "#10B981",
            icon: "✅"
          }
        };

      case 'Payment':
        return {
          onSwipeRight: {
            label: "Pay Now",
            action: () => handleAction("Paid", event.title),
            color: "#10B981",
            icon: "💳"
          }
        };
      
      default:
        return {
          onSwipeRight: {
            label: "View",
            action: () => handleAction("Viewed", event.title),
            color: "#3B82F6",
            icon: "👁️"
          }
        };
    }
  };

  if (showMessageModule) {
    return (
      <MessageModule
        onClose={() => setShowMessageModule(false)}
        initialSubject={messageConfig.subject}
        recipientType={messageConfig.recipientType}
        mode={messageConfig.mode}
      />
    );
  }

  if (showTimeline) {
    return <ResidentTimeline onClose={() => setShowTimeline(false)} />;
  }

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'EEEE')}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CloudSun size={16} className="text-blue-600" />
                <span>{weather.temp}°F • {weather.condition}</span>
              </div>
            </div>
            <p className="text-gray-600">Good morning, John!</p>
          </div>
        </div>
        <button
          onClick={() => setShowTimeline(true)}
          className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          title="View Resident Timeline"
        >
          <Clock className="text-white" size={20} />
        </button>
      </div>

      {/* Quick Actions with urgency animations */}
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
          className={getRentUrgencyClass()}
          enableSwipeUp={false}
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
          enableSwipeUp={false}
        >
          <div 
            className="relative p-4 rounded-lg text-white overflow-hidden"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-purple-600/80 backdrop-blur-[2px] rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-semibold mb-1">Work Orders</h3>
              <p className="text-purple-100 text-sm">1 active • 2 pending</p>
            </div>
          </div>
        </SwipeCard>
      </div>

      {/* Calendar Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isSameDay(selectedDate, new Date()) ? 'Resident Calendar' : 'Calendar'}
        </h2>
        
        {/* Mini Calendar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600 mb-4">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
              const date = addDays(new Date(), offset);
              const isSelected = isSameDay(date, selectedDate);
              const hasEvents = getEventsForDate(date).length > 0;
              return (
                <button
                  key={offset}
                  onClick={() => setSelectedDate(date)}
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-lg transition-all ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : hasEvents 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline View for Selected Date with urgency animations */}
        <div>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => {
                const swipeActions = getSwipeActionsForEvent(event);
                const urgencyClass = getUrgencyClass(event);
                return (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 pt-4">
                      {formatTime(event.time)}
                    </div>
                    <div className="flex-1">
                      <SwipeCard
                        onSwipeRight={swipeActions.onSwipeRight}
                        onSwipeLeft={swipeActions.onSwipeLeft}
                        onTap={() => handleAction("Viewed details", event.title)}
                        className={urgencyClass}
                        enableSwipeUp={false}
                      >
                        <div className={cn(
                          "bg-blue-50 rounded-lg p-4",
                          urgencyClass && "border-2 border-red-200"
                        )}>
                          <div className="flex items-start gap-3">
                            {event.image ? (
                              <div 
                                className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url(${event.image})` }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                {event.category === 'Management' ? '✉️' : 
                                 event.category === 'Community Event' ? '🎉' : 
                                 event.category === 'Work Order' ? '🔧' :
                                 event.category === 'Lease' ? '📋' :
                                 event.category === 'Point of Sale' ? '🏪' : '📢'}
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                              <p className="text-gray-600 text-sm">{event.description}</p>
                              {urgencyClass && (
                                <p className="text-red-600 text-xs mt-1 font-medium">
                                  {isPast(event.dueDate || new Date()) ? 'OVERDUE!' : 'DUE SOON!'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </SwipeCard>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No events scheduled for {format(selectedDate, 'EEEE, MMMM d')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayTab;
