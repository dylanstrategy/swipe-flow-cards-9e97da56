
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { AppRole } from '@/types/supabase';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'prospect' as AppRole,
    propertyId: ''
  });
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase.from('properties').select('id, name');
      setProperties(data || []);
    };
    
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  const requiresProperty = (role: AppRole) => {
    return ['resident', 'leasing', 'maintenance', 'operator', 'senior_operator'].includes(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requiresProperty(formData.role) && !formData.propertyId) {
      toast({
        title: "Property Required",
        description: `Please select a property for ${formData.role} role.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create user in Supabase auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: 'TemporaryPassword123!', // They'll need to reset this
        email_confirm: true,
        user_metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
          phone: formData.phone
        }
      });

      if (error) throw error;

      // Update the user record with additional info
      if (data.user) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: formData.role
          })
          .eq('id', data.user.id);

        if (updateError) throw updateError;

        // Create property-specific records based on role
        if (formData.role === 'resident') {
          const { error: residentError } = await supabase
            .from('residents')
            .insert({
              user_id: data.user.id,
              property_id: formData.propertyId,
              status: 'active',
              onboarding_status: 'pending'
            });

          if (residentError) throw residentError;
        }

        // For operators, set them as senior_operator for the property
        if (formData.role === 'senior_operator' && formData.propertyId) {
          const { error: propertyError } = await supabase
            .from('properties')
            .update({ senior_operator_id: data.user.id })
            .eq('id', formData.propertyId);

          if (propertyError) throw propertyError;
        }
      }

      toast({
        title: "User Created",
        description: `${formData.firstName} ${formData.lastName} has been created successfully. They will receive login instructions via email.`,
      });

      onUserCreated();
      onClose();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'prospect', propertyId: '' });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role: AppRole) => {
    const descriptions = {
      prospect: 'Interested in renting, can schedule tours',
      resident: 'Current tenant, can submit maintenance requests',
      leasing: 'Manages tours and applications for a property',
      maintenance: 'Handles work orders and repairs for a property',
      operator: 'Property manager with full property access',
      senior_operator: 'Senior property manager, assigns to property',
      vendor: 'External contractor for maintenance work'
    };
    return descriptions[role] || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
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
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as AppRole })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="leasing">Leasing Agent</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="operator">Property Operator</SelectItem>
                <SelectItem value="senior_operator">Senior Operator</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
            {formData.role && (
              <p className="text-xs text-gray-500 mt-1">
                {getRoleDescription(formData.role)}
              </p>
            )}
          </div>

          {requiresProperty(formData.role) && (
            <div>
              <Label htmlFor="property">Property *</Label>
              <Select value={formData.propertyId} onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Required for {formData.role} role
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> User will be created with a temporary password and will need to reset it on first login. 
              {formData.role === 'senior_operator' || formData.role === 'operator' ? 
                ' Consider sending them a contract via the Contract Documents system.' : ''}
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (requiresProperty(formData.role) && !formData.propertyId)}>
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
