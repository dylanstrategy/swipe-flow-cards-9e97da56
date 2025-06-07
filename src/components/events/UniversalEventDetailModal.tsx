import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MessageSquare, Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MoveInEventDetails from './event-types/MoveInEventDetails';
import LeaseSigningEventDetails from './event-types/LeaseSigningEventDetails';
import ResidentMessageEventDetails from './event-types/ResidentMessageEventDetails';
import TourEventDetails from './event-types/TourEventDetails';
import MoveOutEventDetails from './event-types/MoveOutEventDetails';
import PaymentEventDetails from './event-types/PaymentEventDetails';
import WorkOrderEventDetails from './event-types/WorkOrderEventDetails';
import EventMessaging from './EventMessaging';
import EventTimeline from './EventTimeline';

interface UniversalEventDetailModalProps {
  event: any;
  onClose: () => void;
  userRole?: 'operator' | 'maintenance' | 'resident';
}

const UniversalEventDetailModal = ({ event, onClose, userRole = 'operator' }: UniversalEventDetailModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'message' | 'timeline'>('details');
  const [messageText, setMessageText] = useState('');
  const [currentEvent, setCurrentEvent] = useState(event);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'move-in': return '🏠';
      case 'move-out': return '📦';
      case 'lease': return '📄';
      case 'message': return '💬';
      case 'tour': return '👀';
      case 'payment': return '💳';
      case 'maintenance': return '🔧';
      default: return '📅';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'move-in': return 'bg-green-100 text-green-800 border-green-200';
      case 'move-out': return 'bg-red-100 text-red-800 border-red-200';
      case 'lease': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'message': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tour': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string, status?: string) => {
    if (status === 'urgent') return 'bg-red-100 text-red-800 border-red-200';
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message Sent",
      description: `Message sent regarding ${currentEvent.title}`,
    });
    
    setMessageText('');
    setActiveTab('timeline');
  };

  const handleWorkOrderNudge = (updatedEvent: any) => {
    setCurrentEvent(updatedEvent);
    setActiveTab('timeline');
  };

  const handleWorkOrderUrgent = (updatedEvent: any) => {
    setCurrentEvent(updatedEvent);
    setActiveTab('timeline');
  };

  const handleWorkOrderCancel = (updatedEvent: any) => {
    setCurrentEvent(updatedEvent);
    setActiveTab('timeline');
  };

  const renderEventDetails = () => {
    switch (currentEvent.type) {
      case 'move-in':
        return <MoveInEventDetails event={currentEvent} userRole={userRole} />;
      case 'lease':
        return <LeaseSigningEventDetails event={currentEvent} userRole={userRole} />;
      case 'message':
        return <ResidentMessageEventDetails event={currentEvent} userRole={userRole} />;
      case 'tour':
        return <TourEventDetails event={currentEvent} userRole={userRole} />;
      case 'move-out':
        return <MoveOutEventDetails event={currentEvent} userRole={userRole} />;
      case 'payment':
        return <PaymentEventDetails event={currentEvent} userRole={userRole} />;
      case 'maintenance':
        return (
          <WorkOrderEventDetails 
            event={currentEvent} 
            userRole={userRole}
            onNudgeSent={handleWorkOrderNudge}
            onMarkUrgent={handleWorkOrderUrgent}
            onCancel={handleWorkOrderCancel}
          />
        );
      default:
        return <div className="p-4 text-gray-500">Event details not available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-2xl flex-shrink-0">{getEventTypeIcon(currentEvent.type)}</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{currentEvent.title}</h2>
                <p className="text-sm text-gray-600 truncate">{currentEvent.time} • {currentEvent.building} {currentEvent.unit}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Badge className={getEventTypeColor(currentEvent.type)}>
              {currentEvent.type === 'maintenance' ? 'Work Order' : currentEvent.type.replace('-', ' ')}
            </Badge>
            <Badge className={getPriorityColor(currentEvent.priority, currentEvent.status)}>
              {currentEvent.status === 'urgent' ? 'URGENT' : currentEvent.priority?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'message'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Message
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Content with ScrollArea */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="h-full">
              {activeTab === 'details' && renderEventDetails()}
              
              {activeTab === 'message' && (
                <EventMessaging
                  event={currentEvent}
                  messageText={messageText}
                  setMessageText={setMessageText}
                  onSendMessage={handleSendMessage}
                  userRole={userRole}
                />
              )}
              
              {activeTab === 'timeline' && (
                <EventTimeline event={currentEvent} userRole={userRole} />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default UniversalEventDetailModal;
