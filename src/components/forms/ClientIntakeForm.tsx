
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, Building, DollarSign, Home } from 'lucide-react';

interface ClientIntakeFormProps {
  onClose: () => void;
  onSubmit: (clientData: any) => void;
}

const ClientIntakeForm: React.FC<ClientIntakeFormProps> = ({ onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    contactName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    unitCount: '',
    averageRent: '',
    totalRentRoll: '',
    propertyType: 'apartment',
    planType: 'standard',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate rent roll if unit count and average rent are provided
    if (field === 'unitCount' || field === 'averageRent') {
      const units = field === 'unitCount' ? parseInt(value) || 0 : parseInt(formData.unitCount) || 0;
      const avgRent = field === 'averageRent' ? parseFloat(value) || 0 : parseFloat(formData.averageRent) || 0;
      
      if (units > 0 && avgRent > 0) {
        setFormData(prev => ({
          ...prev,
          totalRentRoll: (units * avgRent).toFixed(2)
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactEmail || !formData.unitCount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Company Name, Contact Email, Unit Count)",
        variant: "destructive",
      });
      return;
    }

    const clientData = {
      id: Date.now().toString(),
      name: formData.companyName,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhone,
      contact_name: formData.contactName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      unit_count: parseInt(formData.unitCount),
      average_rent: parseFloat(formData.averageRent) || 0,
      total_rent_roll: parseFloat(formData.totalRentRoll) || 0,
      property_type: formData.propertyType,
      plan_type: formData.planType,
      status: 'active',
      notes: formData.notes,
      created_at: new Date().toISOString()
    };

    onSubmit(clientData);
    
    toast({
      title: "Client Added Successfully",
      description: `${formData.companyName} has been added to your client portfolio`,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            New Client Intake
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g., Meridian Properties"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactName">Primary Contact</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="e.g., John Smith"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Property Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Property Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="San Francisco"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="CA"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="94102"
                  />
                </div>
                
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment Complex</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="single_family">Single Family</SelectItem>
                      <SelectItem value="mixed_use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="planType">Plan Type</Label>
                  <Select value={formData.planType} onValueChange={(value) => handleInputChange('planType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Financial Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="unitCount">Total Units *</Label>
                  <Input
                    id="unitCount"
                    type="number"
                    value={formData.unitCount}
                    onChange={(e) => handleInputChange('unitCount', e.target.value)}
                    placeholder="150"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="averageRent">Average Rent/Unit</Label>
                  <Input
                    id="averageRent"
                    type="number"
                    step="0.01"
                    value={formData.averageRent}
                    onChange={(e) => handleInputChange('averageRent', e.target.value)}
                    placeholder="2500.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalRentRoll">Total Monthly Rent Roll</Label>
                  <Input
                    id="totalRentRoll"
                    type="number"
                    step="0.01"
                    value={formData.totalRentRoll}
                    onChange={(e) => handleInputChange('totalRentRoll', e.target.value)}
                    placeholder="375000.00"
                  />
                  {formData.unitCount && formData.averageRent && (
                    <p className="text-xs text-gray-500 mt-1">
                      Auto-calculated: {parseInt(formData.unitCount) * parseFloat(formData.averageRent)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information about this client..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Client
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientIntakeForm;
