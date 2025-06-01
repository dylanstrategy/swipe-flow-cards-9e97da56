
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, DollarSign, FileText } from 'lucide-react';

interface RenewalFormProps {
  residentName?: string;
  currentRent?: number;
  isOperator?: boolean;
  onClose?: () => void;
}

interface RenewalFormData {
  renewalTerm: string;
  proposedRent: number;
  startDate: string;
  specialTerms?: string;
  notes?: string;
}

const RenewalForm = ({ residentName, currentRent = 0, isOperator = false, onClose }: RenewalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<RenewalFormData>({
    defaultValues: {
      renewalTerm: '12',
      proposedRent: currentRent,
      startDate: '',
      specialTerms: '',
      notes: ''
    }
  });

  const onSubmit = async (data: RenewalFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Lease Renewal Submitted",
      description: `Renewal ${isOperator ? 'offer sent' : 'request submitted'} successfully for ${residentName || 'resident'}.`,
    });
    
    setIsSubmitting(false);
    onClose?.();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>{isOperator ? 'Submit Lease Renewal Offer' : 'Request Lease Renewal'}</span>
        </CardTitle>
        {residentName && (
          <p className="text-sm text-gray-600">For: {residentName}</p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="renewalTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renewal Term (months)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="18">18 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proposedRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{isOperator ? 'Proposed Rent' : 'Expected Rent'}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Renewal Start Date</span>
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
              name="specialTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Terms</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special terms or conditions..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes..."
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
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : (isOperator ? 'Send Renewal Offer' : 'Submit Renewal Request')}
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

export default RenewalForm;
