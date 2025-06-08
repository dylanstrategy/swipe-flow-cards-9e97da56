import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, Home, FileText, Clock, User, Settings, LogOut } from 'lucide-react';
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

const Prospect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock prospect data
  const prospectInfo = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    status: 'Active',
    moveInDate: 'August 1, 2025',
    budget: '$1,500 - $2,000',
    preferredUnits: ['Studio', '1 Bedroom'],
    applicationStatus: 'In Review'
  };

  const scheduledTours = [
    {
      id: '1',
      date: 'June 10, 2025',
      time: '2:00 PM',
      unit: 'Studio-12',
      status: 'Scheduled'
    },
    {
      id: '2',
      date: 'June 12, 2025',
      time: '10:30 AM',
      unit: '1BR-15',
      status: 'Scheduled'
    }
  ];

  const availableUnits = [
    {
      id: '1',
      type: 'Studio',
      unit: 'Studio-12',
      rent: '$1,650',
      available: 'Available Now',
      sqft: '450 sq ft'
    },
    {
      id: '2',
      type: '1 Bedroom',
      unit: '1BR-15',
      rent: '$1,950',
      available: 'July 1, 2025',
      sqft: '650 sq ft'
    }
  ];

  const handleRoleSwitch = (role: string) => {
    switch (role) {
      case 'prospect':
        // Already in prospect view
        break;
      case 'resident':
        navigate('/resident');
        break;
      case 'operator':
        navigate('/operator');
        break;
      default:
        break;
    }
  };

  const handleScheduleTour = (unitId: string) => {
    toast({
      title: "Tour Request Sent",
      description: "Your tour request has been submitted. We'll contact you soon to confirm.",
    });
  };

  const handleApplyNow = (unitId: string) => {
    toast({
      title: "Application Started",
      description: "Redirecting to online application...",
    });
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
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {prospectInfo.name}</h1>
              <p className="text-gray-600">Find your perfect home with us</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-800">
              {prospectInfo.status} Prospect
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-purple-600 text-white font-semibold">
                      SJ
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
                    <p className="text-sm font-medium leading-none">{prospectInfo.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Prospect
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
                    className="cursor-pointer text-sm py-1 bg-purple-50 text-purple-700"
                    onClick={() => handleRoleSwitch('prospect')}
                  >
                    Prospect View (Current)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('resident')}
                  >
                    Resident View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('operator')}
                  >
                    Operator View
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tours">My Tours</TabsTrigger>
            <TabsTrigger value="units">Available Units</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{scheduledTours.length}</p>
                      <p className="text-sm text-gray-600">Scheduled Tours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Home className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{availableUnits.length}</p>
                      <p className="text-sm text-gray-600">Units Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">{prospectInfo.applicationStatus}</p>
                      <p className="text-sm text-gray-600">Application Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prospect Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Move-in Date</label>
                    <p className="text-gray-900">{prospectInfo.moveInDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Budget Range</label>
                    <p className="text-gray-900">{prospectInfo.budget}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Preferred Unit Types</label>
                    <p className="text-gray-900">{prospectInfo.preferredUnits.join(', ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact</label>
                    <p className="text-gray-900">{prospectInfo.email}</p>
                    <p className="text-gray-900">{prospectInfo.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tours */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tours</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduledTours.length > 0 ? (
                  <div className="space-y-3">
                    {scheduledTours.map((tour) => (
                      <div key={tour.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{tour.unit}</p>
                            <p className="text-sm text-gray-600">{tour.date} at {tour.time}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{tour.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No tours scheduled</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledTours.map((tour) => (
                    <div key={tour.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{tour.unit}</h3>
                          <p className="text-gray-600">{tour.date} at {tour.time}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Clock className="w-4 h-4 mr-2" />
                            Reschedule
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableUnits.map((unit) => (
                <Card key={unit.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{unit.unit}</CardTitle>
                      <Badge variant="outline">{unit.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-2xl font-bold text-green-600">{unit.rent}/month</p>
                      <p className="text-gray-600">{unit.sqft}</p>
                      <p className="text-sm text-gray-500">{unit.available}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => handleScheduleTour(unit.id)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Tour
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleApplyNow(unit.id)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Application Submitted</h3>
                      <p className="text-gray-600">Your application is currently under review</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      {prospectInfo.applicationStatus}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Required Documents</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Photo ID
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Proof of Income
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Bank Statements
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Next Steps</h4>
                      <p className="text-sm text-gray-600">
                        We'll review your application within 2-3 business days and contact you with next steps.
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Leasing Office
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Prospect;
