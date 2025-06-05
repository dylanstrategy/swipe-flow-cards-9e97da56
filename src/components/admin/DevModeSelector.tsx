
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TestTube, Home, Users, Wrench, Building } from 'lucide-react';
import type { AppRole } from '@/types/supabase';

interface DevModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevModeSelector: React.FC<DevModeSelectorProps> = ({ isOpen, onClose }) => {
  const { enterDevMode } = useAuth();
  const { properties } = useProperties();
  const [selectedRole, setSelectedRole] = useState<AppRole>('resident');
  const [selectedProperty, setSelectedProperty] = useState<string>('');

  const roleOptions: { role: AppRole; label: string; description: string; icon: React.ReactNode }[] = [
    { role: 'resident', label: 'Resident', description: 'Current tenant experience', icon: <Home className="w-4 h-4" /> },
    { role: 'prospect', label: 'Prospect', description: 'Potential tenant view', icon: <Users className="w-4 h-4" /> },
    { role: 'operator', label: 'Operator', description: 'Property management staff', icon: <Building className="w-4 h-4" /> },
    { role: 'leasing', label: 'Leasing', description: 'Leasing specialist view', icon: <Users className="w-4 h-4" /> },
    { role: 'maintenance', label: 'Maintenance', description: 'Maintenance staff view', icon: <Wrench className="w-4 h-4" /> },
    { role: 'senior_operator', label: 'Senior Operator', description: 'Senior management view', icon: <Building className="w-4 h-4" /> },
    { role: 'vendor', label: 'Vendor', description: 'External service provider view', icon: <Wrench className="w-4 h-4" /> }
  ];

  const handleStartDevMode = () => {
    if (selectedRole) {
      const propertyId = properties.length > 0 ? (selectedProperty || properties[0].id) : undefined;
      enterDevMode(selectedRole, propertyId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-blue-600" />
            Enter Development Mode
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              Test the application from different user perspectives without creating separate accounts.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Role to Test</label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(({ role, label, description, icon }) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      {icon}
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {properties.length > 1 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Select Property</label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleStartDevMode} disabled={!selectedRole}>
              <TestTube className="w-4 h-4 mr-2" />
              Start Testing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DevModeSelector;
