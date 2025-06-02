
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUp } from 'lucide-react';

interface WorkOrderDetailsStepProps {
  workOrder: any;
}

const WorkOrderDetailsStep = ({ workOrder }: WorkOrderDetailsStepProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Work Order Header with Image */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop&crop=center" 
              alt="Work order"
              className="w-12 h-12 rounded object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Work Order #{workOrder.id}</h2>
            <p className="text-orange-100 text-sm">
              Review the details and proceed with the work order
            </p>
          </div>
        </div>
      </div>

      {/* Original Issue Photo */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Issue Reported</h3>
        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-3">
          <img 
            src={workOrder.photo} 
            alt="Reported issue"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-gray-700">{workOrder.description}</p>
      </div>

      {/* Work Order Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Unit:</span>
            <span className="font-medium ml-2">{workOrder.unit}</span>
          </div>
          <div>
            <span className="text-gray-600">Resident:</span>
            <span className="font-medium ml-2">{workOrder.resident}</span>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <span className="font-medium ml-2">{workOrder.category}</span>
          </div>
          <div>
            <span className="text-gray-600">Priority:</span>
            <Badge className={`ml-2 ${getPriorityColor(workOrder.priority)}`}>
              {workOrder.priority}
            </Badge>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Swipe up to proceed to diagnosis</p>
        <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
      </div>
    </div>
  );
};

export default WorkOrderDetailsStep;
