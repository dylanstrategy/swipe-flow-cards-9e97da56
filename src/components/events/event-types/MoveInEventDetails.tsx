
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, User, Home, FileText, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoveInEventDetailsProps {
  event: any;
  userRole: string;
}

const MoveInEventDetails = ({ event, userRole }: MoveInEventDetailsProps) => {
  const { toast } = useToast();

  const moveInTasks = [
    { id: 1, title: 'Pre-inspection completed', completed: true, assignee: 'Mike Rodriguez' },
    { id: 2, title: 'Keys prepared', completed: true, assignee: 'Leasing Office' },
    { id: 3, title: 'Welcome packet ready', completed: false, assignee: 'Property Manager' },
    { id: 4, title: 'Unit walkthrough', completed: false, assignee: 'Mike Rodriguez' },
    { id: 5, title: 'Key handover', completed: false, assignee: 'Leasing Office' }
  ];

  const residentInfo = {
    name: 'Sarah Johnson',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@email.com',
    moveInDate: 'June 7, 2025',
    leaseStart: 'June 7, 2025',
    rent: '$1,850/month'
  };

  const handleTaskComplete = (taskId: number) => {
    toast({
      title: "Task Completed",
      description: "Move-in task has been marked as complete",
    });
  };

  const handleReschedule = () => {
    toast({
      title: "Reschedule Request",
      description: "Move-in inspection reschedule request sent",
    });
  };

  const canManageTasks = userRole === 'operator';

  return (
    <div className="p-6 space-y-6">
      {/* Event Summary */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <Home className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Move-In Inspection</h3>
          <Badge className="bg-green-100 text-green-800">High Priority</Badge>
        </div>
        <p className="text-sm text-green-800 mb-3">
          Pre-move-in inspection and key handover for new resident
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-green-900">Unit:</span> {event.unit}
          </div>
          <div>
            <span className="font-medium text-green-900">Building:</span> {event.building}
          </div>
          <div>
            <span className="font-medium text-green-900">Time:</span> {event.time}
          </div>
          <div>
            <span className="font-medium text-green-900">Duration:</span> 60 minutes
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
          <div><span className="font-medium">Name:</span> {residentInfo.name}</div>
          <div><span className="font-medium">Phone:</span> {residentInfo.phone}</div>
          <div><span className="font-medium">Email:</span> {residentInfo.email}</div>
          <div><span className="font-medium">Move-in Date:</span> {residentInfo.moveInDate}</div>
          <div><span className="font-medium">Lease Start:</span> {residentInfo.leaseStart}</div>
          <div><span className="font-medium">Monthly Rent:</span> {residentInfo.rent}</div>
        </div>
      </div>

      {/* Move-In Checklist */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Move-In Checklist
        </h4>
        
        <div className="space-y-3">
          {moveInTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                }`}>
                  {task.completed && <CheckCircle className="w-3 h-3" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">Assigned to: {task.assignee}</p>
                </div>
              </div>
              
              {!task.completed && canManageTasks && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTaskComplete(task.id)}
                >
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {canManageTasks && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Key className="w-4 h-4 mr-2" />
            Begin Inspection
          </Button>
          <Button variant="outline" onClick={handleReschedule}>
            <Clock className="w-4 h-4 mr-2" />
            Reschedule
          </Button>
        </div>
      )}
    </div>
  );
};

export default MoveInEventDetails;
