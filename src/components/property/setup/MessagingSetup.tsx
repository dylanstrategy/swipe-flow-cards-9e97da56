
import React, { useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface MessagingSetupProps {
  onBack: () => void;
}

const MessagingSetup = ({ onBack }: MessagingSetupProps) => {
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Tour Confirmation',
      category: 'tours',
      subject: 'Your Tour is Confirmed!',
      content: 'Hi {{resident_name}}, your tour is scheduled for {{date}} at {{time}}. We look forward to showing you around!',
      trigger: 'tour_scheduled',
      frequency: 'immediate',
      timing: { value: 0, unit: 'minutes' },
      active: true,
      dataSource: 'tour_system'
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [showNewTemplate, setShowNewTemplate] = useState(false);

  const templateCategories = [
    { id: 'tours', name: 'Tours', color: 'bg-blue-100 text-blue-800' },
    { id: 'movein', name: 'Move-In', color: 'bg-green-100 text-green-800' },
    { id: 'moveout', name: 'Move-Out', color: 'bg-red-100 text-red-800' },
    { id: 'renewals', name: 'Renewals', color: 'bg-purple-100 text-purple-800' },
    { id: 'maintenance', name: 'Maintenance', color: 'bg-orange-100 text-orange-800' },
    { id: 'community', name: 'Community', color: 'bg-pink-100 text-pink-800' },
    { id: 'leasing', name: 'Leasing', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'payments', name: 'Payments', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const triggerOptions = [
    // Tour triggers
    { value: 'tour_scheduled', label: 'Tour Scheduled', category: 'tours' },
    { value: 'tour_completed', label: 'Tour Completed', category: 'tours' },
    { value: 'tour_reminder', label: 'Tour Reminder', category: 'tours' },
    { value: 'tour_no_show', label: 'Tour No-Show', category: 'tours' },
    
    // Application/Leasing triggers
    { value: 'application_received', label: 'Application Received', category: 'leasing' },
    { value: 'application_approved', label: 'Application Approved', category: 'leasing' },
    { value: 'application_denied', label: 'Application Denied', category: 'leasing' },
    { value: 'lease_signed', label: 'Lease Signed', category: 'leasing' },
    { value: 'lease_pending', label: 'Lease Pending Signature', category: 'leasing' },
    
    // Lease expiration triggers
    { value: 'lease_expiring_90_days', label: '90 Days Before Lease End', category: 'renewals' },
    { value: 'lease_expiring_60_days', label: '60 Days Before Lease End', category: 'renewals' },
    { value: 'lease_expiring_30_days', label: '30 Days Before Lease End', category: 'renewals' },
    { value: 'lease_expiring_14_days', label: '14 Days Before Lease End', category: 'renewals' },
    { value: 'lease_expiring_7_days', label: '7 Days Before Lease End', category: 'renewals' },
    
    // Renewal triggers
    { value: 'renewal_notice_sent', label: 'Renewal Notice Sent', category: 'renewals' },
    { value: 'renewal_offer_sent', label: 'Renewal Offer Sent', category: 'renewals' },
    { value: 'renewal_signed', label: 'Renewal Signed', category: 'renewals' },
    { value: 'renewal_declined', label: 'Renewal Declined', category: 'renewals' },
    
    // Move-in triggers
    { value: 'move_in_scheduled', label: 'Move-In Scheduled', category: 'movein' },
    { value: 'move_in_completed', label: 'Move-In Completed', category: 'movein' },
    { value: 'move_in_reminder', label: 'Move-In Reminder', category: 'movein' },
    
    // Move-out triggers
    { value: 'notice_to_vacate_received', label: 'Notice to Vacate Received', category: 'moveout' },
    { value: 'move_out_scheduled', label: 'Move-Out Scheduled', category: 'moveout' },
    { value: 'move_out_completed', label: 'Move-Out Completed', category: 'moveout' },
    
    // Maintenance triggers
    { value: 'work_order_created', label: 'Work Order Created', category: 'maintenance' },
    { value: 'work_order_scheduled', label: 'Work Order Scheduled', category: 'maintenance' },
    { value: 'work_order_completed', label: 'Work Order Completed', category: 'maintenance' },
    { value: 'work_order_delayed', label: 'Work Order Delayed', category: 'maintenance' },
    
    // Payment triggers
    { value: 'payment_received', label: 'Payment Received', category: 'payments' },
    { value: 'payment_overdue', label: 'Payment Overdue', category: 'payments' },
    { value: 'payment_reminder', label: 'Payment Reminder', category: 'payments' },
    
    // Community triggers
    { value: 'event_scheduled', label: 'Community Event Scheduled', category: 'community' },
    { value: 'amenity_maintenance', label: 'Amenity Maintenance Notice', category: 'community' }
  ];

  const dataSourceOptions = [
    { value: 'tour_system', label: 'Tour Management System' },
    { value: 'lease_management', label: 'Lease Management System' },
    { value: 'pricing_engine', label: 'Pricing Engine' },
    { value: 'payment_system', label: 'Payment System' },
    { value: 'maintenance_system', label: 'Maintenance System' },
    { value: 'resident_portal', label: 'Resident Portal' },
    { value: 'crm_system', label: 'CRM System' }
  ];

  const availableVariables = {
    tour_system: ['resident_name', 'date', 'time', 'unit_number', 'leasing_agent', 'property_name'],
    lease_management: ['resident_name', 'lease_start_date', 'lease_end_date', 'lease_term', 'rent_amount', 'unit_number', 'renewal_rate', 'renewal_term_options'],
    pricing_engine: ['current_rent', 'market_rent', 'renewal_rate', 'concessions_available', 'lease_term_pricing'],
    payment_system: ['amount_due', 'due_date', 'payment_method', 'late_fee', 'balance'],
    maintenance_system: ['work_order_number', 'scheduled_date', 'technician_name', 'estimated_duration'],
    resident_portal: ['resident_name', 'unit_number', 'move_in_date', 'emergency_contact'],
    crm_system: ['resident_name', 'contact_info', 'preferences', 'interaction_history']
  };

  const handleSaveTemplate = (template: any) => {
    if (template.id) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates(prev => [...prev, { ...template, id: Date.now().toString() }]);
    }
    setEditingTemplate(null);
    setShowNewTemplate(false);
  };

  const TemplateForm = ({ template, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(template || {
      name: '',
      category: 'tours',
      subject: '',
      content: '',
      trigger: 'tour_scheduled',
      frequency: 'immediate',
      timing: { value: 0, unit: 'minutes' },
      active: true,
      dataSource: 'tour_system'
    });

    const selectedDataSource = dataSourceOptions.find(ds => ds.value === formData.dataSource);
    const availableVars = availableVariables[formData.dataSource as keyof typeof availableVariables] || [];

    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {template ? 'Edit Template' : 'New Template'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Tour Confirmation"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trigger">Trigger Event</Label>
                <Select value={formData.trigger} onValueChange={(value) => setFormData(prev => ({ ...prev, trigger: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerOptions.map(trigger => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dataSource">Data Source</Label>
                <Select value={formData.dataSource} onValueChange={(value) => setFormData(prev => ({ ...prev, dataSource: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSourceOptions.map(source => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Message Timing
              </Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Send Immediately</SelectItem>
                    <SelectItem value="scheduled">Schedule</SelectItem>
                    <SelectItem value="reminder">Send as Reminder</SelectItem>
                  </SelectContent>
                </Select>
                {formData.frequency !== 'immediate' && (
                  <>
                    <Input
                      type="number"
                      value={formData.timing.value}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        timing: { ...prev.timing, value: parseInt(e.target.value) }
                      }))}
                      placeholder="0"
                    />
                    <Select 
                      value={formData.timing.unit} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        timing: { ...prev.timing, unit: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Your Tour is Confirmed!"
              />
            </div>

            <div>
              <Label htmlFor="content">Message Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                placeholder="Hi {{resident_name}}, your tour is scheduled for {{date}} at {{time}}..."
              />
              <div className="mt-2 p-3 bg-gray-50 rounded border">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Available Variables for {selectedDataSource?.label}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {availableVars.map(variable => (
                    <Badge key={variable} variant="outline" className="text-xs cursor-pointer" 
                           onClick={() => {
                             const textarea = document.querySelector('textarea');
                             if (textarea) {
                               const cursorPos = textarea.selectionStart;
                               const textBefore = formData.content.substring(0, cursorPos);
                               const textAfter = formData.content.substring(cursorPos);
                               const newContent = textBefore + `{{${variable}}}` + textAfter;
                               setFormData(prev => ({ ...prev, content: newContent }));
                             }
                           }}>
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label>Active Template</Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => onSave(formData)} className="flex-1">
                Save Template
              </Button>
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Message Automations</h2>
          <p className="text-gray-600">Configure automated message templates with timing and data integration</p>
        </div>
        <Button onClick={() => setShowNewTemplate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {showNewTemplate && (
        <TemplateForm
          onSave={handleSaveTemplate}
          onCancel={() => setShowNewTemplate(false)}
        />
      )}

      {editingTemplate && (
        <TemplateForm
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => setEditingTemplate(null)}
        />
      )}

      <div className="space-y-4">
        {templates.map((template) => {
          const category = templateCategories.find(c => c.id === template.category);
          const trigger = triggerOptions.find(t => t.value === template.trigger);
          const dataSource = dataSourceOptions.find(ds => ds.value === template.dataSource);
          
          return (
            <Card key={template.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <Badge className={category?.color}>
                        {category?.name}
                      </Badge>
                      <Badge className={template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {template.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{template.subject}</p>
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span>Trigger: {trigger?.label}</span>
                      <span>•</span>
                      <span>Timing: {template.frequency === 'immediate' ? 'Immediate' : `${template.timing.value} ${template.timing.unit} ${template.frequency === 'scheduled' ? 'after trigger' : 'before'}`}</span>
                      <span>•</span>
                      <span>Data: {dataSource?.label}</span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {template.content.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTemplates(prev => prev.filter(t => t.id !== template.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button className="flex-1">
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default MessagingSetup;
