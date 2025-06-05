
import React, { useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MessagingSetupProps {
  onBack: () => void;
}

const MessagingSetup = ({ onBack }: MessagingSetupProps) => {
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Tour Confirmation',
      category: 'Tours',
      subject: 'Your Tour is Confirmed!',
      content: 'Hi {{resident_name}}, your tour is scheduled for {{date}} at {{time}}. We look forward to showing you around!',
      trigger: 'tour_scheduled',
      active: true
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
    { id: 'community', name: 'Community', color: 'bg-pink-100 text-pink-800' }
  ];

  const triggerOptions = [
    'tour_scheduled', 'tour_completed', 'application_received', 'lease_signed',
    'move_in_scheduled', 'move_in_completed', 'work_order_created', 'work_order_completed',
    'renewal_notice', 'lease_expiring', 'payment_received', 'payment_overdue'
  ];

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
      active: true
    });

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
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {templateCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="trigger">Trigger Event</Label>
              <select
                value={formData.trigger}
                onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {triggerOptions.map(trigger => (
                  <option key={trigger} value={trigger}>
                    {trigger.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
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
              <p className="text-sm text-gray-500 mt-1">
                Use variables like {{`resident_name`}}, {{`date`}}, {{`time`}}, {{`property_name`}}
              </p>
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
          <p className="text-gray-600">Configure automated message templates</p>
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
                    <p className="text-sm text-gray-500 mb-3">
                      Trigger: {template.trigger.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
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
