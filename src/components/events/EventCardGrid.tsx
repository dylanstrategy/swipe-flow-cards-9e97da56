import React, { useState, useMemo } from 'react';
import { UniversalEventCard } from './UniversalEventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { UniversalEvent } from '@/types/eventTasks';
import { Role } from '@/types/roles';

interface EventCardGridProps {
  events: UniversalEvent[];
  currentUserRole: Role;
  onEventClick?: (event: UniversalEvent) => void;
  onTaskAction?: (eventId: string, taskId: string, action: 'complete' | 'undo') => void;
  onCreateEvent?: () => void;
  title?: string;
  showFilters?: boolean;
  compact?: boolean;
  maxEvents?: number;
  className?: string;
}

type FilterType = 'all' | 'today' | 'upcoming' | 'completed' | 'overdue' | 'my-tasks';
type SortType = 'date' | 'priority' | 'status' | 'type';

export const EventCardGrid: React.FC<EventCardGridProps> = ({
  events,
  currentUserRole,
  onEventClick,
  onTaskAction,
  onCreateEvent,
  title = "Events",
  showFilters = true,
  compact = false,
  maxEvents,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.metadata?.residentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.metadata?.unit?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filterType) {
      case 'today':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && event.status === 'scheduled';
        });
        break;
      case 'completed':
        filtered = filtered.filter(event => event.status === 'completed');
        break;
      case 'overdue':
        filtered = filtered.filter(event => event.status === 'overdue');
        break;
      case 'my-tasks':
        filtered = filtered.filter(event => 
          event.tasks.some(task => 
            (task.assignedRole === currentUserRole || currentUserRole === 'operator') && 
            !task.isComplete
          )
        );
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    // Apply max events limit
    if (maxEvents) {
      filtered = filtered.slice(0, maxEvents);
    }

    return filtered;
  }, [events, searchTerm, filterType, sortBy, currentUserRole, maxEvents]);

  const getFilterStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: events.length,
      today: events.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime();
      }).length,
      upcoming: events.filter(event => 
        new Date(event.date) >= today && event.status === 'scheduled'
      ).length,
      completed: events.filter(event => event.status === 'completed').length,
      overdue: events.filter(event => event.status === 'overdue').length,
      myTasks: events.filter(event => 
        event.tasks.some(task => 
          (task.assignedRole === currentUserRole || currentUserRole === 'operator') && 
          !task.isComplete
        )
      ).length
    };
  };

  const stats = getFilterStats();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredAndSortedEvents.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}
          {onCreateEvent && (
            <Button size="sm" onClick={onCreateEvent}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Type */}
            <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events ({stats.total})</SelectItem>
                <SelectItem value="today">Today ({stats.today})</SelectItem>
                <SelectItem value="upcoming">Upcoming ({stats.upcoming})</SelectItem>
                <SelectItem value="my-tasks">My Tasks ({stats.myTasks})</SelectItem>
                <SelectItem value="completed">Completed ({stats.completed})</SelectItem>
                <SelectItem value="overdue">Overdue ({stats.overdue})</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick Stats */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{stats.overdue}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{stats.completed}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4 text-blue-500" />
                <span>{stats.myTasks}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Grid */}
      {filteredAndSortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No events found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm 
              ? "Try adjusting your search or filters" 
              : "No events match the current filter criteria"
            }
          </p>
          {onCreateEvent && (
            <Button onClick={onCreateEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${compact ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
          {filteredAndSortedEvents.map((event) => (
            <UniversalEventCard
              key={event.id}
              event={event}
              currentUserRole={currentUserRole}
              onEventClick={onEventClick}
              onTaskAction={onTaskAction}
              compact={compact}
            />
          ))}
        </div>
      )}

      {/* Show More */}
      {maxEvents && events.length > maxEvents && (
        <div className="text-center">
          <Button variant="outline" onClick={() => window.location.href = '/schedule'}>
            View All Events ({events.length - maxEvents} more)
          </Button>
        </div>
      )}
    </div>
  );
};