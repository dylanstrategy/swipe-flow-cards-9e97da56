
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, FileText, Camera, MapPin, CreditCard, Key, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoveOutStepModalProps {
  stepId: string;
  onComplete: () => void;
  onClose: () => void;
}

const MoveOutStepModal = ({ stepId, onComplete, onClose }: MoveOutStepModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const stepConfig = {
    'notice-to-vacate': {
      title: 'Notice to Vacate',
      icon: <FileText className="w-6 h-6" />,
      description: 'Upload your signed Notice to Vacate form',
      type: 'upload'
    },
    'forwarding-address': {
      title: 'Forwarding Address',
      icon: <MapPin className="w-6 h-6" />,
      description: 'Provide your new address for deposit return',
      type: 'form'
    },
    'final-inspection': {
      title: 'Final Inspection',
      icon: <Camera className="w-6 h-6" />,
      description: 'Complete your move-out inspection',
      type: 'inspection'
    },
    'exit-survey': {
      title: 'Exit Survey',
      icon: <FileText className="w-6 h-6" />,
      description: 'Share your feedback about your residency',
      type: 'survey'
    },
    'key-return': {
      title: 'Key Return',
      icon: <Key className="w-6 h-6" />,
      description: 'Confirm return of all keys and access cards',
      type: 'confirmation'
    },
    'final-balance': {
      title: 'Final Balance Payment',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Pay any remaining balance on your account',
      type: 'payment'
    },
    'deposit-release': {
      title: 'Deposit Release',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Confirm deposit release details',
      type: 'confirmation'
    },
    'move-out-confirmation': {
      title: 'Move-Out Confirmation',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Final confirmation of move-out completion',
      type: 'confirmation'
    }
  };

  const currentStep = stepConfig[stepId as keyof typeof stepConfig];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Step Completed",
      description: `${currentStep.title} has been completed successfully.`,
    });
    
    setIsSubmitting(false);
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'upload':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Upload your signed Notice to Vacate form</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] })}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Address
              </label>
              <Textarea
                placeholder="Enter your complete forwarding address..."
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                placeholder="Your contact phone number"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        );

      case 'inspection':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Inspection Options</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Schedule with maintenance team</p>
                <p>• Upload a video walkthrough</p>
                <p>• Request virtual inspection</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="w-4 h-4 mr-2" />
                Upload Video Walkthrough
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Schedule Inspection
              </Button>
            </div>
          </div>
        );

      case 'survey':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Experience Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`w-10 h-10 rounded-full ${
                      formData.rating === rating 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <Textarea
                placeholder="Share your feedback about your residency..."
                value={formData.comments || ''}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Payment Status</h4>
              <p className="text-sm text-green-800">
                Current Balance: $0.00
              </p>
              <p className="text-sm text-green-600 mt-2">
                ✓ No outstanding balance
              </p>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Confirmation Required</h4>
              <p className="text-sm text-gray-700">
                Please confirm that you have completed this step.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {currentStep.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{currentStep.title}</CardTitle>
              <p className="text-sm text-gray-600">{currentStep.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Processing...' : 'Complete Step'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoveOutStepModal;
