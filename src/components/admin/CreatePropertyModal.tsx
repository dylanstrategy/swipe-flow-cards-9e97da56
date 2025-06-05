
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated: () => void;
}

const CreatePropertyModal: React.FC<CreatePropertyModalProps> = ({ isOpen, onClose, onPropertyCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    timezone: 'America/New_York',
    unitCount: 0,
    generateUnits: false,
    // Onboarding information
    managementCompany: '',
    propertyManagerName: '',
    propertyManagerEmail: '',
    propertyManagerPhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    maintenanceCompany: '',
    maintenanceContact: '',
    maintenancePhone: '',
    leasingOfficeHours: '',
    amenities: '',
    parkingInfo: '',
    petPolicy: '',
    smokingPolicy: '',
    specialInstructions: ''
  });
  const [loading, setLoading] = useState(false);
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
          bedroom_type: Math.random() > 0.5 ? '1BR' : '2BR',
          bath_type: Math.random() > 0.5 ? '1BA' : '2BA',
          sq_ft: Math.floor(Math.random() * 500) + 600,
          status: 'available'
        });
      }
    }
    return units;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create property with all onboarding information
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert([{
          name: formData.name,
          address: formData.address,
          website: formData.website,
          timezone: formData.timezone,
          management_company: formData.managementCompany,
          property_manager_name: formData.propertyManagerName,
          property_manager_email: formData.propertyManagerEmail,
          property_manager_phone: formData.propertyManagerPhone,
          emergency_contact: formData.emergencyContact,
          emergency_phone: formData.emergencyPhone,
          maintenance_company: formData.maintenanceCompany,
          maintenance_contact: formData.maintenanceContact,
          maintenance_phone: formData.maintenancePhone,
          leasing_office_hours: formData.leasingOfficeHours,
          amenities: formData.amenities,
          parking_info: formData.parkingInfo,
          pet_policy: formData.petPolicy,
          smoking_policy: formData.smokingPolicy,
          special_instructions: formData.specialInstructions
        }])
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Generate units if requested
      if (formData.generateUnits && formData.unitCount > 0) {
        const unitsToCreate = generateUnitNumbers(formData.unitCount).map(unit => ({
          ...unit,
          property_id: property.id
        }));

        const { error: unitsError } = await supabase
          .from('units')
          .insert(unitsToCreate);

        if (unitsError) throw unitsError;

        toast({
          title: "Property Created",
          description: `${formData.name} has been created with ${formData.unitCount} units and onboarding information.`,
        });
      } else {
        toast({
          title: "Property Created",
          description: `${formData.name} has been created successfully with onboarding information.`,
        });
      }

      onPropertyCreated();
      onClose();
      setFormData({ 
        name: '', 
        address: '', 
        website: '',
        timezone: 'America/New_York',
        unitCount: 0,
        generateUnits: false,
        managementCompany: '',
        propertyManagerName: '',
        propertyManagerEmail: '',
        propertyManagerPhone: '',
        emergencyContact: '',
        emergencyPhone: '',
        maintenanceCompany: '',
        maintenanceContact: '',
        maintenancePhone: '',
        leasingOfficeHours: '',
        amenities: '',
        parkingInfo: '',
        petPolicy: '',
        smokingPolicy: '',
        specialInstructions: ''
      });
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  placeholder="https://www.leleoapartments.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full property address"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="America/New_York"
                required
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
                <Label htmlFor="managementCompany">Management Company</Label>
                <Input
                  id="managementCompany"
                  value={formData.managementCompany}
                  onChange={(e) => setFormData({ ...formData, managementCompany: e.target.value })}
                  placeholder="Property management company name"
                />
              </div>
              
              <div>
                <Label htmlFor="propertyManagerName">Property Manager Name</Label>
                <Input
                  id="propertyManagerName"
                  value={formData.propertyManagerName}
                  onChange={(e) => setFormData({ ...formData, propertyManagerName: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <Label htmlFor="propertyManagerEmail">Property Manager Email</Label>
                <Input
                  id="propertyManagerEmail"
                  type="email"
                  value={formData.propertyManagerEmail}
                  onChange={(e) => setFormData({ ...formData, propertyManagerEmail: e.target.value })}
                  placeholder="john@management.com"
                />
              </div>
              
              <div>
                <Label htmlFor="propertyManagerPhone">Property Manager Phone</Label>
                <Input
                  id="propertyManagerPhone"
                  type="tel"
                  value={formData.propertyManagerPhone}
                  onChange={(e) => setFormData({ ...formData, propertyManagerPhone: e.target.value })}
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
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Emergency contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="(555) 999-0000"
                />
              </div>
              
              <div>
                <Label htmlFor="maintenanceCompany">Maintenance Company</Label>
                <Input
                  id="maintenanceCompany"
                  value={formData.maintenanceCompany}
                  onChange={(e) => setFormData({ ...formData, maintenanceCompany: e.target.value })}
                  placeholder="Maintenance company name"
                />
              </div>
              
              <div>
                <Label htmlFor="maintenanceContact">Maintenance Contact</Label>
                <Input
                  id="maintenanceContact"
                  value={formData.maintenanceContact}
                  onChange={(e) => setFormData({ ...formData, maintenanceContact: e.target.value })}
                  placeholder="Maintenance contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="maintenancePhone">Maintenance Phone</Label>
                <Input
                  id="maintenancePhone"
                  type="tel"
                  value={formData.maintenancePhone}
                  onChange={(e) => setFormData({ ...formData, maintenancePhone: e.target.value })}
                  placeholder="(555) 777-8888"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
            
            <div>
              <Label htmlFor="leasingOfficeHours">Leasing Office Hours</Label>
              <Textarea
                id="leasingOfficeHours"
                value={formData.leasingOfficeHours}
                onChange={(e) => setFormData({ ...formData, leasingOfficeHours: e.target.value })}
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
                <Label htmlFor="parkingInfo">Parking Information</Label>
                <Textarea
                  id="parkingInfo"
                  value={formData.parkingInfo}
                  onChange={(e) => setFormData({ ...formData, parkingInfo: e.target.value })}
                  placeholder="Garage parking available, $150/month"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="petPolicy">Pet Policy</Label>
                <Textarea
                  id="petPolicy"
                  value={formData.petPolicy}
                  onChange={(e) => setFormData({ ...formData, petPolicy: e.target.value })}
                  placeholder="Dogs and cats welcome, $500 deposit"
                  rows={2}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="smokingPolicy">Smoking Policy</Label>
              <Input
                id="smokingPolicy"
                value={formData.smokingPolicy}
                onChange={(e) => setFormData({ ...formData, smokingPolicy: e.target.value })}
                placeholder="Non-smoking building"
              />
            </div>
            
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
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
