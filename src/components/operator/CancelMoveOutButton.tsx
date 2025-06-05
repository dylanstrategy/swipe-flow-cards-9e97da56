
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, X } from 'lucide-react';
import { useResident } from '@/contexts/ResidentContext';
import { useToast } from '@/hooks/use-toast';

interface CancelMoveOutButtonProps {
  residentId: string;
  residentName: string;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

const CancelMoveOutButton = ({ 
  residentId, 
  residentName, 
  variant = 'outline',
  size = 'sm' 
}: CancelMoveOutButtonProps) => {
  const { cancelMoveOut } = useResident();
  const { toast } = useToast();

  const handleCancelMoveOut = () => {
    console.log(`🚫 CANCEL MOVE-OUT - Resident ${residentId} (${residentName})`);
    
    cancelMoveOut(residentId);
    
    toast({
      title: "Move-Out Cancelled",
      description: `Move-out process for ${residentName} has been cancelled. Status restored to current.`,
    });
  };

  return (
    <Button
      onClick={handleCancelMoveOut}
      variant={variant}
      size={size}
      className="flex items-center gap-1"
    >
      <X className="w-3 h-3" />
      Cancel Move-Out
    </Button>
  );
};

export default CancelMoveOutButton;
