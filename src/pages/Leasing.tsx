
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, Home, Users, DollarSign, Clock, User, Settings, LogOut, Phone, Mail } from 'lucide-react';
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

const Leasing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock leasing data
  const leasingStats = {
    name: 'Jennifer Martinez',
    role: 'Leasing Manager',
    property: 'The Meridian Apartments',
    activeProspects: 12,
    scheduledTours: 8,
    applicationsToReview: 5,
    unitsAvailable: 15
  };

  const prospects = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'Tour Scheduled',
      tourDate: 'June 10, 2025',
      preferredUnit: 'Studio',
      budget: '$1,500 - $2,000'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 987-6543',
      status: 'Application Submitted',
      tourDate: 'Completed',
      preferredUnit: '1 Bedroom',
      budget: '$1,800 - $2,200'
    }
  ];

  const availableUnits = [
    {
      id: '1',
      unit: 'Studio-12',
      type: 'Studio',
      rent: '$1,650',
      sqft: '450 sq ft',
      available: 'Available Now',
      status: 'Ready'
    },
    {
      id: '2',
      unit: '1BR-15',
      type: '1 Bedroom',
      rent: '$1,950',
      sqft: '650 sq ft',
      available: 'July 1, 2025',
      status: 'Turnover'
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
        // Already in leasing view
        break;
      case 'vendor':
        navigate('/vendor');
        break;
      default:
        break;
    }
  };

  const handleContactProspect = (prospectId: string) => {
    toast({
      title: "Contact Initiated",
      description: "Opening communication channel with prospect.",
    });
  };

  const handleScheduleTour = (unitId: string) => {
    toast({
      title: "Tour Scheduled",
      description: "Tour has been added to the calendar.",
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
              <h1 className="text-2xl font-bold text-gray-900">Leasing Dashboard</h1>
              <p className="text-gray-600">{leasingStats.property}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-orange-100 text-orange-800">
              Leasing Manager
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-orange-600 text-white font-semibold">
                      JM
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
                    <p className="text-sm font-medium leading-none">{leasingStats.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {leasingStats.role}
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
                    className="cursor-pointer text-sm py-1 bg-orange-50 text-orange-700"
                    onClick={() => handleRoleSwitch('leasing')}
                  >
                    Leasing View (Current)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('operator')}
                  >
                    Operator View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-sm py-1"
                    onClick={() => handleRoleSwitch('vendor')}
                  >
                    Vendor View
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
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{leasingStats.activeProspects}</p>
                      <p className="text-sm text-gray-600">Active Prospects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{leasingStats.scheduledTours}</p>
                      <p className="text-sm text-gray-600">Scheduled Tours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{leasingStats.applicationsToReview}</p>
                      <p className="text-sm text-gray-600">Applications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Home className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{leasingStats.unitsAvailable}</p>
                      <p className="text-sm text-gray-600">Available Units</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Prospects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Prospects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prospects.slice(0, 3).map((prospect) => (
                    <div key={prospect.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{prospect.name}</p>
                          <p className="text-sm text-gray-600">{prospect.status}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{prospect.preferredUnit}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-6">
            <div className="space-y-4">
              {prospects.map((prospect) => (
                <Card key={prospect.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{prospect.name}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {prospect.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {prospect.phone}
                          </div>
                          <div>Budget: {prospect.budget}</div>
                          <div>Preferred: {prospect.preferredUnit}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={prospect.status === 'Tour Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {prospect.status}
                        </Badge>
                        <Button 
                          size="sm"
                          onClick={() => handleContactProspect(prospect.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                      <Badge className={unit.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {unit.status}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleScheduleTour(unit.id)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Tour
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Sarah Johnson - Studio-12</h3>
                        <p className="text-gray-600">2:00 PM - 2:30 PM</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                        <Button size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
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

export default Leasing;
