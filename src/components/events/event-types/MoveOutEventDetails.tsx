
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, User, Clock, FileText, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoveOutEventDetailsProps {
  event: any;
  userRole: string;
}

const MoveOutEventDetails = ({ event, userRole }: MoveOutEventDetailsProps) => {
  const { toast } = useToast();

  const moveOutInfo = {
    resident: 'Unit 1A Resident',
    moveOutDate: 'June 15, 2025',
    noticeDate: 'May 15, 2025',
    leaseEnd: 'June 30, 2025',
    deposit: '$1,200',
    finalRent: 'Paid through June'
  };

  const handleProcessNotice = () => {
    toast({
      title: "Notice Processed",
      description: "Move-out notice has been officially processed",
    });
  };

  const handleScheduleInspection = () => {
    toast({
      title: "Inspection Scheduled",
      description: "Move-out inspection has been scheduled",
    });
  };

  const canManageMoveOuts = userRole === 'operator';

  return (
    <div className="p-6 space-y-6">
      {/* Event Summary */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center gap-3 mb-3">
          <Home className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Move-Out Notice</h3>
          <Badge className="bg-red-100 text-red-800">Medium Priority</Badge>
        </div>
        <p className="text-sm text-red-800 mb-3">
          Processing move-out notice and scheduling final inspection
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-red-900">Unit:</span> {event.unit}
          </div>
          <div>
            <span className="font-medium text-red-900">Building:</span> {event.building}
          </div>
          <div>
            <span className="font-medium text-red-900">Notice Date:</span> {moveOutInfo.noticeDate}
          </div>
          <div>
            <span className="font-medium text-red-900">Move-Out Date:</span> {moveOutInfo.moveOutDate}
          </div>
        </div>
      </div>

      {/* Move-Out Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Move-Out Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Resident:</span> Jennifer Adams</div>
          <div><span className="font-medium">Lease End:</span> {moveOutInfo.leaseEnd}</div>
          <div><span className="font-medium">Notice Period:</span> 30 days</div>
          <div><span className="font-medium">Deposit:</span> {moveOutInfo.deposit}</div>
          <div><span className="font-medium">Rent Status:</span> {moveOutInfo.finalRent}</div>
          <div><span className="font-medium">Forwarding Address:</span> Not provided</div>
        </div>
      </div>

      {/* Move-Out Checklist */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Move-Out Process</h4>
        <div className="space-y-3">
          {[
            { task: 'Notice received and acknowledged', completed: true },
            { task: 'Notice processing in progress', completed: false },
            { task: 'Final inspection scheduled', completed: false },
            { task: 'Deposit assessment', completed: false },
            { task: 'Final walkthrough', completed: false },
            { task: 'Key return', completed: false }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-4 h-4 rounded-full ${
                item.completed ? 'bg-green-600' : 'bg-gray-300'
              }`}></div>
              <span className={`text-sm ${
                item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Financial Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Security Deposit:</span> $1,200</div>
          <div><span className="font-medium">Last Month Rent:</span> Paid</div>
          <div><span className="font-medium">Outstanding Balance:</span> $0</div>
          <div><span className="font-medium">Estimated Return:</span> TBD after inspection</div>
        </div>
      </div>

      {/* Actions */}
      {canManageMoveOuts && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleProcessNotice}>
            <FileText className="w-4 h-4 mr-2" />
            Process Notice
          </Button>
          <Button variant="outline" onClick={handleScheduleInspection}>
            <Clock className="w-4 h-4 mr-2" />
            Schedule Inspection
          </Button>
        </div>
      )}
    </div>
  );
};

export default MoveOutEventDetails;
