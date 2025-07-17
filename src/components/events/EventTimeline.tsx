
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MessageSquare, Calendar, CheckCircle, AlertTriangle, Bell, X } from 'lucide-react';
import { format } from 'date-fns';
import { UniversalEvent, TaskCompletionStamp } from '@/types/eventTasks';
import { Role } from '@/types/roles';

interface EventTimelineProps {
  event: UniversalEvent;
  userRole: Role;
}

interface TimelineItem {
  id: string;
  timestamp: Date;
  type: string;
  title: string;
  description: string;
  icon: any;
  user: string;
  color: string;
  attachments?: Array<{
    type: 'image' | 'video';
    url: string;
    description: string;
  }>;
}

const EventTimeline = ({ event, userRole }: EventTimelineProps) => {
  const [selectedAttachment, setSelectedAttachment] = useState<{type: string; url: string; description: string} | null>(null);

  // Generate timeline items based on event type and task completion stamps
  const getTimelineItems = (): TimelineItem[] => {
    const baseItems: TimelineItem[] = [
      {
        id: 'creation',
        timestamp: event.createdAt,
        type: 'creation',
        title: 'Event Created',
        description: `${event.type.replace('-', ' ')} scheduled`,
        icon: Calendar,
        user: event.createdBy || 'System',
        color: 'text-blue-600 bg-blue-100'
      }
    ];

    // Add task completion stamps to timeline
    const taskCompletionItems: TimelineItem[] = event.taskCompletionStamps.map((stamp) => ({
      id: stamp.id,
      timestamp: stamp.completedAt,
      type: 'task-completion',
      title: `Task Completed: ${stamp.taskName}`,
      description: `Completed by ${stamp.completedByName || stamp.completedBy}`,
      icon: CheckCircle,
      user: stamp.completedByName || stamp.completedBy,
      color: 'text-green-600 bg-green-100'
    }));

    // Add message entries from follow-up history
    const messageItems: TimelineItem[] = (event.followUpHistory || []).map((entry: any) => ({
      id: entry.id || `msg-${entry.timestamp}`,
      timestamp: new Date(entry.timestamp),
      type: 'message',
      title: entry.type === 'gentle-reminder' ? 'Gentle Reminder Sent' : 'Message Sent',
      description: entry.content || entry.message || 'Message content',
      icon: MessageSquare,
      user: entry.sentBy || entry.from || 'User',
      color: 'text-purple-600 bg-purple-100'
    }));

    // Add type-specific timeline items
    let typeSpecificItems: TimelineItem[] = [];
    
    switch (event.type) {
      case 'move-in':
        typeSpecificItems = [
          {
            id: 'assignment',
            timestamp: new Date(event.createdAt.getTime() + 15 * 60000), // 15 mins after creation
            type: 'assignment',
            title: 'Assigned to Move-In Coordinator',
            description: 'Move-in inspection coordinator assigned',
            icon: User,
            user: 'System',
            color: 'text-green-600 bg-green-100'
          }
        ];
        break;

      case 'work-order':
        typeSpecificItems = [
          {
            id: 'assignment',
            timestamp: new Date(event.createdAt.getTime() + 15 * 60000),
            type: 'assignment',
            title: 'Assigned to Maintenance Team',
            description: 'Work order assigned to maintenance staff',
            icon: User,
            user: 'System',
            color: 'text-green-600 bg-green-100'
          }
        ];
        break;

      case 'lease-signing':
        typeSpecificItems = [
          {
            id: 'preparation',
            timestamp: new Date(event.createdAt.getTime() + 30 * 60000),
            type: 'preparation',
            title: 'Documents prepared',
            description: 'Lease documents ready for signing',
            icon: CheckCircle,
            user: 'Leasing Office',
            color: 'text-blue-600 bg-blue-100'
          }
        ];
        break;
    }

    // Combine and sort all items by timestamp (newest first)
    return [...baseItems, ...typeSpecificItems, ...taskCompletionItems, ...messageItems]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const timelineItems = getTimelineItems();

  const formatTimelineDate = (date: Date) => {
    return format(date, 'MMM d, yyyy at h:mm a');
  };

  const renderAttachments = (attachments: Array<{type: string; url: string; description: string}>) => {
    return (
      <div className="mt-3 space-y-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="border rounded-lg p-2 bg-white">
            {attachment.type === 'image' && (
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                onClick={() => setSelectedAttachment(attachment)}
              >
                <img 
                  src={attachment.url} 
                  alt={attachment.description}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Photo Attachment</p>
                  <p className="text-xs text-gray-500">{attachment.description}</p>
                  <p className="text-xs text-blue-600">Click to view full size</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Event Timeline</h3>
          <Badge variant="outline" className="text-xs">
            {timelineItems.length} {timelineItems.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-6">
            {timelineItems.map((item, index) => {
              const IconComponent = item.icon;
              const isLatest = index === 0;

              return (
                <div key={item.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${item.color} relative z-10`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      {isLatest && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Latest</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatTimelineDate(item.timestamp)}</span>
                      <span>•</span>
                      <span>{item.user}</span>
                    </div>

                    {/* Render attachments if available */}
                    {item.attachments && item.attachments.length > 0 && renderAttachments(item.attachments)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {timelineItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No timeline entries yet.
          </div>
        )}
      </div>

      {/* Attachment Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedAttachment(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full flex items-center justify-center">
              {selectedAttachment.type === 'image' && (
                <img
                  src={selectedAttachment.url}
                  alt={selectedAttachment.description}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
              <p className="text-sm">{selectedAttachment.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTimeline;
