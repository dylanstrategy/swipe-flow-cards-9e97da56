
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
import { Settings, Eye, EyeOff } from 'lucide-react';
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

  const availableRoles: AppRole[] = [
    'senior_operator',
    'operator', 
    'maintenance',
    'leasing',
    'resident',
    'prospect'
  ];

  const formatRoleName = (role: AppRole) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="flex items-center gap-2">
      {isImpersonating && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Viewing as {formatRoleName(impersonatedRole!)}
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
            Dev Mode
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            Super Admin - Role Impersonation
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isImpersonating && (
            <>
              <DropdownMenuItem 
                onClick={stopImpersonation}
                className="text-red-600 cursor-pointer"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Stop Impersonation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuLabel className="text-xs text-gray-500">
            Switch to Role:
          </DropdownMenuLabel>
          
          {availableRoles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => impersonateRole(role)}
              className="cursor-pointer"
              disabled={impersonatedRole === role}
            >
              <Eye className="mr-2 h-4 w-4" />
              {formatRoleName(role)}
              {impersonatedRole === role && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RoleImpersonation;
