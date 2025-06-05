
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, User, Mail, FileText, Users } from 'lucide-react';
import { signNowService } from '@/services/signNowService';

interface ContractTemplate {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
}

interface SignatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ContractTemplate | null;
  onSignatureRequested?: (templateId: string, signerData: any) => void;
}

const SignatureRequestModal: React.FC<SignatureRequestModalProps> = ({
  isOpen,
  onClose,
  template,
  onSignatureRequested
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipientType: 'resident',
    signerName: '',
    signerEmail: '',
    documentName: '',
    message: 'Please review and sign this document at your earliest convenience.',
  });

  // Mock data - in real app, this would come from your backend
  const [residents] = useState([
    { id: '1', name: 'John Doe', email: 'john.doe@email.com', unit: '101' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@email.com', unit: '102' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@email.com', unit: '103' },
  ]);

  const [vendors] = useState([
    { id: '1', name: 'ABC Maintenance', email: 'contact@abcmaint.com', type: 'Maintenance' },
    { id: '2', name: 'ClearView Cleaning', email: 'info@clearview.com', type: 'Cleaning' },
    { id: '3', name: 'GreenSpace Landscaping', email: 'hello@greenspace.com', type: 'Landscaping' },
  ]);

  React.useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        documentName: `${template.name} - Signature Request`,
      }));
    }
  }, [template]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecipientSelect = (recipientId: string) => {
    const recipients = formData.recipientType === 'resident' ? residents : vendors;
    const recipient = recipients.find(r => r.id === recipientId);
    if (recipient) {
      setFormData(prev => ({
        ...prev,
        signerName: recipient.name,
        signerEmail: recipient.email,
      }));
    }
  };

  const handleSendForSignature = async () => {
    if (!template || !formData.signerName || !formData.signerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const signatureRequest = await signNowService.sendForSignature({
        templateId: template.id,
        signerEmail: formData.signerEmail,
        signerName: formData.signerName,
        documentName: formData.documentName,
        clientData: {
          recipientType: formData.recipientType,
        }
      });

      // Store the signature request locally
      const existingRequests = JSON.parse(localStorage.getItem('signature_requests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        templateId: template.id,
        templateName: template.name,
        signerName: formData.signerName,
        signerEmail: formData.signerEmail,
        documentName: formData.documentName,
        recipientType: formData.recipientType,
        status: 'pending',
        sentAt: new Date().toISOString(),
        signNowDocumentId: signatureRequest.id,
      };

      existingRequests.push(newRequest);
      localStorage.setItem('signature_requests', JSON.stringify(existingRequests));

      toast({
        title: "Signature Request Sent",
        description: `${formData.documentName} has been sent to ${formData.signerEmail} for signature`,
      });

      if (onSignatureRequested) {
        onSignatureRequested(template.id, formData);
      }

      onClose();
      setFormData({
        recipientType: 'resident',
        signerName: '',
        signerEmail: '',
        documentName: '',
        message: 'Please review and sign this document at your earliest convenience.',
      });
    } catch (error) {
      console.error('Signature request error:', error);
      toast({
        title: "Signature Request Failed",
        description: "There was an error sending the signature request. Please check your SignNow configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentRecipients = formData.recipientType === 'resident' ? residents : vendors;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send for Signature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {template && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">{template.name}</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">{template.fileName}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="recipient-type" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Recipient Type *
              </Label>
              <Select value={formData.recipientType} onValueChange={(value) => handleInputChange('recipientType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resident">Resident</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient-select">
                Select {formData.recipientType === 'resident' ? 'Resident' : 'Vendor'}
              </Label>
              <Select onValueChange={handleRecipientSelect}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={`Choose a ${formData.recipientType}`} />
                </SelectTrigger>
                <SelectContent>
                  {currentRecipients.map((recipient) => (
                    <SelectItem key={recipient.id} value={recipient.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{recipient.name}</span>
                        <span className="text-sm text-gray-500">
                          {formData.recipientType === 'resident' 
                            ? `Unit ${(recipient as any).unit}` 
                            : (recipient as any).type
                          }
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="signer-name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Signer Name *
              </Label>
              <Input
                id="signer-name"
                value={formData.signerName}
                onChange={(e) => handleInputChange('signerName', e.target.value)}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="signer-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Signer Email *
              </Label>
              <Input
                id="signer-email"
                type="email"
                value={formData.signerEmail}
                onChange={(e) => handleInputChange('signerEmail', e.target.value)}
                placeholder="john@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                value={formData.documentName}
                onChange={(e) => handleInputChange('documentName', e.target.value)}
                placeholder="Contract for signature"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Add a personal message..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSendForSignature} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send for Signature
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureRequestModal;
