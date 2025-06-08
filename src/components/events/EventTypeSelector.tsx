
import React from 'react';
import { Button } from '@/components/ui/button';
import { getAllEventTypes, getEventTypesByCategory } from '@/services/eventTypeService';
import { EventType } from '@/types/eventTasks';

interface EventTypeSelectorProps {
  onSelectEventType: (eventType: EventType) => void;
  onClose: () => void;
}

const EventTypeSelector = ({ onSelectEventType, onClose }: EventTypeSelectorProps) => {
  const allEventTypes = getAllEventTypes();
  const categories = Array.from(new Set(allEventTypes.map(type => type.category)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
          <p className="text-gray-600 mt-2">Select the type of event you want to create</p>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {categories.map(category => {
            const categoryEvents = getEventTypesByCategory(category);
            
            return (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryEvents.map(eventType => (
                    <Button
                      key={eventType.id}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => onSelectEventType(eventType)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <span className="text-2xl flex-shrink-0">{eventType.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1">{eventType.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{eventType.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>⏱ {eventType.estimatedDuration}m</span>
                            <span>👥 {eventType.defaultTasks.length} tasks</span>
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventTypeSelector;
