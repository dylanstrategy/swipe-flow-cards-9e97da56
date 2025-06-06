
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/types/supabase';

interface EditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onPropertyUpdated: () => void;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  property,
  isOpen,
  onClose,
  onPropertyUpdated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    timezone: '',
    management_company: '',
    property_manager_name: '',
    property_manager_email: '',
    property_manager_phone: '',
    emergency_contact: '',
    emergency_phone: '',
    maintenance_company: '',
    maintenance_contact: '',
    maintenance_phone: '',
    leasing_office_hours: '',
    amenities: '',
    parking_info: '',
    pet_policy: '',
    smoking_policy: '',
    special_instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        name: property.name || '',
        address: property.address || '',
        website: property.website || '',
        timezone: property.timezone || '',
        management_company: property.management_company || '',
        property_manager_name: property.property_manager_name || '',
        property_manager_email: property.property_manager_email || '',
        property_manager_phone: property.property_manager_phone || '',
        emergency_contact: property.emergency_contact || '',
        emergency_phone: property.emergency_phone || '',
        maintenance_company: property.maintenance_company || '',
        maintenance_contact: property.maintenance_contact || '',
        maintenance_phone: property.maintenance_phone || '',
        leasing_office_hours: property.leasing_office_hours || '',
        amenities: property.amenities || '',
        parking_info: property.parking_info || '',
        pet_policy: property.pet_policy || '',
        smoking_policy: property.smoking_policy || '',
        special_instructions: property.special_instructions || ''
      });
    }
  }, [property, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .schema('api')
        .from('properties')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      onPropertyUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property: {property.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                placeholder="America/New_York"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="management_company">Management Company</Label>
              <Input
                id="management_company"
                value={formData.management_company}
                onChange={(e) => handleInputChange('management_company', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="property_manager_name">Property Manager</Label>
              <Input
                id="property_manager_name"
                value={formData.property_manager_name}
                onChange={(e) => handleInputChange('property_manager_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_manager_email">Manager Email</Label>
              <Input
                id="property_manager_email"
                type="email"
                value={formData.property_manager_email}
                onChange={(e) => handleInputChange('property_manager_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="property_manager_phone">Manager Phone</Label>
              <Input
                id="property_manager_phone"
                value={formData.property_manager_phone}
                onChange={(e) => handleInputChange('property_manager_phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact}
                onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergency_phone">Emergency Phone</Label>
              <Input
                id="emergency_phone"
                value={formData.emergency_phone}
                onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maintenance_company">Maintenance Company</Label>
              <Input
                id="maintenance_company"
                value={formData.maintenance_company}
                onChange={(e) => handleInputChange('maintenance_company', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maintenance_contact">Maintenance Contact</Label>
              <Input
                id="maintenance_contact"
                value={formData.maintenance_contact}
                onChange={(e) => handleInputChange('maintenance_contact', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maintenance_phone">Maintenance Phone</Label>
            <Input
              id="maintenance_phone"
              value={formData.maintenance_phone}
              onChange={(e) => handleInputChange('maintenance_phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="leasing_office_hours">Leasing Office Hours</Label>
            <Input
              id="leasing_office_hours"
              value={formData.leasing_office_hours}
              onChange={(e) => handleInputChange('leasing_office_hours', e.target.value)}
              placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
            />
          </div>

          <div>
            <Label htmlFor="amenities">Amenities</Label>
            <Textarea
              id="amenities"
              value={formData.amenities}
              onChange={(e) => handleInputChange('amenities', e.target.value)}
              placeholder="Pool, Gym, Concierge, etc."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="parking_info">Parking Information</Label>
            <Textarea
              id="parking_info"
              value={formData.parking_info}
              onChange={(e) => handleInputChange('parking_info', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="pet_policy">Pet Policy</Label>
            <Textarea
              id="pet_policy"
              value={formData.pet_policy}
              onChange={(e) => handleInputChange('pet_policy', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="smoking_policy">Smoking Policy</Label>
            <Input
              id="smoking_policy"
              value={formData.smoking_policy}
              onChange={(e) => handleInputChange('smoking_policy', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="special_instructions">Special Instructions</Label>
            <Textarea
              id="special_instructions"
              value={formData.special_instructions}
              onChange={(e) => handleInputChange('special_instructions', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
