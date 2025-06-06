
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated: () => void;
}

const CreatePropertyModal: React.FC<CreatePropertyModalProps> = ({ isOpen, onClose, onPropertyCreated }) => {
  const [formData, setFormData] = useState({
    property_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    website: '',
    timezone: 'America/New_York',
    unitCount: 0,
    generateUnits: false,
    // Onboarding information
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const generateUnitNumbers = (count: number) => {
    const units = [];
    const floorsCount = Math.ceil(count / 10);
    
    for (let floor = 1; floor <= floorsCount; floor++) {
      const unitsOnFloor = Math.min(10, count - (floor - 1) * 10);
      for (let unitOnFloor = 1; unitOnFloor <= unitsOnFloor; unitOnFloor++) {
        const unitNumber = `${floor}${unitOnFloor.toString().padStart(2, '0')}`;
        units.push({
          unit_number: unitNumber,
          floor: floor,
          bedrooms: Math.random() > 0.5 ? 1 : 2,
          bathrooms: Math.random() > 0.5 ? 1 : 2,
          sq_ft: Math.floor(Math.random() * 500) + 600,
          unit_status: 'available'
        });
      }
    }
    return units;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!formData.property_name || !formData.address_line_1 || !formData.city || !formData.state || !formData.zip_code) {
      setErrorMsg('Please fill out all required fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Creating property with data:', formData);
      
      // Create property with all onboarding information
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert([{
          property_name: formData.property_name,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          website: formData.website,
          timezone: formData.timezone,
          management_company: formData.management_company,
          property_manager_name: formData.property_manager_name,
          property_manager_email: formData.property_manager_email,
          property_manager_phone: formData.property_manager_phone,
          emergency_contact: formData.emergency_contact,
          emergency_phone: formData.emergency_phone,
          maintenance_company: formData.maintenance_company,
          maintenance_contact: formData.maintenance_contact,
          maintenance_phone: formData.maintenance_phone,
          leasing_office_hours: formData.leasing_office_hours,
          amenities: formData.amenities,
          parking_info: formData.parking_info,
          pet_policy: formData.pet_policy,
          smoking_policy: formData.smoking_policy,
          special_instructions: formData.special_instructions
        }])
        .select()
        .single();

      if (propertyError) {
        console.error('Error creating property:', propertyError);
        throw propertyError;
      }

      console.log('Property created successfully:', property);

      // Generate units if requested
      if (formData.generateUnits && formData.unitCount > 0 && property) {
        const unitsToCreate = generateUnitNumbers(formData.unitCount).map(unit => ({
          ...unit,
          property_id: property.id
        }));

        console.log('Creating units:', unitsToCreate);

        const { error: unitsError } = await supabase
          .from('units')
          .insert(unitsToCreate);

        if (unitsError) {
          console.error('Error creating units:', unitsError);
          throw unitsError;
        }

        toast({
          title: "Property Created",
          description: `${formData.property_name} has been created with ${formData.unitCount} units.`,
        });
      } else {
        toast({
          title: "Property Created",
          description: `${formData.property_name} has been created successfully.`,
        });
      }

      onPropertyCreated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error creating property:', error);
      setErrorMsg(error.message || "Failed to create property");
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      property_name: '', 
      address_line_1: '', 
      address_line_2: '',
      city: '',
      state: '',
      zip_code: '',
      website: '',
      timezone: 'America/New_York',
      unitCount: 0,
      generateUnits: false,
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Property</DialogTitle>
        </DialogHeader>
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{errorMsg}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_name">Property Name <span className="text-red-500">*</span></Label>
                <Input
                  id="property_name"
                  value={formData.property_name}
                  onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                  placeholder="e.g., Le Leo Apartments"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address_line_1">Address Line 1 <span className="text-red-500">*</span></Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                placeholder="Street address"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                placeholder="Apt, Suite, Building (optional)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="zip_code">ZIP Code <span className="text-red-500">*</span></Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  placeholder="ZIP Code"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="America/New_York"
              />
            </div>
          </div>

          {/* Unit Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Unit Configuration</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="generateUnits"
                checked={formData.generateUnits}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, generateUnits: checked as boolean })
                }
              />
              <Label htmlFor="generateUnits">Auto-generate units for this property</Label>
            </div>

            {formData.generateUnits && (
              <div>
                <Label htmlFor="unitCount">Number of Units</Label>
                <Input
                  id="unitCount"
                  type="number"
                  min="1"
                  max="500"
                  value={formData.unitCount || ''}
                  onChange={(e) => setFormData({ ...formData, unitCount: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 99"
                  required={formData.generateUnits}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Units will be numbered by floor (101, 102, 201, 202, etc.)
                </p>
              </div>
            )}
          </div>

          {/* Management Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Management Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="management_company">Management Company</Label>
                <Input
                  id="management_company"
                  value={formData.management_company}
                  onChange={(e) => setFormData({ ...formData, management_company: e.target.value })}
                  placeholder="Property management company name"
                />
              </div>
              
              <div>
                <Label htmlFor="property_manager_name">Property Manager Name</Label>
                <Input
                  id="property_manager_name"
                  value={formData.property_manager_name}
                  onChange={(e) => setFormData({ ...formData, property_manager_name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <Label htmlFor="property_manager_email">Property Manager Email</Label>
                <Input
                  id="property_manager_email"
                  type="email"
                  value={formData.property_manager_email}
                  onChange={(e) => setFormData({ ...formData, property_manager_email: e.target.value })}
                  placeholder="john@management.com"
                />
              </div>
              
              <div>
                <Label htmlFor="property_manager_phone">Property Manager Phone</Label>
                <Input
                  id="property_manager_phone"
                  type="tel"
                  value={formData.property_manager_phone}
                  onChange={(e) => setFormData({ ...formData, property_manager_phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Emergency & Maintenance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Emergency & Maintenance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  placeholder="Emergency contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="emergency_phone">Emergency Phone</Label>
                <Input
                  id="emergency_phone"
                  type="tel"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  placeholder="(555) 999-0000"
                />
              </div>
              
              <div>
                <Label htmlFor="maintenance_company">Maintenance Company</Label>
                <Input
                  id="maintenance_company"
                  value={formData.maintenance_company}
                  onChange={(e) => setFormData({ ...formData, maintenance_company: e.target.value })}
                  placeholder="Maintenance company name"
                />
              </div>
              
              <div>
                <Label htmlFor="maintenance_contact">Maintenance Contact</Label>
                <Input
                  id="maintenance_contact"
                  value={formData.maintenance_contact}
                  onChange={(e) => setFormData({ ...formData, maintenance_contact: e.target.value })}
                  placeholder="Maintenance contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="maintenance_phone">Maintenance Phone</Label>
                <Input
                  id="maintenance_phone"
                  type="tel"
                  value={formData.maintenance_phone}
                  onChange={(e) => setFormData({ ...formData, maintenance_phone: e.target.value })}
                  placeholder="(555) 777-8888"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
            
            <div>
              <Label htmlFor="leasing_office_hours">Leasing Office Hours</Label>
              <Textarea
                id="leasing_office_hours"
                value={formData.leasing_office_hours}
                onChange={(e) => setFormData({ ...formData, leasing_office_hours: e.target.value })}
                placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="amenities">Amenities</Label>
              <Textarea
                id="amenities"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Pool, Gym, Concierge, Rooftop Deck, etc."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parking_info">Parking Information</Label>
                <Textarea
                  id="parking_info"
                  value={formData.parking_info}
                  onChange={(e) => setFormData({ ...formData, parking_info: e.target.value })}
                  placeholder="Garage parking available, $150/month"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="pet_policy">Pet Policy</Label>
                <Textarea
                  id="pet_policy"
                  value={formData.pet_policy}
                  onChange={(e) => setFormData({ ...formData, pet_policy: e.target.value })}
                  placeholder="Dogs and cats welcome, $500 deposit"
                  rows={2}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="smoking_policy">Smoking Policy</Label>
              <Input
                id="smoking_policy"
                value={formData.smoking_policy}
                onChange={(e) => setFormData({ ...formData, smoking_policy: e.target.value })}
                placeholder="Non-smoking building"
              />
            </div>
            
            <div>
              <Label htmlFor="special_instructions">Special Instructions</Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                placeholder="Any special instructions for residents, delivery, access, etc."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyModal;
