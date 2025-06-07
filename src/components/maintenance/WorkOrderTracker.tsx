import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Wrench, AlertTriangle, CheckCircle2, User, ArrowLeft, Phone, Calendar, MapPin, Camera } from 'lucide-react';
import WorkOrderTimeline from './WorkOrderTimeline';

interface WorkOrderTrackerProps {
  onSelectWorkOrder?: (workOrder: any) => void;
  onViewDetails?: (workOrder: any) => void;
  onClose?: () => void;
}

const WorkOrderTracker = ({ onSelectWorkOrder, onViewDetails, onClose }: WorkOrderTrackerProps) => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);

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
      dueDate: '2025-06-04',
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
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-600 text-white';
      case 'in progress': return 'bg-blue-600 text-white';
      case 'assigned': return 'bg-purple-600 text-white';
      case 'scheduled': return 'bg-indigo-600 text-white';
      case 'overdue': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handleWorkOrderClick = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
  };

  // If a work order is selected, show the timeline
  if (selectedWorkOrder) {
    return (
      <WorkOrderTimeline
        workOrder={selectedWorkOrder}
        onClose={() => setSelectedWorkOrder(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Header */}
        {onClose && (
          <div className="flex items-center mb-6">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Wrench className="text-orange-600" size={20} />
                Work Orders
              </h1>
              <p className="text-sm text-gray-600">{workOrderStats.total} pending orders</p>
            </div>
          </div>
        )}

        {!onClose && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Work Orders
            </h2>
            <Badge variant="outline" className="bg-orange-50">
              {workOrderStats.total} Total Orders
            </Badge>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-orange-600">{workOrderStats.inProgress}</div>
              <div className="text-xs text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-blue-600">{workOrderStats.scheduled}</div>
              <div className="text-xs text-gray-600">Scheduled</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-purple-600">{workOrderStats.assigned}</div>
              <div className="text-xs text-gray-600">Assigned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {workOrderStats.completed}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Work Orders List */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">Pending Work Orders</h3>
          {recentWorkOrders.map((order) => (
            <Card 
              key={order.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleWorkOrderClick(order)}
            >
              <CardContent className="p-0">
                {/* Priority Strip */}
                <div className={`h-1 w-full ${
                  order.priority.toLowerCase() === 'urgent' ? 'bg-red-500' :
                  order.priority.toLowerCase() === 'high' ? 'bg-orange-500' :
                  order.priority.toLowerCase() === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></div>
                
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                        <Badge className={`${getPriorityColor(order.priority)} text-xs px-2 py-0.5`}>
                          {order.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-0.5`}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ml-3">
                      <img 
                        src={order.photo} 
                        alt="Issue"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Title and Description */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      Unit {order.unit} - {order.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                      {order.description}
                    </p>
                  </div>
                  
                  {/* Resident Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">{order.resident}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{order.phone}</span>
                    </div>
                  </div>
                  
                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-700 font-medium">{order.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-green-500" />
                        <span className="text-gray-600">{order.estimatedTime}</span>
                      </div>
                      <span className="text-red-600 font-bold">{order.daysOpen}d</span>
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
