
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { UnitStatus } from '@/types/supabase';

interface CreateUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnitCreated: () => void;
  propertyId?: string;
}

const CreateUnitModal: React.FC<CreateUnitModalProps> = ({ isOpen, onClose, onUnitCreated, propertyId }) => {
  const [formData, setFormData] = useState({
    unit_number: '',
    bedroom_type: '',
    bath_type: '',
    sq_ft: '',
    floor: '',
    status: 'available' as UnitStatus,
    property_id: propertyId || ''
  });
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase.from('properties').select('id, name');
      setProperties(data || []);
    };
    
    if (!propertyId) {
      fetchProperties();
    }
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('units')
        .insert([{
          unit_number: formData.unit_number,
          bedroom_type: formData.bedroom_type,
          bath_type: formData.bath_type,
          sq_ft: formData.sq_ft ? parseFloat(formData.sq_ft) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          status: formData.status,
          property_id: formData.property_id
        }]);

      if (error) throw error;

      toast({
        title: "Unit Created",
        description: `Unit ${formData.unit_number} has been created successfully.`,
      });

      onUnitCreated();
      onClose();
      setFormData({
        unit_number: '',
        bedroom_type: '',
        bath_type: '',
        sq_ft: '',
        floor: '',
        status: 'available',
        property_id: propertyId || ''
      });
    } catch (error: any) {
      console.error('Error creating unit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create unit",
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
          <DialogTitle>Create New Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!propertyId && (
            <div>
              <Label htmlFor="property">Property</Label>
              <Select value={formData.property_id} onValueChange={(value) => setFormData({ ...formData, property_id: value })}>
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
            </div>
          )}
          
          <div>
            <Label htmlFor="unit_number">Unit Number</Label>
            <Input
              id="unit_number"
              value={formData.unit_number}
              onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
              placeholder="e.g., 101, A-1, etc."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedroom_type">Bedrooms</Label>
              <Input
                id="bedroom_type"
                value={formData.bedroom_type}
                onChange={(e) => setFormData({ ...formData, bedroom_type: e.target.value })}
                placeholder="e.g., 1BR, 2BR"
              />
            </div>
            <div>
              <Label htmlFor="bath_type">Bathrooms</Label>
              <Input
                id="bath_type"
                value={formData.bath_type}
                onChange={(e) => setFormData({ ...formData, bath_type: e.target.value })}
                placeholder="e.g., 1BA, 1.5BA"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sq_ft">Square Feet</Label>
              <Input
                id="sq_ft"
                type="number"
                value={formData.sq_ft}
                onChange={(e) => setFormData({ ...formData, sq_ft: e.target.value })}
                placeholder="850"
              />
            </div>
            <div>
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as UnitStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="turn">Turn</SelectItem>
                <SelectItem value="leased_not_moved_in">Leased (Not Moved In)</SelectItem>
                <SelectItem value="off_market">Off Market</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.property_id}>
              {loading ? 'Creating...' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUnitModal;
