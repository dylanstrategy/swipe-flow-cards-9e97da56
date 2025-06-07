
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
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            Lead Details - {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-1">
            {/* Lead Header */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="space-y-3 min-w-0 flex-1">
                    <h2 className="text-xl font-bold break-words">{lead.name}</h2>
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="break-all">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="break-all">{lead.phone}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1)}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lead Information */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 break-all text-sm">{lead.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900 break-all text-sm">{lead.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Source</label>
                    <p className="text-gray-900 text-sm">{lead.source || 'Website'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Lead Date</label>
                    <p className="text-gray-900 text-sm">{new Date(lead.date).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Budget</label>
                    <p className="text-gray-900 text-sm">${lead.budget?.toLocaleString() || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Move-in Date</label>
                    <p className="text-gray-900 text-sm">{lead.moveInDate || 'Flexible'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Property Type</label>
                    <p className="text-gray-900 text-sm">{lead.propertyType || 'Any'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bedrooms</label>
                    <p className="text-gray-900 text-sm">{lead.bedrooms || 'Any'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 text-sm break-words">{lead.notes || 'No notes available'}</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Button onClick={handleSendMessage} className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={handleScheduleTour} className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Tour
                  </Button>
                  <Button variant="outline" onClick={handleCreateContract} className="w-full sm:col-span-2 lg:col-span-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;
