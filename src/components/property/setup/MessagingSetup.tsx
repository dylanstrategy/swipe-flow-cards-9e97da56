
import React, { useState } from 'react';
import { MessageSquare, Plus, Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface MessagingSetupProps {
  onBack: () => void;
}

const MessagingSetup = ({ onBack }: MessagingSetupProps) => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Tour Confirmation',
      trigger: 'Tour Scheduled',
      message: 'Hi {name}! Your tour is confirmed for {date} at {time}. See you soon!',
      active: true
    },
    {
      id: 2,
      name: 'Application Received',
      trigger: 'Application Submitted',
      message: 'Thanks {name}! We received your application and will review it within 24 hours.',
      active: true
    },
    {
      id: 3,
      name: 'Move-in Reminder',
      trigger: '7 Days Before Move-in',
      message: 'Hi {name}! Your move-in date is approaching. Here\'s what you need to know...',
      active: false
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Property Setup
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Automations</h1>
          <p className="text-gray-600">Set up automated messaging templates and workflows</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Message Templates
              </CardTitle>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge className={template.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {template.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Trigger: {template.trigger}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                {editingTemplate === template.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Message Content</Label>
                      <Textarea
                        value={template.message}
                        onChange={(e) => {
                          setTemplates(templates.map(t => 
                            t.id === template.id ? {...t, message: e.target.value} : t
                          ));
                        }}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setEditingTemplate(null)}>
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingTemplate(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    {template.message}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Variables Help */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Available Variables</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
              <code>{'{name}'}</code>
              <code>{'{date}'}</code>
              <code>{'{time}'}</code>
              <code>{'{unit}'}</code>
              <code>{'{rent}'}</code>
              <code>{'{property}'}</code>
              <code>{'{phone}'}</code>
              <code>{'{email}'}</code>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save Templates
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSetup;
