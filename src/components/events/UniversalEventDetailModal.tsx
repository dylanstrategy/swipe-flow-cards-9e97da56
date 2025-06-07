
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      description: `Message sent regarding ${event.title}`,
    });
    
    setMessageText('');
    setActiveTab('timeline');
  };

  const renderEventDetails = () => {
    switch (event.type) {
      case 'move-in':
        return <MoveInEventDetails event={event} userRole={userRole} />;
      case 'lease':
        return <LeaseSigningEventDetails event={event} userRole={userRole} />;
      case 'message':
        return <ResidentMessageEventDetails event={event} userRole={userRole} />;
      case 'tour':
        return <TourEventDetails event={event} userRole={userRole} />;
      case 'move-out':
        return <MoveOutEventDetails event={event} userRole={userRole} />;
      case 'payment':
        return <PaymentEventDetails event={event} userRole={userRole} />;
      case 'maintenance':
        return <WorkOrderEventDetails event={event} userRole={userRole} />;
      default:
        return <div className="p-4 text-gray-500">Event details not available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>
                <p className="text-sm text-gray-600">{event.time} • {event.building} {event.unit}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getEventTypeColor(event.type)}>
              {event.type === 'maintenance' ? 'Work Order' : event.type.replace('-', ' ')}
            </Badge>
            <Badge className={getPriorityColor(event.priority, event.status)}>
              {event.status === 'urgent' ? 'URGENT' : event.priority?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
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

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && renderEventDetails()}
          
          {activeTab === 'message' && (
            <EventMessaging
              event={event}
              messageText={messageText}
              setMessageText={setMessageText}
              onSendMessage={handleSendMessage}
              userRole={userRole}
            />
          )}
          
          {activeTab === 'timeline' && (
            <EventTimeline event={event} userRole={userRole} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalEventDetailModal;
