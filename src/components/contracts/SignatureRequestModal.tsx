
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, User, Mail, FileText } from 'lucide-react';
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
    signerName: '',
    signerEmail: '',
    documentName: '',
    message: 'Please review and sign this document at your earliest convenience.',
  });

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
      // In a real implementation, you would first upload the template to SignNow
      // For now, we'll simulate the process
      const signatureRequest = await signNowService.sendForSignature({
        templateId: template.id,
        signerEmail: formData.signerEmail,
        signerName: formData.signerName,
        documentName: formData.documentName,
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
