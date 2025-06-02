
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Search, Filter } from 'lucide-react';

interface WorkOrderTrackerProps {
  onClose: () => void;
  onSelectWorkOrder: (workOrder: any) => void;
}

const WorkOrderTracker = ({ onClose, onSelectWorkOrder }: WorkOrderTrackerProps) => {
  const [filter, setFilter] = useState('all');
  
  const allWorkOrders = [
    {
      id: 'WO-544857',
      unit: '417',
      title: 'Dripping water faucet',
      description: 'Bathroom faucet dripping intermittently',
      category: 'Plumbing',
      priority: 'Medium',
      resident: 'Rumi Desai',
      phone: '(555) 123-4567',
      submitted: '2025-05-22T08:30:00Z',
      photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      status: 'Assigned',
      daysOpen: 3
    },
    {
      id: 'WO-547116',
      unit: '319-2',
      title: 'Towel rack came off wall',
      description: 'The towel rack came off the wall in the bathroom',
      category: 'Fixtures',
      priority: 'Low',
      resident: 'Francisco Giler',
      phone: '(555) 234-5678',
      submitted: '2025-05-09T14:15:00Z',
      photo: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400',
      status: 'In Progress',
      daysOpen: 8
    },
    {
      id: 'WO-548686',
      unit: '516',
      title: 'Window won\'t close properly',
      description: 'The balancer got stuck and window won\'t close',
      category: 'Windows',
      priority: 'High',
      resident: 'Kalyani Dronamraju',
      phone: '(555) 345-6789',
      submitted: '2025-05-14T11:20:00Z',
      photo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      status: 'Scheduled',
      daysOpen: 5
    },
    {
      id: 'WO-549123',
      unit: '203',
      title: 'AC not cooling properly',
      description: 'Air conditioning unit not maintaining temperature',
      category: 'HVAC',
      priority: 'High',
      resident: 'Sarah Johnson',
      phone: '(555) 456-7890',
      submitted: '2025-05-25T16:45:00Z',
      photo: 'https://images.unsplash.com/photo-1631545965036-ad75bab5b0ba?w=400',
      status: 'Assigned',
      daysOpen: 1
    },
    {
      id: 'WO-549456',
      unit: '721',
      title: 'Garbage disposal jammed',
      description: 'Kitchen garbage disposal making grinding noise and not working',
      category: 'Appliances',
      priority: 'Medium',
      resident: 'Mike Chen',
      phone: '(555) 567-8901',
      submitted: '2025-05-20T10:30:00Z',
      photo: 'https://images.unsplash.com/photo-1556909044-f6eeb0bbc096?w=400',
      status: 'Completed',
      daysOpen: 0
    }
  ];

  const filteredWorkOrders = allWorkOrders.filter(wo => {
    switch (filter) {
      case 'assigned': return wo.status === 'Assigned';
      case 'in-progress': return wo.status === 'In Progress';
      case 'scheduled': return wo.status === 'Scheduled';
      case 'completed': return wo.status === 'Completed';
      case 'high-priority': return wo.priority === 'High';
      default: return true;
    }
  });

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
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in progress': return 'bg-orange-100 text-orange-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterButtons = [
    { key: 'all', label: 'All', count: allWorkOrders.length },
    { key: 'assigned', label: 'Assigned', count: allWorkOrders.filter(w => w.status === 'Assigned').length },
    { key: 'in-progress', label: 'In Progress', count: allWorkOrders.filter(w => w.status === 'In Progress').length },
    { key: 'high-priority', label: 'High Priority', count: allWorkOrders.filter(w => w.priority === 'High').length }
  ];

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Work Order Tracker</h1>
            <p className="text-sm text-gray-600">{filteredWorkOrders.length} work orders</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex gap-2 overflow-x-auto">
          {filterButtons.map((btn) => (
            <Button
              key={btn.key}
              variant={filter === btn.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(btn.key)}
              className="whitespace-nowrap"
            >
              {btn.label}
              {btn.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {btn.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredWorkOrders.map((workOrder) => (
          <Card 
            key={workOrder.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectWorkOrder(workOrder)}
          >
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
                  
                  <h3 className="font-medium text-gray-900 mb-1">{workOrder.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{workOrder.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{workOrder.resident}</span>
                    <span>WO #{workOrder.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{workOrder.category}</span>
                    <span>{workOrder.daysOpen} days open</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredWorkOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No work orders found</div>
            <div className="text-sm text-gray-400">Try adjusting your filter</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrderTracker;
