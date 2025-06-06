
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { AppRole } from '@/types/supabase';

interface Property {
  id: string;
  name: string;
}

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: () => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose, onAccountCreated }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'resident' as AppRole,
    selectedProperties: [] as string[]
  });
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase.from('properties').select('id, name');
      setProperties(data || []);
    };
    
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  const getAvailableRoles = (): AppRole[] => {
    if (userProfile?.role === 'super_admin') {
      return ['senior_operator', 'operator', 'maintenance', 'leasing', 'resident', 'vendor'];
    } else if (userProfile?.role === 'senior_operator') {
      return ['operator', 'maintenance', 'leasing', 'resident', 'vendor'];
    }
    return [];
  };

  const handlePropertyToggle = (propertyId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedProperties: [...prev.selectedProperties, propertyId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedProperties: prev.selectedProperties.filter(id => id !== propertyId)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.selectedProperties.length === 0) {
      toast({
        title: "Property Required",
        description: "Please select at least one property for this user.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: 'Applaud123!', // Temporary password
        email_confirm: true,
        user_metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role
        }
      });

      if (authError) throw authError;

      // Insert user into public.users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role
        });

      if (userError) throw userError;

      // Handle role-specific setup
      if (formData.role === 'resident') {
        // Create resident record for each selected property
        for (const propertyId of formData.selectedProperties) {
          await supabase
            .from('residents')
            .insert({
              user_id: authData.user.id,
              property_id: propertyId,
              status: 'active',
              onboarding_status: 'pending',
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email
            });
        }
      }

      toast({
        title: "Account Created",
        description: `${formData.firstName} ${formData.lastName} has been created successfully. They can log in with email ${formData.email} and password: Applaud123!`,
      });

      onAccountCreated();
      onClose();
      setFormData({ email: '', firstName: '', lastName: '', role: 'resident', selectedProperties: [] });
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = getAvailableRoles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as AppRole })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assigned Properties</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-3">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={property.id}
                    checked={formData.selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) => handlePropertyToggle(property.id, checked as boolean)}
                  />
                  <Label htmlFor={property.id} className="text-sm cursor-pointer">
                    {property.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> User will be created with temporary password: <code>Applaud123!</code>
              <br />They should reset it on first login.
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountModal;
