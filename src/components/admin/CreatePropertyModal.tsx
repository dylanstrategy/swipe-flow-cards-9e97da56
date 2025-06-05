
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
    timezone: 'America/New_York',
    unitCount: 0,
    generateUnits: false
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
      // Create property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert([{
          name: formData.name,
          address: formData.address,
          timezone: formData.timezone
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
          description: `${formData.name} has been created with ${formData.unitCount} units.`,
        });
      } else {
        toast({
          title: "Property Created",
          description: `${formData.name} has been created successfully.`,
        });
      }

      onPropertyCreated();
      onClose();
      setFormData({ 
        name: '', 
        address: '', 
        timezone: 'America/New_York',
        unitCount: 0,
        generateUnits: false
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="flex justify-end gap-2 pt-4">
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
