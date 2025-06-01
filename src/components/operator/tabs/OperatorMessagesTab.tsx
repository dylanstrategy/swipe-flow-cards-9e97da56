
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OperatorMessagesTab = () => {
  const messages = [
    {
      id: 1,
      from: 'Unit 204 - John Doe',
      subject: 'HVAC Not Working',
      preview: 'The air conditioning in my unit stopped working this morning...',
      time: '2 hours ago',
      priority: 'urgent',
      category: 'maintenance'
    },
    {
      id: 2,
      from: 'Unit 156 - Sarah Johnson',
      subject: 'Lease Renewal Question',
      preview: 'I received my lease renewal notice and have some questions...',
      time: '4 hours ago',
      priority: 'normal',
      category: 'leasing'
    },
    {
      id: 3,
      from: 'Maintenance Team',
      subject: 'Work Order #1234 Complete',
      preview: 'Pool maintenance has been completed. All systems operational...',
      time: 'Yesterday',
      priority: 'low',
      category: 'maintenance'
    },
    {
      id: 4,
      from: 'Unit 302 - Mike Wilson',
      subject: 'Late Fee Inquiry',
      preview: 'I was charged a late fee but I believe my payment was on time...',
      time: '2 days ago',
      priority: 'normal',
      category: 'collections'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'leasing': return 'bg-green-100 text-green-800';
      case 'collections': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages & Notifications</h1>
        <p className="text-gray-600">Resident communications and system alerts</p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{message.from}</span>
                  <Badge className={getPriorityColor(message.priority)}>
                    {message.priority}
                  </Badge>
                  <Badge variant="outline" className={getCategoryColor(message.category)}>
                    {message.category}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">{message.time}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
              <p className="text-gray-600 text-sm">{message.preview}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OperatorMessagesTab;
