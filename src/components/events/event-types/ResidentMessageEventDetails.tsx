
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResidentMessageEventDetailsProps {
  event: any;
  userRole: string;
}

const ResidentMessageEventDetails = ({ event, userRole }: ResidentMessageEventDetailsProps) => {
  const { toast } = useToast();

  const messageDetails = {
    resident: 'Unit 5A Resident',
    subject: 'HVAC repair follow-up',
    priority: 'normal',
    category: 'Maintenance',
    received: '11:15 AM',
    status: 'pending'
  };

  const handleMarkResolved = () => {
    toast({
      title: "Message Resolved",
      description: "Resident message has been marked as resolved",
    });
  };

  const handleEscalate = () => {
    toast({
      title: "Message Escalated",
      description: "Message has been escalated to maintenance team",
    });
  };

  const canManageMessages = userRole === 'operator';

  return (
    <div className="p-6 space-y-6">
      {/* Event Summary */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center gap-3 mb-3">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Resident Message</h3>
          <Badge className="bg-purple-100 text-purple-800">Normal Priority</Badge>
        </div>
        <p className="text-sm text-purple-800 mb-3">
          Follow-up required for resident inquiry
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-purple-900">Unit:</span> {event.unit}
          </div>
          <div>
            <span className="font-medium text-purple-900">Category:</span> {messageDetails.category}
          </div>
          <div>
            <span className="font-medium text-purple-900">Received:</span> {messageDetails.received}
          </div>
          <div>
            <span className="font-medium text-purple-900">Status:</span> {messageDetails.status}
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Message Details
        </h4>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700">Subject:</span>
            <p className="text-sm text-gray-900">{messageDetails.subject}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Message:</span>
            <div className="bg-white p-3 rounded border text-sm text-gray-900 mt-1">
              "Hi, I wanted to follow up on the HVAC repair that was completed yesterday. 
              The unit is working much better now, but I'm still hearing some unusual sounds. 
              Could someone take a look when convenient? Thank you!"
            </div>
          </div>
        </div>
      </div>

      {/* Resident Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Resident Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Unit:</span> {event.unit}</div>
          <div><span className="font-medium">Building:</span> {event.building}</div>
          <div><span className="font-medium">Tenant:</span> Sarah Mitchell</div>
          <div><span className="font-medium">Phone:</span> (555) 345-6789</div>
          <div><span className="font-medium">Email:</span> sarah.mitchell@email.com</div>
          <div><span className="font-medium">Lease Status:</span> Active</div>
        </div>
      </div>

      {/* Related Work Orders */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-3">Related Work Orders</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">#WO-544857 - HVAC Repair</p>
              <p className="text-xs text-blue-700">Completed yesterday by Mike Rodriguez</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          </div>
        </div>
      </div>

      {/* Actions */}
      {canManageMessages && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleMarkResolved}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Resolved
          </Button>
          <Button variant="outline" onClick={handleEscalate}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Escalate to Maintenance
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResidentMessageEventDetails;
