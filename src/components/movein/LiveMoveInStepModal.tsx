
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useLiveResident } from '@/contexts/LiveResidentContext';
import { useToast } from '@/hooks/use-toast';

interface LiveMoveInStepModalProps {
  stepId: string;
  onComplete: () => void;
  onClose: () => void;
}

const LiveMoveInStepModal = ({ stepId, onComplete, onClose }: LiveMoveInStepModalProps) => {
  const { resident, updateResidentField, loading } = useLiveResident();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  if (!resident) {
    return null;
  }

  const stepConfig = {
    'sign-lease': {
      title: 'Sign Lease Agreement',
      description: 'Review and digitally sign your lease agreement',
      field: 'move_in_checklist_complete',
      checkboxes: []
    },
    'payment': {
      title: 'Complete Payment',
      description: 'Make your initial payment and security deposit',
      field: 'payment_status',
      value: 'current',
      checkboxes: []
    },
    'renters-insurance': {
      title: "Upload Renter's Insurance",
      description: 'Provide proof of renter\'s insurance coverage',
      field: 'renter_insurance_uploaded',
      checkboxes: [
        { id: 'insurance', label: 'Insurance documentation uploaded', field: 'renter_insurance_uploaded' }
      ]
    },
    'utilities': {
      title: 'Set Up Utilities',
      description: 'Arrange electricity, gas, water, and internet services',
      field: 'pseg_setup',
      checkboxes: [
        { id: 'pseg', label: 'PSEG account setup complete', field: 'pseg_setup' }
      ]
    },
    'community-guidelines': {
      title: 'Review Community Guidelines',
      description: 'Read and acknowledge community rules',
      field: 'welcome_email_sent',
      checkboxes: [
        { id: 'welcome', label: 'Welcome email received and reviewed', field: 'welcome_email_sent' }
      ]
    },
    'move-in': {
      title: 'Complete Move-In',
      description: 'Final move-in inspection and key pickup',
      field: 'move_in_checklist_complete',
      checkboxes: [
        { id: 'smart_access', label: 'Smart access system setup', field: 'smart_access_setup' },
        { id: 'app_setup', label: 'Carson app setup complete', field: 'carson_app_setup' },
        { id: 'gift', label: 'Welcome gift delivered', field: 'gift_delivered' }
      ]
    }
  };

  const config = stepConfig[stepId as keyof typeof stepConfig];
  if (!config) return null;

  const handleCheckboxChange = async (field: string, checked: boolean) => {
    if (updating) return;

    try {
      setUpdating(true);
      await updateResidentField(field, checked);
      
      toast({
        title: "Updated",
        description: `${field.replace(/_/g, ' ')} has been ${checked ? 'completed' : 'unchecked'}`,
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Error",
        description: "Failed to update. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleComplete = async () => {
    try {
      setUpdating(true);
      
      if (config.field && config.value) {
        await updateResidentField(config.field, config.value);
      } else if (config.field) {
        await updateResidentField(config.field, true);
      }

      // Update onboarding status if this is the final step
      if (stepId === 'move-in') {
        await updateResidentField('onboarding_status', 'complete');
        await updateResidentField('status', 'active');
      }

      toast({
        title: "Step Completed",
        description: `${config.title} has been completed successfully.`,
      });

      onComplete();
    } catch (error) {
      console.error('Error completing step:', error);
      toast({
        title: "Error",
        description: "Failed to complete step. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">{config.description}</p>

          {/* Display assigned contacts if available */}
          {resident.assigned_operator_name && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900">Your Assigned Operator</h4>
              <p className="text-blue-700">{resident.assigned_operator_name}</p>
              {resident.assigned_operator_email && (
                <p className="text-sm text-blue-600">{resident.assigned_operator_email}</p>
              )}
            </div>
          )}

          {resident.assigned_vendor_name && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-900">Assigned Vendor</h4>
              <p className="text-green-700">{resident.assigned_vendor_name}</p>
              {resident.assigned_vendor_email && (
                <p className="text-sm text-green-600">{resident.assigned_vendor_email}</p>
              )}
            </div>
          )}

          {/* Live checkboxes for step completion */}
          {config.checkboxes.map((checkbox) => (
            <div key={checkbox.id} className="flex items-center space-x-2">
              <Checkbox
                id={checkbox.id}
                checked={!!resident[checkbox.field as keyof typeof resident]}
                onCheckedChange={(checked) => handleCheckboxChange(checkbox.field, !!checked)}
                disabled={updating || loading}
              />
              <label 
                htmlFor={checkbox.id} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {checkbox.label}
              </label>
              {resident[checkbox.field as keyof typeof resident] && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </div>
          ))}

          {/* Status display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span>Onboarding Status:</span>
              <Badge variant={resident.onboarding_status === 'complete' ? 'default' : 'secondary'}>
                {resident.onboarding_status || 'pending'}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span>Resident Status:</span>
              <Badge variant={resident.status === 'active' ? 'default' : 'secondary'}>
                {resident.status || 'pending'}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleComplete} 
              disabled={updating || loading}
              className="flex-1"
            >
              {updating ? 'Updating...' : 'Complete Step'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveMoveInStepModal;
