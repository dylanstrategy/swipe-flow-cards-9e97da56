
import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings, Eye, EyeOff, TestTube, LogOut, User, Home } from 'lucide-react';
import type { AppRole } from '@/types/supabase';
import { useUsers } from '@/hooks/useSupabaseData';
import DevModeSelector from '@/components/admin/DevModeSelector';

const RoleImpersonation = () => {
  const { 
    userProfile, 
    canImpersonate, 
    isImpersonating, 
    impersonatedRole,
    impersonateRole, 
    stopImpersonation,
    signOut,
    impersonateAsUser,
    impersonatedUser,
    isDevMode,
    devModeRole,
    exitDevMode
  } = useAuth();
  
  const { users } = useUsers();
  const [showResidentSelector, setShowResidentSelector] = useState(false);
  const [showDevModeSelector, setShowDevModeSelector] = useState(false);

  const availableRoles: { role: AppRole; label: string; description: string }[] = [
    { role: 'resident', label: 'Resident', description: 'Current tenant view' },
    { role: 'prospect', label: 'Prospect', description: 'Potential tenant view' },
    { role: 'operator', label: 'Operator', description: 'Property management staff' },
    { role: 'leasing', label: 'Leasing', description: 'Leasing specialist view' },
    { role: 'maintenance', label: 'Maintenance', description: 'Maintenance staff view' },
    { role: 'senior_operator', label: 'Senior Operator', description: 'Senior management view' },
    { role: 'vendor', label: 'Vendor', description: 'External service provider view' }
  ];

  const formatRoleName = (role: AppRole) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleRoleSelect = (role: AppRole) => {
    console.log('🎭 Role selected:', role);
    if (role === 'resident') {
      setShowResidentSelector(true);
    } else {
      impersonateRole(role);
    }
  };

  const handleResidentSelect = (resident: any) => {
    console.log('🏠 Resident selected for impersonation:', resident);
    impersonateAsUser(resident, 'resident');
    setShowResidentSelector(false);
  };

  const handleStopImpersonation = () => {
    console.log('🎭 Stopping impersonation via button');
    stopImpersonation();
  };

  const handleExitDevMode = () => {
    console.log('🔧 Exiting dev mode via button');
    exitDevMode();
  };

  const residents = users.filter(user => user.role === 'resident');

  console.log('🎭 RoleImpersonation render:', { 
    isImpersonating, 
    impersonatedRole, 
    currentUserRole: userProfile?.role,
    impersonatedUser: impersonatedUser?.email,
    isDevMode,
    devModeRole
  });

  return (
    <>
      <div className="flex items-center gap-2">
        {(isImpersonating || isDevMode) && (
          <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
            <TestTube className="w-3 h-3" />
            {isDevMode ? `Testing as ${formatRoleName(devModeRole!)}` : `Testing as ${formatRoleName(impersonatedRole!)}`}
            {impersonatedUser && (
              <span className="ml-1">({impersonatedUser.first_name} {impersonatedUser.last_name})</span>
            )}
          </Badge>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={isImpersonating || isDevMode ? "destructive" : "outline"} 
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {isImpersonating || isDevMode ? 'Exit Dev Mode' : 'Account'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {userProfile?.first_name} {userProfile?.last_name}
            </DropdownMenuLabel>
            <div className="px-2 py-1 text-xs text-gray-500">
              {userProfile?.email}
            </div>
            <DropdownMenuSeparator />
            
            {canImpersonate && (
              <>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Development Mode
                </DropdownMenuLabel>
                
                {(isImpersonating || isDevMode) && (
                  <>
                    <DropdownMenuItem 
                      onClick={isDevMode ? handleExitDevMode : handleStopImpersonation}
                      className="text-red-600 cursor-pointer font-medium"
                    >
                      <EyeOff className="mr-2 h-4 w-4" />
                      Exit Dev Mode
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem
                  onClick={() => setShowDevModeSelector(true)}
                  className="cursor-pointer"
                >
                  <TestTube className="mr-2 h-4 w-4" />
                  Start Dev Mode
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <div className="px-2 py-1">
                  <p className="text-xs text-gray-500">
                    Test different user experiences without creating separate accounts
                  </p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-600 cursor-pointer font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dev Mode Selector Dialog */}
      <DevModeSelector 
        isOpen={showDevModeSelector} 
        onClose={() => setShowDevModeSelector(false)} 
      />

      {/* Resident Selector Dialog */}
      <Dialog open={showResidentSelector} onOpenChange={setShowResidentSelector}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Select Resident to Impersonate
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {residents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No residents found</p>
            ) : (
              residents.map((resident) => (
                <div
                  key={resident.id}
                  onClick={() => handleResidentSelect(resident)}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="font-medium">
                    {resident.first_name} {resident.last_name}
                  </div>
                  <div className="text-sm text-gray-600">{resident.email}</div>
                  {resident.phone && (
                    <div className="text-sm text-gray-500">{resident.phone}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleImpersonation;
