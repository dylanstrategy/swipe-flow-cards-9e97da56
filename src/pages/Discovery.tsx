
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeableDiscoveryFlow from '@/components/discovery/SwipeableDiscoveryFlow';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';

const Discovery = () => {
  const navigate = useNavigate();

  const handleRoleSwitch = (role: string) => {
    switch (role) {
      case 'prospect':
        // Already in prospect view
        break;
      case 'resident':
        navigate('/');
        break;
      case 'operator':
        navigate('/operator');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Your Home</h1>
          <p className="text-sm text-gray-600">Applaud Living • Discovery</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                <AvatarFallback className="bg-green-600 text-white font-semibold">
                  PR
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Prospect User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Looking for a Home
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Setup</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer focus:bg-accent">
              <div className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Role</span>
              </div>
            </DropdownMenuItem>
            
            {/* Role submenu items */}
            <div className="ml-6 space-y-1">
              <DropdownMenuItem 
                className="cursor-pointer text-sm bg-green-50"
                onClick={() => handleRoleSwitch('prospect')}
              >
                Prospect View (Current)
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-sm"
                onClick={() => handleRoleSwitch('resident')}
              >
                Resident View
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-sm"
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

      {/* Discovery Flow */}
      <SwipeableDiscoveryFlow />
    </div>
  );
};

export default Discovery;
