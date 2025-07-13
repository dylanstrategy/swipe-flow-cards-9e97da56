import React, { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, startOfDay } from 'date-fns';
import { UniversalEventCard } from './UniversalEventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Grid3X3,
  List,
  CalendarDays
} from 'lucide-react';
import { UniversalEvent } from '@/types/eventTasks';
import { Role } from '@/types/roles';

interface EventCardCalendarViewProps {
  events: UniversalEvent[];
  currentUserRole: Role;
  onEventClick?: (event: UniversalEvent) => void;
  onTaskAction?: (eventId: string, taskId: string, action: 'complete' | 'undo') => void;
  className?: string;
}

type ViewMode = 'week' | 'list';

export const EventCardCalendarView: React.FC<EventCardCalendarViewProps> = ({
  events,
  currentUserRole,
  onEventClick,
  onTaskAction,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, UniversalEvent[]>();
    
    events.forEach(event => {
      const eventDate = startOfDay(new Date(event.date));
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    });

    // Sort events within each day by time
    grouped.forEach(dayEvents => {
      dayEvents.sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
    });

    return grouped;
  }, [events]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = addDays(currentDate, direction === 'next' ? 7 : -7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (date: Date): UniversalEvent[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsByDay.get(dateKey) || [];
  };

  const getTotalTasksForDay = (date: Date): { total: number; completed: number } => {
    const dayEvents = getEventsForDay(date);
    let total = 0;
    let completed = 0;

    dayEvents.forEach(event => {
      const userTasks = event.tasks.filter(task => 
        task.assignedRole === currentUserRole || currentUserRole === 'operator'
      );
      total += userTasks.length;
      completed += userTasks.filter(task => task.isComplete).length;
    });

    return { total, completed };
  };

  if (viewMode === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Events Calendar</h2>
            <Button variant="outline" size="sm" onClick={goToToday}>
              <CalendarDays className="h-4 w-4 mr-2" />
              Today
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('week')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Week
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* List View */}
        <div className="space-y-6">
          {Array.from(eventsByDay.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dateKey, dayEvents]) => (
              <div key={dateKey} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <h3 className="text-base font-medium">
                    {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <Badge variant="secondary">
                    {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {dayEvents.map(event => (
                    <UniversalEventCard
                      key={event.id}
                      event={event}
                      currentUserRole={currentUserRole}
                      onEventClick={onEventClick}
                      onTaskAction={onTaskAction}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold min-w-[200px] text-center">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={goToToday}>
            <CalendarDays className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setViewMode('week')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const taskStats = getTotalTasksForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              className={`min-h-[300px] p-3 rounded-lg border ${
                isToday 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-background border-border'
              }`}
            >
              {/* Day Header */}
              <div className="mb-3 pb-2 border-b border-border/50">
                <div className="text-sm font-medium text-center">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-semibold text-center ${
                  isToday ? 'text-primary' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                
                {/* Task Progress */}
                {taskStats.total > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Tasks</span>
                      <span>{taskStats.completed}/{taskStats.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all"
                        style={{ 
                          width: taskStats.total > 0 
                            ? `${(taskStats.completed / taskStats.total) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Events */}
              <div className="space-y-2">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="p-2 rounded border bg-background hover:shadow-sm cursor-pointer transition-shadow"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        event.priority === 'urgent' ? 'bg-red-500' :
                        event.priority === 'high' ? 'bg-orange-500' :
                        event.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-xs font-medium text-muted-foreground">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {event.metadata?.unit || event.type}
                    </p>
                  </div>
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground py-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
                
                {dayEvents.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No events
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};