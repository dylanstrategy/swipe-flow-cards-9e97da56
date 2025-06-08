
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Clock, CheckCircle, AlertTriangle, Home, User, Settings, LogOut, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Vendor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock vendor data
  const vendorInfo = {
    name: 'Mike Rodriguez',
    company: 'Elite HVAC Services',
    specialty: 'HVAC & Electrical',
    phone: '(555) 234-5678',
    email: 'mike@elitehvac.com',
    rating: 4.8,
    completedJobs: 156
  };

  const workOrders = [
    {
      id: 'WO-001',
      property: 'The Meridian',
      unit: 'Apt 204',
      type: 'HVAC Repair',
      priority: 'High',
      status: 'Assigned',
      scheduledDate: 'June 10, 2025',
      scheduledTime: '2:00 PM',
      description: 'AC unit not cooling properly, tenant reports warm air',
      estimatedDuration: '2 hours'
    },
    {
      id: 'WO-002',
      property: 'The Meridian',
      unit: 'Apt 156',
      type: 'Electrical',
      priority: 'Medium',
      status: 'In Progress',
      scheduledDate: 'June 9, 2025',
      scheduledTime: '10:00 AM',
      description: 'Kitchen outlet not working',
      estimatedDuration: '1 hour'
    },
    {
      id: 'WO-003',
      property: 'The Meridian',
      unit: 'Apt 301',
      type: 'HVAC Maintenance',
      priority: 'Low',
      status: 'Completed',
      scheduledDate: 'June 8, 2025',
      scheduledTime: '9:00 AM',
      description: 'Quarterly HVAC system maintenance check',
      estimatedDuration: '1.5 hours'
    }
  ];

  const handleRoleSwitch = (role: string) => {
    switch (role) {
      case 'prospect':
        navigate('/prospect');
        break;
      case 'resident':
        navigate('/resident');
        break;
      case 'operator':
        navigate('/operator');
        break;
      case 'leasing':
        navigate('/leasing');
        break;
      case 'vendor':
        // Already in vendor view
        break;
      default:
        break;
    }
  };

  const handleUpdateStatus = (workOrderId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Work order ${workOrderId} status updated to ${newStatus}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Assigned':
        return <Clock className="w-4 h-4" />;
      case 'In Progress':
        return <Wrench className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Back to Home"
            >
              <Home size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Portal</h1>
              <p className="text-gray-600">{vendorInfo.company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-gray-100 text-gray-800">
              Vendor
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-gray-600 text-white font-semibold">
                      MR
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white border shadow-lg z-[100]"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{vendorInfo.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {vendorInfo.company}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Setup</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Role</span>
                </DropdownMenuItem>
                
                {/* Role submenu items */}
                <div className="ml-6 space-y-1 border-l border-gray-200 pl-2">
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('prospect')}
                  >
                    Prospect View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('resident')}
                  >
                    Resident View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('leasing')}
                  >
                    Leasing View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('operator')}
                  >
                    Operator View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1 bg-gray-50 text-gray-700"
                    onClick={() => handleRoleSwitch('vendor')}
                  >
                    Vendor View (Current)
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workorders">Work Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{workOrders.filter(wo => wo.status === 'Assigned').length}</p>
                      <p className="text-sm text-gray-600">Assigned Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{workOrders.filter(wo => wo.status === 'In Progress').length}</p>
                      <p className="text-sm text-gray-600">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{vendorInfo.completedJobs}</p>
                      <p className="text-sm text-gray-600">Total Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workOrders.filter(wo => wo.status !== 'Completed').slice(0, 2).map((workOrder) => (
                    <div key={workOrder.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(workOrder.status)}
                        <div>
                          <p className="font-medium">{workOrder.type} - {workOrder.unit}</p>
                          <p className="text-sm text-gray-600">{workOrder.scheduledTime}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(workOrder.priority)}>
                        {workOrder.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workorders" className="space-y-6">
            <div className="space-y-4">
              {workOrders.map((workOrder) => (
                <Card key={workOrder.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{workOrder.id}</h3>
                          <Badge className={getStatusColor(workOrder.status)}>
                            {getStatusIcon(workOrder.status)}
                            <span className="ml-1">{workOrder.status}</span>
                          </Badge>
                          <Badge className={getPriorityColor(workOrder.priority)}>
                            {workOrder.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div><strong>Property:</strong> {workOrder.property}</div>
                          <div><strong>Unit:</strong> {workOrder.unit}</div>
                          <div><strong>Type:</strong> {workOrder.type}</div>
                          <div><strong>Duration:</strong> {workOrder.estimatedDuration}</div>
                          <div><strong>Date:</strong> {workOrder.scheduledDate}</div>
                          <div><strong>Time:</strong> {workOrder.scheduledTime}</div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{workOrder.description}</p>
                        
                        {workOrder.status !== 'Completed' && (
                          <div className="flex gap-2">
                            {workOrder.status === 'Assigned' && (
                              <Button 
                                size="sm"
                                onClick={() => handleUpdateStatus(workOrder.id, 'In Progress')}
                              >
                                Start Work
                              </Button>
                            )}
                            {workOrder.status === 'In Progress' && (
                              <Button 
                                size="sm"
                                onClick={() => handleUpdateStatus(workOrder.id, 'Completed')}
                              >
                                Mark Complete
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              Add Note
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{vendorInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <p className="text-gray-900">{vendorInfo.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Specialty</label>
                    <p className="text-gray-900">{vendorInfo.specialty}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rating</label>
                    <p className="text-gray-900">{vendorInfo.rating}/5.0 ⭐</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{vendorInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{vendorInfo.email}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Jobs Completed</span>
                    <span className="text-2xl font-bold text-green-600">{vendorInfo.completedJobs}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Vendor;
