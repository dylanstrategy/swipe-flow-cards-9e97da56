
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, Key } from 'lucide-react';
import { signNowService } from '@/services/signNowService';

interface SignNowConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

const SignNowConfigModal: React.FC<SignNowConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigured
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.clientId || !formData.clientSecret) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Client ID and Client Secret",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update the service configuration
      signNowService.updateConfig(formData.clientId, formData.clientSecret);
      
      // Test the configuration by attempting to authenticate
      await signNowService.authenticate();

      toast({
        title: "Configuration Saved",
        description: "SignNow has been configured successfully",
      });

      onConfigured();
      onClose();
      setFormData({ clientId: '', clientSecret: '' });
    } catch (error) {
      console.error('SignNow configuration error:', error);
      toast({
        title: "Configuration Failed",
        description: "Please check your credentials and try again",
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
            <Settings className="w-5 h-5" />
            Configure SignNow
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Enter your SignNow API credentials to enable contract signing functionality.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="client-id" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Client ID *
              </Label>
              <Input
                id="client-id"
                value={formData.clientId}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                placeholder="Your SignNow Client ID"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="client-secret" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Client Secret *
              </Label>
              <Input
                id="client-secret"
                type="password"
                value={formData.clientSecret}
                onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                placeholder="Your SignNow Client Secret"
                className="mt-1"
              />
            </div>
          </div>

          <div className="p-3 border rounded-lg">
            <h5 className="font-medium mb-2">How to get your API credentials:</h5>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Sign up for a SignNow developer account</li>
              <li>2. Create an application in your developer dashboard</li>
              <li>3. Copy the Client ID and Client Secret</li>
              <li>4. Paste them above and click Save</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignNowConfigModal;
