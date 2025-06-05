
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, UserPlus, DollarSign, Calendar } from 'lucide-react';

interface LeadIntakeFormProps {
  onClose: () => void;
  onSubmit: (leadData: any) => void;
}

const LeadIntakeForm: React.FC<LeadIntakeFormProps> = ({ onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    unitCount: '',
    propertyType: 'apartment',
    priceRange: '',
    moveInDate: '',
    source: 'website',
    status: 'interest',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.unitCount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, Unit Count)",
        variant: "destructive",
      });
      return;
    }

    const leadData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.companyName,
      units: parseInt(formData.unitCount),
      property_type: formData.propertyType,
      price_range: formData.priceRange,
      move_in_date: formData.moveInDate,
      source: formData.source,
      status: formData.status,
      notes: formData.notes,
      created_at: new Date().toISOString()
    };

    onSubmit(leadData);
    
    toast({
      title: "Lead Added Successfully",
      description: `${formData.name} has been added to your sales pipeline`,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            New Lead Intake
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Contact Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Sarah Johnson"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g., Urban Living Co"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Property Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Property Requirements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitCount">Desired Unit Count *</Label>
                  <Input
                    id="unitCount"
                    type="number"
                    value={formData.unitCount}
                    onChange={(e) => handleInputChange('unitCount', e.target.value)}
                    placeholder="100"
                    required
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
                  <Label htmlFor="priceRange">Budget Range</Label>
                  <Input
                    id="priceRange"
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    placeholder="e.g., $200K-$500K"
                  />
                </div>
                
                <div>
                  <Label htmlFor="moveInDate">Target Date</Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Lead Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Lead Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Lead Source</Label>
                  <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="email_campaign">Email Campaign</SelectItem>
                      <SelectItem value="cold_call">Cold Call</SelectItem>
                      <SelectItem value="trade_show">Trade Show</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Lead Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interest">Initial Interest</SelectItem>
                      <SelectItem value="call_scheduled">Call Scheduled</SelectItem>
                      <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                      <SelectItem value="contract_sent">Contract Sent</SelectItem>
                      <SelectItem value="follow_up">Follow Up Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional information about this lead..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Lead
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

export default LeadIntakeForm;
