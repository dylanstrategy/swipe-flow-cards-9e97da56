
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { useResident } from '@/contexts/ResidentContext';
import { useToast } from '@/hooks/use-toast';

interface CancelNoticeButtonProps {
  residentId: string;
  residentName: string;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

const CancelNoticeButton = ({ 
  residentId, 
  residentName, 
  variant = 'outline',
  size = 'sm' 
}: CancelNoticeButtonProps) => {
  const { cancelNotice } = useResident();
  const { toast } = useToast();

  const handleCancelNotice = () => {
    console.log(`🚫 CANCEL NOTICE - Resident ${residentId} (${residentName})`);
    
    cancelNotice(residentId);
    
    toast({
      title: "Notice Cancelled",
      description: `Notice to vacate for ${residentName} has been cancelled. Status restored to current.`,
    });
  };

  return (
    <Button
      onClick={handleCancelNotice}
      variant={variant}
      size={size}
      className="flex items-center gap-1"
    >
      <X className="w-3 h-3" />
      Cancel Notice
    </Button>
  );
};

export default CancelNoticeButton;
