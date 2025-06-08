
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getEventTypes } from '@/services/eventTypeService';

interface EventTypeSelectorProps {
  onSelectEventType: (eventTypeId: string) => void;
  onClose: () => void;
}

const EventTypeSelector = ({ onSelectEventType, onClose }: EventTypeSelectorProps) => {
  const eventTypes = getEventTypes();

  const groupedEventTypes = eventTypes.reduce((acc, eventType) => {
    if (!acc[eventType.category]) {
      acc[eventType.category] = [];
    }
    acc[eventType.category].push(eventType);
    return acc;
  }, {} as Record<string, typeof eventTypes>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Select Event Type</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {Object.entries(groupedEventTypes).map(([category, types]) => (
            <div key={category} className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {types.map((eventType) => (
                  <Button
                    key={eventType.id}
                    variant="outline"
                    className="p-4 h-auto flex flex-col items-start text-left hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => onSelectEventType(eventType.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{eventType.icon}</span>
                      <span className="font-medium">{eventType.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{eventType.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {eventType.estimatedDuration}min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {eventType.defaultTasks.length} tasks
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventTypeSelector;
