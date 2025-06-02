
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Phone, MapPin, Calendar, Clock, User } from 'lucide-react';

interface WorkOrderDetailTrackerProps {
  workOrder: any;
  onClose: () => void;
}

const WorkOrderDetailTracker = ({ workOrder, onClose }: WorkOrderDetailTrackerProps) => {
  // Sample work orders data similar to the spreadsheet
  const workOrders = [
    {
      wo: '544857',
      description: 'Dripping water out',
      callDate: '5/2/2025',
      property: '210',
      unit: '417',
      resident: 'Rumi Desai',
      phone: '',
      category: 'Bathroom',
      status: 'Scheduled',
      notes: '',
      daysPending: 30
    },
    {
      wo: '547116',
      description: 'The towel rack came',
      callDate: '5/9/2025',
      property: '210c',
      unit: '319-2',
      resident: 'Francisco Giler',
      phone: '',
      category: 'Bathroom',
      status: 'Scheduled',
      notes: '',
      daysPending: 23
    },
    {
      wo: '548686',
      description: 'The Balancer got ou',
      callDate: '5/14/2025',
      property: '210',
      unit: '516',
      resident: 'Kalyani Dronamraju',
      phone: '',
      category: 'Windows',
      status: 'Scheduled',
      notes: '',
      daysPending: 18
    },
    {
      wo: '548679',
      description: 'Ceiling Leak',
      callDate: '5/14/2025',
      property: '210',
      unit: '607',
      resident: 'Anil Tiwari',
      phone: '',
      category: 'Ceiling',
      status: 'Scheduled',
      notes: '',
      daysPending: 18
    },
    {
      wo: '548934',
      description: 'We have had this or',
      callDate: '5/15/2025',
      property: '210c',
      unit: '620-2',
      resident: 'David Gao',
      phone: '',
      category: 'Bathroom',
      status: 'Scheduled',
      notes: '',
      daysPending: 17
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Le Leo WO's</h1>
          <p className="text-gray-600">Work Order Management</p>
        </div>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Work Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-900 hover:bg-blue-900">
                  <TableHead className="text-white font-bold">WO#</TableHead>
                  <TableHead className="text-white font-bold">Brief Description</TableHead>
                  <TableHead className="text-white font-bold">Call Date</TableHead>
                  <TableHead className="text-white font-bold">Property</TableHead>
                  <TableHead className="text-white font-bold">Unit</TableHead>
                  <TableHead className="text-white font-bold">Resident</TableHead>
                  <TableHead className="text-white font-bold">Phone #</TableHead>
                  <TableHead className="text-white font-bold">Category</TableHead>
                  <TableHead className="text-white font-bold">Status</TableHead>
                  <TableHead className="text-white font-bold">Notes</TableHead>
                  <TableHead className="text-white font-bold">Days Pending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((wo) => (
                  <TableRow key={wo.wo} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{wo.wo}</TableCell>
                    <TableCell>{wo.description}</TableCell>
                    <TableCell>{wo.callDate}</TableCell>
                    <TableCell>{wo.property}</TableCell>
                    <TableCell className="font-medium">{wo.unit}</TableCell>
                    <TableCell>{wo.resident}</TableCell>
                    <TableCell>{wo.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {wo.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(wo.status)}>
                        {wo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{wo.notes}</TableCell>
                    <TableCell className="text-center font-medium">{wo.daysPending}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{workOrders.length}</div>
            <div className="text-sm text-gray-600">Total Work Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {workOrders.filter(wo => wo.daysPending > 20).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(workOrders.reduce((acc, wo) => acc + wo.daysPending, 0) / workOrders.length)}
            </div>
            <div className="text-sm text-gray-600">Avg Days Pending</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkOrderDetailTracker;
