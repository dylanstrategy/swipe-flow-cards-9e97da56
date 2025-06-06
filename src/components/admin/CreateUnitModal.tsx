
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
    unit_type: '',
    bedrooms: '',
    bathrooms: '',
    sq_ft: '',
    floor: '',
    unit_status: 'available' as UnitStatus,
    market_rent: '',
    property_id: propertyId || ''
  });
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase.from('properties').select('id, property_name');
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
          unit_type: formData.unit_type || null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
          sq_ft: formData.sq_ft ? parseFloat(formData.sq_ft) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          unit_status: formData.unit_status,
          market_rent: formData.market_rent ? parseFloat(formData.market_rent) : null,
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
        unit_type: '',
        bedrooms: '',
        bathrooms: '',
        sq_ft: '',
        floor: '',
        unit_status: 'available',
        market_rent: '',
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
                      {property.property_name}
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

          <div>
            <Label htmlFor="unit_type">Unit Type</Label>
            <Input
              id="unit_type"
              value={formData.unit_type}
              onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
              placeholder="e.g., Studio, 1BR, 2BR"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="1"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="1"
                min="0"
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
            <Label htmlFor="market_rent">Market Rent</Label>
            <Input
              id="market_rent"
              type="number"
              step="0.01"
              value={formData.market_rent}
              onChange={(e) => setFormData({ ...formData, market_rent: e.target.value })}
              placeholder="2500.00"
            />
          </div>
          
          <div>
            <Label htmlFor="unit_status">Status</Label>
            <Select value={formData.unit_status} onValueChange={(value) => setFormData({ ...formData, unit_status: value as UnitStatus })}>
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
