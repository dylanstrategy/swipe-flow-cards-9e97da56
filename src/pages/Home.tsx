
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home as HomeIcon, 
  Search, 
  Users, 
  Wrench, 
  Settings,
  UserCheck
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const interfaces = [
    {
      id: 'resident',
      title: 'Resident Portal',
      description: 'Access your apartment dashboard, schedule services, and manage your account',
      icon: HomeIcon,
      path: '/resident',
      color: 'bg-blue-500'
    },
    {
      id: 'prospect',
      title: 'Prospect Portal',
      description: 'Find your perfect apartment and manage your application process',
      icon: UserCheck,
      path: '/prospect',
      color: 'bg-purple-500'
    },
    {
      id: 'discovery',
      title: 'Discovery Flow',
      description: 'Find your perfect apartment with our guided discovery process',
      icon: Search,
      path: '/discovery',
      color: 'bg-green-500'
    },
    {
      id: 'matches',
      title: 'Apartment Matches',
      description: 'Browse available apartments that match your preferences',
      icon: UserCheck,
      path: '/matches',
      color: 'bg-purple-500'
    },
    {
      id: 'movein',
      title: 'Move-In Process',
      description: 'Complete your move-in checklist and inspection',
      icon: Users,
      path: '/movein',
      color: 'bg-orange-500'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Portal',
      description: 'Submit and track maintenance requests',
      icon: Wrench,
      path: '/maintenance',
      color: 'bg-red-500'
    },
    {
      id: 'operator',
      title: 'Operator Dashboard',
      description: 'Property management and operations interface',
      icon: Settings,
      path: '/operator',
      color: 'bg-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applaud Living</h1>
          <p className="text-gray-600">Choose your interface to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interfaces.map((interface_) => (
            <Card 
              key={interface_.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(interface_.path)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${interface_.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <interface_.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{interface_.title}</CardTitle>
                <CardDescription className="text-sm">
                  {interface_.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(interface_.path);
                  }}
                >
                  Launch Interface
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{' '}
            <a href="mailto:support@applaudliving.com" className="text-blue-600 hover:underline">
              support@applaudliving.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
