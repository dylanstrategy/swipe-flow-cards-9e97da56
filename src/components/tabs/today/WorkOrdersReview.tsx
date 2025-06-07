
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, User, Plus, Calendar, MapPin } from 'lucide-react';

interface WorkOrdersReviewProps {
  onCreateWorkOrder: () => void;
  onClose: () => void;
}

const WorkOrdersReview = ({ onCreateWorkOrder, onClose }: WorkOrdersReviewProps) => {
  // Sample pending work orders data - all for the same unit (resident's unit)
  const pendingWorkOrders = [
    {
      id: 'WO-544857',
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
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                My Work Orders
              </h1>
              <p className="text-gray-600">Apt 204 • {pendingWorkOrders.length} pending orders</p>
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

        {/* Work Orders List - Stacked Layout */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Work Orders</h2>
          
          {pendingWorkOrders.map((workOrder) => (
            <Card key={workOrder.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-0">
                {/* Main Work Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={workOrder.photo} 
                          alt="Work order issue"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-gray-900">#{workOrder.id}</span>
                          <Badge className={getPriorityColor(workOrder.priority)}>
                            {workOrder.priority}
                          </Badge>
                          <Badge className={getStatusColor(workOrder.status)}>
                            {workOrder.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{workOrder.title}</h3>
                        <p className="text-sm text-gray-600">{workOrder.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="p-4 bg-blue-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Calendar size={16} />
                        <span className="font-medium">{formatDate(workOrder.scheduledDate)}</span>
                        <span className="text-blue-600">at {workOrder.scheduledTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <User size={16} />
                        <span className="font-medium">{workOrder.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Notes */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-start gap-2">
                    <Wrench size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Tech Notes</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{workOrder.techNotes}</p>
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
