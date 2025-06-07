
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Wrench, AlertTriangle, CheckCircle2, User, ArrowLeft } from 'lucide-react';

interface WorkOrderTrackerProps {
  onSelectWorkOrder?: (workOrder: any) => void;
  onViewDetails?: (workOrder: any) => void;
  onClose?: () => void;
}

const WorkOrderTracker = ({ onSelectWorkOrder, onViewDetails, onClose }: WorkOrderTrackerProps) => {
  const workOrderStats = {
    total: 24,
    urgent: 3,
    overdue: 2,
    completed: 8,
    inProgress: 6,
    assigned: 8
  };

  const recentWorkOrders = [
    {
      id: 'WO-544857',
      unit: '417',
      title: 'Dripping water faucet',
      category: 'Plumbing',
      priority: 'Medium',
      status: 'In Progress',
      assignedTo: 'Mike Rodriguez',
      daysOpen: 3,
      estimatedTime: '2 hours'
    },
    {
      id: 'WO-548686',
      unit: '516',
      title: 'Window won\'t close properly',
      category: 'Windows',
      priority: 'High',
      status: 'Assigned',
      assignedTo: 'Sarah Johnson',
      daysOpen: 5,
      estimatedTime: '3 hours'
    },
    {
      id: 'WO-547116',
      unit: '319-2',
      title: 'Towel rack came off wall',
      category: 'Fixtures',
      priority: 'Low',
      status: 'Scheduled',
      assignedTo: 'Mike Rodriguez',
      daysOpen: 8,
      estimatedTime: '1 hour'
    },
    {
      id: 'WO-549321',
      unit: '204',
      title: 'HVAC not cooling properly',
      category: 'HVAC',
      priority: 'Urgent',
      status: 'Overdue',
      assignedTo: 'James Wilson',
      daysOpen: 12,
      estimatedTime: '4 hours'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        {onClose && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Wrench className="text-orange-600" size={24} />
                  Work Orders Dashboard
                </h1>
                <p className="text-gray-600">Property-wide maintenance tracking</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-50">
              {workOrderStats.total} Total Orders
            </Badge>
          </div>
        )}

        {!onClose && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Work Orders Dashboard
            </h2>
            <Badge variant="outline" className="bg-orange-50" onClick={() => onViewDetails?.(recentWorkOrders[0])}>
              {workOrderStats.total} Total Orders
            </Badge>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails?.(recentWorkOrders[0])}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-5 h-5" />
                {workOrderStats.urgent}
              </div>
              <div className="text-sm text-gray-600">Urgent</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails?.(recentWorkOrders[0])}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <Clock className="w-5 h-5" />
                {workOrderStats.overdue}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails?.(recentWorkOrders[0])}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-5 h-5" />
                {workOrderStats.completed}
              </div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{workOrderStats.inProgress}</div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{workOrderStats.assigned}</div>
                <div className="text-xs text-gray-600">Assigned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-600">
                  {workOrderStats.total - workOrderStats.inProgress - workOrderStats.assigned - workOrderStats.completed}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Work Orders */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Recent Work Orders</h3>
          {recentWorkOrders.map((order) => (
            <Card 
              key={order.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectWorkOrder?.(order)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-gray-900">Unit {order.unit}</div>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{order.daysOpen} days open</div>
                </div>

                <h4 className="font-medium text-gray-900 mb-2">{order.title}</h4>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {order.assignedTo}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Est. {order.estimatedTime}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                    {order.category}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.(order);
                      }}
                    >
                      View Details
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Start Work
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderTracker;
