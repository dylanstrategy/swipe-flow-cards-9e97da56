
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
    inProgress: 1,
    scheduled: 1,
    assigned: 1
  };

  const recentWorkOrders = [
    {
      id: 'WO-544857',
      unit: '417',
      title: 'Dripping water faucet',
      description: 'Bathroom faucet dripping intermittently',
      category: 'Plumbing',
      priority: 'Medium',
      status: 'Scheduled',
      assignedTo: 'Mike Rodriguez',
      resident: 'Rumi Desai',
      phone: '(555) 123-4567',
      daysOpen: 3,
      estimatedTime: '2 hours',
      submitted: '2025-05-22T08:30:00Z',
      photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      submittedDate: '2025-05-22',
      timeline: [
        {
          date: '2025-05-22',
          time: '08:30',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Rumi Desai'
        },
        {
          date: '2025-05-22',
          time: '09:15',
          type: 'assigned',
          message: 'Assigned to Mike Rodriguez',
          user: 'System'
        },
        {
          date: '2025-05-23',
          time: '10:00',
          type: 'scheduled',
          message: 'Scheduled for completion',
          user: 'Mike Rodriguez'
        }
      ]
    },
    {
      id: 'WO-548686',
      unit: '516',
      title: 'Window won\'t close properly',
      description: 'The balancer got stuck and window won\'t close',
      category: 'Windows',
      priority: 'High',
      status: 'Assigned',
      assignedTo: 'Sarah Johnson',
      resident: 'Kalyani Dronamraju',
      phone: '(555) 345-6789',
      daysOpen: 5,
      estimatedTime: '3 hours',
      submitted: '2025-05-14T11:20:00Z',
      photo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      submittedDate: '2025-05-14',
      timeline: [
        {
          date: '2025-05-14',
          time: '11:20',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Kalyani Dronamraju'
        },
        {
          date: '2025-05-14',
          time: '14:30',
          type: 'assigned',
          message: 'Assigned to Sarah Johnson',
          user: 'System'
        }
      ]
    },
    {
      id: 'WO-547116',
      unit: '319-2',
      title: 'Towel rack came off wall',
      description: 'The towel rack came off the wall in the bathroom',
      category: 'Fixtures',
      priority: 'Low',
      status: 'In Progress',
      assignedTo: 'Mike Rodriguez',
      resident: 'Francisco Giler',
      phone: '(555) 234-5678',
      daysOpen: 8,
      estimatedTime: '1 hour',
      submitted: '2025-05-09T14:15:00Z',
      photo: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400',
      submittedDate: '2025-05-09',
      timeline: [
        {
          date: '2025-05-09',
          time: '14:15',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Francisco Giler'
        },
        {
          date: '2025-05-09',
          time: '16:45',
          type: 'assigned',
          message: 'Assigned to Mike Rodriguez',
          user: 'System'
        },
        {
          date: '2025-05-10',
          time: '09:00',
          type: 'in_progress',
          message: 'Work started on site',
          user: 'Mike Rodriguez'
        }
      ]
    },
    {
      id: 'WO-549321',
      unit: '204',
      title: 'HVAC not cooling properly',
      description: 'Air conditioning unit not providing adequate cooling',
      category: 'HVAC',
      priority: 'Urgent',
      status: 'Overdue',
      assignedTo: 'James Wilson',
      resident: 'Alex Thompson',
      phone: '(555) 456-7890',
      daysOpen: 12,
      estimatedTime: '4 hours',
      submitted: '2025-05-01T09:00:00Z',
      photo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      submittedDate: '2025-05-01',
      dueDate: '2025-05-03',
      timeline: [
        {
          date: '2025-05-01',
          time: '09:00',
          type: 'submitted',
          message: 'Work order submitted by resident',
          user: 'Alex Thompson'
        },
        {
          date: '2025-05-01',
          time: '10:30',
          type: 'assigned',
          message: 'Assigned to James Wilson',
          user: 'System'
        },
        {
          date: '2025-05-02',
          time: '15:20',
          type: 'tech_note',
          message: 'Parts needed - ordering replacement compressor',
          user: 'James Wilson'
        }
      ]
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
                  Property Work Orders
                </h1>
                <p className="text-gray-600">The Meridian • {workOrderStats.total} pending orders</p>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              + Create New
            </Button>
          </div>
        )}

        {!onClose && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Property Work Orders
            </h2>
            <Badge variant="outline" className="bg-orange-50">
              {workOrderStats.total} Total Orders
            </Badge>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
                {workOrderStats.inProgress}
              </div>
              <div className="text-xs text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-blue-600 flex items-center justify-center gap-1">
                {workOrderStats.scheduled}
              </div>
              <div className="text-xs text-gray-600">Scheduled</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-purple-600 flex items-center justify-center gap-1">
                {workOrderStats.assigned}
              </div>
              <div className="text-xs text-gray-600">Assigned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {workOrderStats.completed}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Work Orders */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Pending Work Orders</h3>
          {recentWorkOrders.map((order) => (
            <Card 
              key={order.id} 
              className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500"
              onClick={() => onViewDetails?.(order)}
            >
              <CardContent className="p-0">
                <div className="flex items-start p-4">
                  {/* Work Order Photo */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mr-4">
                    <img 
                      src={order.photo} 
                      alt="Work order issue"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Work Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-gray-900">
                        #{order.id}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Unit {order.unit} - {order.title}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {order.description}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {order.assignedTo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Est. {order.estimatedTime}
                        </span>
                      </div>
                      <span>{order.daysOpen} days open</span>
                    </div>
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
