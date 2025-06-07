
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Mail,
  MessageSquare,
  Users,
  Target,
  Calendar,
  DollarSign,
  X
} from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: any) => void;
}

const CreateCampaignModal = ({ isOpen, onClose, onCampaignCreated }: CreateCampaignModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    targetAudience: '',
    budget: '',
    scheduledDate: '',
    content: '',
    subject: '',
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');

  const campaignTypes = [
    { value: 'email', label: 'Email Campaign', icon: Mail },
    { value: 'sms', label: 'SMS Campaign', icon: MessageSquare },
  ];

  const targetAudiences = [
    { value: 'prospects', label: 'Prospects', description: 'People interested in your properties' },
    { value: 'current_residents', label: 'Current Residents', description: 'Active residents in your properties' },
    { value: 'past_residents', label: 'Past Residents', description: 'Former residents who moved out' },
    { value: 'leads', label: 'Active Leads', description: 'Leads currently in your pipeline' },
    { value: 'all', label: 'All Contacts', description: 'Everyone in your database' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaign = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      type: formData.type,
      targetAudience: formData.targetAudience,
      status: formData.scheduledDate ? 'scheduled' : 'draft',
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversions: 0,
      budget: parseInt(formData.budget) || 0,
      createdDate: new Date().toISOString().split('T')[0],
      content: formData.content,
      subject: formData.subject,
      tags: formData.tags,
      scheduledDate: formData.scheduledDate
    };

    onCampaignCreated(campaign);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: '',
      targetAudience: '',
      budget: '',
      scheduledDate: '',
      content: '',
      subject: '',
      tags: []
    });
    
    onClose();
  };

  const selectedType = campaignTypes.find(type => type.value === formData.type);
  const selectedAudience = targetAudiences.find(audience => audience.value === formData.targetAudience);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Create Marketing Campaign
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-1">
            {/* Campaign Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Spring Move-In Special"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this campaign..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Campaign Type */}
            <div>
              <Label>Campaign Type *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {campaignTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('type', type.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          formData.type === type.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div className="font-medium">{type.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <Label>Target Audience *</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  {targetAudiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      <div className="flex flex-col items-start">
                        <span>{audience.label}</span>
                        <span className="text-xs text-gray-500">{audience.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAudience && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{selectedAudience.description}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Content */}
            {formData.type === 'email' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Email Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Don't Miss Our Spring Move-In Special!"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="content">
                {formData.type === 'email' ? 'Email Content' : formData.type === 'sms' ? 'SMS Message' : 'Campaign Content'}
              </Label>
              <Textarea
                id="content"
                placeholder={
                  formData.type === 'email' 
                    ? "Write your email content here..."
                    : formData.type === 'sms'
                    ? "Write your SMS message here (keep it under 160 characters)..."
                    : "Write your campaign content here..."
                }
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
                maxLength={formData.type === 'sms' ? 160 : undefined}
              />
              {formData.type === 'sms' && (
                <div className="text-xs text-gray-500 mt-1">
                  {formData.content.length}/160 characters
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label>Campaign Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget ($)</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty to save as draft
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!formData.name || !formData.type || !formData.targetAudience}
              >
                {formData.scheduledDate ? 'Schedule Campaign' : 'Save as Draft'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignModal;
