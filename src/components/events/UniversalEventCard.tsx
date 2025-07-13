import React from 'react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building, 
  AlertTriangle,
  CheckCircle,
  Circle,
  MoreHorizontal,
  Users,
  MessageSquare,
  Wrench,
  Home,
  Key,
  Eye,
  Gift
} from 'lucide-react';
import { UniversalEvent } from '@/types/eventTasks';
import { Role } from '@/types/roles';

interface UniversalEventCardProps {
  event: UniversalEvent;
  currentUserRole: Role;
  onEventClick?: (event: UniversalEvent) => void;
  onTaskAction?: (eventId: string, taskId: string, action: 'complete' | 'undo') => void;
  compact?: boolean;
  showActions?: boolean;
  className?: string;
}

const eventIcons = {
  'move-in': Home,
  'move-out': Home,
  'lease-signing': Key,
  'tour': Eye,
  'work-order': Wrench,
  'inspection': CheckCircle,
  'message': MessageSquare,
  'amenity-reservation': Gift,
  'community-event': Users,
  'collections': AlertTriangle,
  'promotional': Gift,
  'default': Calendar
};

const priorityColors = {
  low: 'bg-blue-50 border-blue-200 text-blue-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-orange-50 border-orange-200 text-orange-700',
  urgent: 'bg-red-50 border-red-200 text-red-700'
};

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  overdue: 'bg-red-100 text-red-800'
};

const formatEventDate = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
};

export const UniversalEventCard: React.FC<UniversalEventCardProps> = ({
  event,
  currentUserRole,
  onEventClick,
  onTaskAction,
  compact = false,
  showActions = true,
  className = ''
}) => {
  const IconComponent = eventIcons[event.type] || eventIcons.default;
  const tasksForRole = event.tasks.filter(task => 
    task.assignedRole === currentUserRole || currentUserRole === 'operator'
  );
  const completedTasks = tasksForRole.filter(task => task.isComplete);
  const totalTasks = tasksForRole.length;
  const progress = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const handleCardClick = () => {
    onEventClick?.(event);
  };

  const handleTaskAction = (taskId: string, action: 'complete' | 'undo') => {
    onTaskAction?.(event.id, taskId, action);
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer ${priorityColors[event.priority]} ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className={`pb-3 ${compact ? 'p-3' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-foreground truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {event.title}
              </h3>
              {!compact && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {event.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="secondary" className={statusColors[event.status]}>
              {event.status}
            </Badge>
            {showActions && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'p-3 pt-0' : 'pt-0'}>
        {/* Event Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          {event.metadata?.unit && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.metadata.unit}</span>
            </div>
          )}
          {event.metadata?.residentName && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="truncate max-w-[120px]">{event.metadata.residentName}</span>
            </div>
          )}
        </div>

        {/* Task Progress */}
        {totalTasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Tasks ({completedTasks.length}/{totalTasks})
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Quick Task List (compact view) */}
            {!compact && tasksForRole.slice(0, 3).map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between py-1 px-2 rounded bg-background/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {task.isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm truncate ${task.isComplete ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </span>
                </div>
                
                {!task.isComplete && task.status === 'available' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleTaskAction(task.id, 'complete')}
                  >
                    Complete
                  </Button>
                )}
              </div>
            ))}

            {tasksForRole.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{tasksForRole.length - 3} more tasks
              </p>
            )}
          </div>
        )}

        {/* Role Assignment Indicators */}
        <div className="flex items-center gap-1 mt-3">
          {event.assignedUsers.map((assignment, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {assignment.role}
            </Badge>
          ))}
        </div>

        {/* Metadata Display */}
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            {event.type === 'work-order' && event.metadata.workOrderType && (
              <Badge variant="secondary" className="text-xs">
                {event.metadata.workOrderType}
              </Badge>
            )}
            {event.type === 'collections' && event.metadata.balanceAmount && (
              <span className="text-sm text-red-600 font-medium">
                ${event.metadata.balanceAmount} ({event.metadata.daysPastDue} days overdue)
              </span>
            )}
            {event.type === 'promotional' && event.metadata.discountPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-muted-foreground">
                  {event.metadata.originalPrice}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {event.metadata.discountPrice}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};