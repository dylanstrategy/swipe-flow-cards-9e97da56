
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useResident } from '@/contexts/ResidentContext';
import { Calendar, AlertTriangle, FileText } from 'lucide-react';

interface NoticeToVacateFormProps {
  residentName?: string;
  isOperator?: boolean;
  onClose?: () => void;
}

interface NoticeFormData {
  moveOutDate: string;
  reason: string;
  noticeReason?: string;
  forwardingAddress?: string;
  notes?: string;
}

const NoticeToVacateForm = ({ residentName, isOperator = false, onClose }: NoticeToVacateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { submitNoticeToVacate, profile, updateProfile, forceStateUpdate, updateResidentStatus } = useResident();
  
  const form = useForm<NoticeFormData>({
    defaultValues: {
      moveOutDate: '',
      reason: '',
      noticeReason: '',
      forwardingAddress: '',
      notes: ''
    }
  });

  const onSubmit = async (data: NoticeFormData) => {
    console.log('📋 FORM SUBMISSION - Notice to Vacate form submitted', data);
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // First, update the status using the dedicated status update function
    console.log('📋 FORM SUBMISSION - Calling updateResidentStatus');
    updateResidentStatus(profile.id, 'notice');
    
    // Then, submit notice to vacate - this will create the move-out checklist automatically
    console.log('📋 FORM SUBMISSION - Calling submitNoticeToVacate');
    submitNoticeToVacate(profile.id, data);
    
    // Force multiple state updates to ensure UI refresh
    setTimeout(() => {
      console.log('📋 FORM SUBMISSION - Force state update #1');
      forceStateUpdate();
      
      // Additional update with profile changes
      updateProfile({ 
        status: 'notice',
        noticeToVacateSubmitted: true,
        moveOutDate: data.moveOutDate,
        forwardingAddress: data.forwardingAddress || ''
      });
    }, 100);
    
    // Final force update to ensure everything is synced
    setTimeout(() => {
      console.log('📋 FORM SUBMISSION - Force state update #2');
      forceStateUpdate();
    }, 300);
    
    toast({
      title: "Notice to Vacate Submitted",
      description: `Notice ${isOperator ? 'sent' : 'submitted'} successfully. Move-out checklist has been created.`,
    });
    
    setIsSubmitting(false);
    onClose?.();
  };

  const reasonOptions = isOperator 
    ? [
        { value: 'lease_violation', label: 'Lease Violation' },
        { value: 'non_payment', label: 'Non-Payment of Rent' },
        { value: 'property_damage', label: 'Property Damage' },
        { value: 'unauthorized_occupant', label: 'Unauthorized Occupant' },
        { value: 'other', label: 'Other' }
      ]
    : [
        { value: 'relocating', label: 'Relocating' },
        { value: 'downsizing', label: 'Downsizing' },
        { value: 'upsizing', label: 'Upsizing' },
        { value: 'financial', label: 'Financial Reasons' },
        { value: 'job_change', label: 'Job Change' },
        { value: 'family_change', label: 'Family Change' },
        { value: 'other', label: 'Other' }
      ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>{isOperator ? 'Issue Notice to Vacate' : 'Submit Notice to Vacate'}</span>
        </CardTitle>
        {residentName && (
          <p className="text-sm text-gray-600">For: {residentName}</p>
        )}
        {!isOperator && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Submitting this notice will create a move-out checklist to guide you through the process.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="moveOutDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Move-Out Date</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for {isOperator ? 'Notice' : 'Moving Out'}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reasonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('reason') === 'other' && (
              <FormField
                control={form.control}
                name="noticeReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide details..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isOperator && (
              <FormField
                control={form.control}
                name="forwardingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forwarding Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="New address for security deposit return..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional information..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                variant={isOperator ? "destructive" : "default"}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : (isOperator ? 'Issue Notice' : 'Submit Notice')}
              </Button>
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NoticeToVacateForm;
