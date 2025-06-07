import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, AlertTriangle, Clock, CheckCircle, User, Send, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkOrderTimelineProps {
  workOrder: any;
  onClose: () => void;
}

const WorkOrderTimeline = ({ workOrder, onClose }: WorkOrderTimelineProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [timeline, setTimeline] = useState(workOrder.timeline || []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newTimelineEntry = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'message',
      message: message.trim(),
      user: 'You'
    };

    // Add new entry to the beginning of the timeline
    setTimeline([newTimelineEntry, ...timeline]);
    setMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to maintenance",
    });
  };

  const handleSendNudge = () => {
    const newTimelineEntry = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'nudge',
      message: 'Gentle reminder sent to maintenance team',
      user: 'You'
    };

    // Add new entry to the beginning of the timeline
    setTimeline([newTimelineEntry, ...timeline]);
    
    toast({
      title: "Nudge Sent",
      description: "A gentle reminder has been sent to the maintenance team",
    });
  };

  const handleUrgentAlert = () => {
    const newTimelineEntry = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'urgent',
      message: 'Work order marked as URGENT priority',
      user: 'You'
    };

    // Add new entry to the beginning of the timeline
    setTimeline([newTimelineEntry, ...timeline]);
    
    toast({
      title: "Urgent Alert Sent",
      description: "This work order has been marked as urgent priority",
      variant: "destructive"
    });
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'submitted': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'assigned': return <User className="w-4 h-4 text-purple-600" />;
      case 'tech_note': return <MessageSquare className="w-4 h-4 text-gray-600" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'nudge': return <Bell className="w-4 h-4 text-yellow-600" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'submitted': return 'border-blue-200 bg-blue-50';
      case 'assigned': return 'border-purple-200 bg-purple-50';
      case 'tech_note': return 'border-gray-200 bg-gray-50';
      case 'scheduled': return 'border-blue-200 bg-blue-50';
      case 'in_progress': return 'border-orange-200 bg-orange-50';
      case 'completed': return 'border-green-200 bg-green-50';
      case 'message': return 'border-blue-200 bg-blue-50';
      case 'nudge': return 'border-yellow-200 bg-yellow-50';
      case 'urgent': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimelineDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Sort timeline to show most recent first (reverse chronological order)
  const sortedTimeline = [...timeline].sort((a, b) => {
    // First sort by date (most recent first)
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If same date, sort by time (most recent first)
    return b.time.localeCompare(a.time);
  });

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">#{workOrder.id}</h1>
            <p className="text-gray-600">{workOrder.title}</p>
          </div>
        </div>

        {/* Work Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={workOrder.photo} 
                  alt="Work order issue"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getPriorityColor(workOrder.priority)}>
                    {workOrder.priority}
                  </Badge>
                  <Badge className={getStatusColor(workOrder.status)}>
                    {workOrder.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{workOrder.title}</h3>
                <p className="text-gray-600 mb-2">{workOrder.description}</p>
                <div className="text-sm text-gray-500">
                  <span>Submitted: {formatTimelineDate(workOrder.submittedDate)}</span>
                  {workOrder.dueDate && (
                    <span className="ml-4">Due: {formatTimelineDate(workOrder.dueDate)}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleSendNudge}
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Send Nudge
          </Button>
          <Button
            variant="outline"
            onClick={handleUrgentAlert}
            className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4" />
            Mark Urgent
          </Button>
        </div>

        {/* Message Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Send Message to Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-full flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTimeline.map((entry, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${getTimelineColor(entry.type)}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getTimelineIcon(entry.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{entry.user}</span>
                        <span className="text-sm text-gray-500">
                          {formatTimelineDate(entry.date)} at {entry.time}
                        </span>
                      </div>
                      <p className="text-gray-700">{entry.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkOrderTimeline;
