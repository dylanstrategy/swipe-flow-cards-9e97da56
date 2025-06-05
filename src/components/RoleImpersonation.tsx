
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Eye, EyeOff, TestTube } from 'lucide-react';
import type { AppRole } from '@/types/supabase';

const RoleImpersonation = () => {
  const { 
    userProfile, 
    canImpersonate, 
    isImpersonating, 
    impersonatedRole,
    impersonateRole, 
    stopImpersonation 
  } = useAuth();

  if (!canImpersonate) return null;

  const availableRoles: { role: AppRole; label: string; description: string }[] = [
    { role: 'resident', label: 'Resident', description: 'Current tenant view' },
    { role: 'prospect', label: 'Prospect', description: 'Potential tenant view' },
    { role: 'operator', label: 'Operator', description: 'Property management staff' },
    { role: 'leasing', label: 'Leasing', description: 'Leasing specialist view' },
    { role: 'maintenance', label: 'Maintenance', description: 'Maintenance staff view' },
    { role: 'senior_operator', label: 'Senior Operator', description: 'Senior management view' }
  ];

  const formatRoleName = (role: AppRole) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="flex items-center gap-2">
      {isImpersonating && (
        <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
          <TestTube className="w-3 h-3" />
          Testing as {formatRoleName(impersonatedRole!)}
        </Badge>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={isImpersonating ? "destructive" : "outline"} 
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {isImpersonating ? 'Exit Dev Mode' : 'Dev Mode'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Role Testing Mode
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isImpersonating && (
            <>
              <DropdownMenuItem 
                onClick={stopImpersonation}
                className="text-red-600 cursor-pointer font-medium"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Stop Role Testing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
            Test user experiences:
          </DropdownMenuLabel>
          
          {availableRoles.map(({ role, label, description }) => (
            <DropdownMenuItem
              key={role}
              onClick={() => impersonateRole(role)}
              className="cursor-pointer flex-col items-start py-2"
              disabled={impersonatedRole === role}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </div>
                {impersonatedRole === role && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">{description}</span>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <div className="px-2 py-1">
            <p className="text-xs text-gray-500">
              Test different user flows without creating separate accounts
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RoleImpersonation;
