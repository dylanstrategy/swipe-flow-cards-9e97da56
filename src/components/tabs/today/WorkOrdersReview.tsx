
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, User, Plus, Calendar } from 'lucide-react';

interface WorkOrdersReviewProps {
  onCreateWorkOrder: () => void;
  onClose: () => void;
}

const WorkOrdersReview = ({ onCreateWorkOrder, onClose }: WorkOrdersReviewProps) => {
  // Sample pending work orders data
  const pendingWorkOrders = [
    {
      id: 'WO-544857',
      unit: '417',
      title: 'Dripping water faucet',
      description: 'Bathroom faucet dripping intermittently',
      priority: 'Medium',
      scheduledDate: '2025-06-03',
      scheduledTime: '10:00 AM',
      assignedTo: 'Mike Rodriguez',
      techNotes: 'Replacement parts ordered. Will need to shut off water for 30 minutes.',
      status: 'Scheduled',
      photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400'
    },
    {
      id: 'WO-548686',
      unit: '516',
      title: 'Window won\'t close properly',
      description: 'The balancer got stuck and window won\'t close',
      priority: 'High',
      scheduledDate: '2025-06-02',
      scheduledTime: '2:00 PM',
      assignedTo: 'Sarah Johnson',
      techNotes: 'Window hardware inspection needed. May require balancer replacement.',
      status: 'In Progress',
      photo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    },
    {
      id: 'WO-547116',
      unit: '319-2',
      title: 'Towel rack came off wall',
      description: 'The towel rack came off the wall in the bathroom',
      priority: 'Low',
      scheduledDate: '2025-06-04',
      scheduledTime: '9:00 AM',
      assignedTo: 'Mike Rodriguez',
      techNotes: 'Wall anchor failed. Need to patch and reinstall with proper anchors.',
      status: 'Assigned',
      photo: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-orange-100 text-orange-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Wrench className="text-purple-600" size={24} />
                Work Orders
              </h1>
              <p className="text-gray-600">{pendingWorkOrders.length} pending orders</p>
            </div>
          </div>
          
          <Button
            onClick={onCreateWorkOrder}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus size={16} />
            Create New
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">1</div>
              <div className="text-sm text-gray-600">Assigned</div>
            </CardContent>
          </Card>
        </div>

        {/* Work Orders List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Work Orders</h2>
          
          {pendingWorkOrders.map((workOrder) => (
            <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Work Order Photo */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={workOrder.photo} 
                      alt="Work order issue"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Work Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">Unit {workOrder.unit}</span>
                        <Badge className={getPriorityColor(workOrder.priority)}>
                          {workOrder.priority}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(workOrder.status)}>
                        {workOrder.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2">{workOrder.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{workOrder.description}</p>
                    
                    {/* Schedule Info */}
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Calendar size={14} />
                        <span>{formatDate(workOrder.scheduledDate)} at {workOrder.scheduledTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <User size={14} />
                        <span>{workOrder.assignedTo}</span>
                      </div>
                    </div>
                    
                    {/* Tech Notes */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Wrench size={12} />
                        Tech Notes
                      </div>
                      <p className="text-xs text-gray-600">{workOrder.techNotes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={onCreateWorkOrder}
            >
              <Plus size={16} className="mr-2" />
              Create Work Order
            </Button>
            <Button
              variant="outline"
              className="justify-start"
            >
              <Clock size={16} className="mr-2" />
              View Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrdersReview;
