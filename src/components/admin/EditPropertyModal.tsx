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
    property_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    website: '',
    timezone: '',
    management_company: '',
    unit_count: '',
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
    special_instructions: '',
    move_in_instructions: '',
    trash_pickup_schedule: '',
    recycling_pickup_schedule: '',
    amenity_wifi_name: '',
    amenity_wifi_password: '',
    utility_company: '',
    utility_contact: '',
    super_contact: '',
    late_fee_policy: '',
    late_fee_threshold: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        property_name: property.property_name || property.name || '',
        address_line_1: property.address_line_1 || property.address || '',
        address_line_2: property.address_line_2 || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        website: property.website || '',
        timezone: property.timezone || '',
        management_company: property.management_company || '',
        unit_count: property.unit_count?.toString() || '',
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
        special_instructions: property.special_instructions || '',
        move_in_instructions: property.move_in_instructions || '',
        trash_pickup_schedule: property.trash_pickup_schedule || '',
        recycling_pickup_schedule: property.recycling_pickup_schedule || '',
        amenity_wifi_name: property.amenity_wifi_name || '',
        amenity_wifi_password: property.amenity_wifi_password || '',
        utility_company: property.utility_company || '',
        utility_contact: property.utility_contact || '',
        super_contact: property.super_contact || '',
        late_fee_policy: property.late_fee_policy || '',
        late_fee_threshold: property.late_fee_threshold?.toString() || ''
      });
    }
  }, [property, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        unit_count: formData.unit_count ? parseInt(formData.unit_count) : null,
        late_fee_threshold: formData.late_fee_threshold ? parseFloat(formData.late_fee_threshold) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
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
          <DialogTitle>Edit Property: {property.property_name || property.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_name">Property Name</Label>
              <Input
                id="property_name"
                value={formData.property_name}
                onChange={(e) => handleInputChange('property_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="unit_count">Unit Count</Label>
              <Input
                id="unit_count"
                type="number"
                value={formData.unit_count}
                onChange={(e) => handleInputChange('unit_count', e.target.value)}
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                placeholder="America/New_York"
              />
            </div>
            <div>
              <Label htmlFor="management_company">Management Company</Label>
              <Input
                id="management_company"
                value={formData.management_company}
                onChange={(e) => handleInputChange('management_company', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address_line_1">Address Line 1</Label>
            <Input
              id="address_line_1"
              value={formData.address_line_1}
              onChange={(e) => handleInputChange('address_line_1', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="address_line_2">Address Line 2</Label>
            <Input
              id="address_line_2"
              value={formData.address_line_2}
              onChange={(e) => handleInputChange('address_line_2', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="move_in_instructions">Move-In Instructions</Label>
            <Textarea
              id="move_in_instructions"
              value={formData.move_in_instructions}
              onChange={(e) => handleInputChange('move_in_instructions', e.target.value)}
              placeholder="Check in at front desk, get keys from concierge"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trash_pickup_schedule">Trash Pickup Schedule</Label>
              <Input
                id="trash_pickup_schedule"
                value={formData.trash_pickup_schedule}
                onChange={(e) => handleInputChange('trash_pickup_schedule', e.target.value)}
                placeholder="Mon/Wed/Fri 6am"
              />
            </div>
            <div>
              <Label htmlFor="recycling_pickup_schedule">Recycling Schedule</Label>
              <Input
                id="recycling_pickup_schedule"
                value={formData.recycling_pickup_schedule}
                onChange={(e) => handleInputChange('recycling_pickup_schedule', e.target.value)}
                placeholder="Tues/Fri 7am"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amenity_wifi_name">Amenity WiFi Name</Label>
              <Input
                id="amenity_wifi_name"
                value={formData.amenity_wifi_name}
                onChange={(e) => handleInputChange('amenity_wifi_name', e.target.value)}
                placeholder="PropertyName_Guest"
              />
            </div>
            <div>
              <Label htmlFor="amenity_wifi_password">Amenity WiFi Password</Label>
              <Input
                id="amenity_wifi_password"
                value={formData.amenity_wifi_password}
                onChange={(e) => handleInputChange('amenity_wifi_password', e.target.value)}
                placeholder="password123"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="utility_company">Utility Company</Label>
              <Input
                id="utility_company"
                value={formData.utility_company}
                onChange={(e) => handleInputChange('utility_company', e.target.value)}
                placeholder="PSE&G"
              />
            </div>
            <div>
              <Label htmlFor="utility_contact">Utility Contact</Label>
              <Input
                id="utility_contact"
                value={formData.utility_contact}
                onChange={(e) => handleInputChange('utility_contact', e.target.value)}
                placeholder="(800) 436-7734"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="super_contact">Super Contact</Label>
            <Input
              id="super_contact"
              value={formData.super_contact}
              onChange={(e) => handleInputChange('super_contact', e.target.value)}
              placeholder="John Smith (555) 123-4567"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="late_fee_policy">Late Fee Policy</Label>
              <Input
                id="late_fee_policy"
                value={formData.late_fee_policy}
                onChange={(e) => handleInputChange('late_fee_policy', e.target.value)}
                placeholder="$50 late fee after 5 days"
              />
            </div>
            <div>
              <Label htmlFor="late_fee_threshold">Late Fee Threshold</Label>
              <Input
                id="late_fee_threshold"
                type="number"
                step="0.01"
                value={formData.late_fee_threshold}
                onChange={(e) => handleInputChange('late_fee_threshold', e.target.value)}
                placeholder="50.00"
              />
            </div>
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
              <Label htmlFor="property_manager_name">Property Manager</Label>
              <Input
                id="property_manager_name"
                value={formData.property_manager_name}
                onChange={(e) => handleInputChange('property_manager_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="property_manager_email">Manager Email</Label>
              <Input
                id="property_manager_email"
                type="email"
                value={formData.property_manager_email}
                onChange={(e) => handleInputChange('property_manager_email', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="property_manager_phone">Manager Phone</Label>
            <Input
              id="property_manager_phone"
              value={formData.property_manager_phone}
              onChange={(e) => handleInputChange('property_manager_phone', e.target.value)}
            />
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
