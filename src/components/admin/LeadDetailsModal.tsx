
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Edit,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeadDetailsModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetailsModal = ({ lead, isOpen, onClose }: LeadDetailsModalProps) => {
  const { toast } = useToast();

  if (!lead) return null;

  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${lead.name}`,
    });
  };

  const handleScheduleTour = () => {
    toast({
      title: "Tour Scheduled",
      description: `Tour scheduled with ${lead.name}`,
    });
  };

  const handleCreateContract = () => {
    toast({
      title: "Contract Created",
      description: `Contract created for ${lead.name}`,
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Lead Details - {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{lead.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {lead.phone}
                    </div>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1)}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lead Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{lead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{lead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Source</label>
                  <p className="text-gray-900">{lead.source || 'Website'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Lead Date</label>
                  <p className="text-gray-900">{new Date(lead.date).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Budget</label>
                  <p className="text-gray-900">${lead.budget?.toLocaleString() || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Move-in Date</label>
                  <p className="text-gray-900">{lead.moveInDate || 'Flexible'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Property Type</label>
                  <p className="text-gray-900">{lead.propertyType || 'Any'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Bedrooms</label>
                  <p className="text-gray-900">{lead.bedrooms || 'Any'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{lead.notes || 'No notes available'}</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button onClick={handleSendMessage} className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={handleScheduleTour} className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Tour
                </Button>
                <Button variant="outline" onClick={handleCreateContract} className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;
