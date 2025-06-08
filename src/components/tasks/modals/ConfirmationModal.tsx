
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConfirmationModalProps {
  onClose: () => void;
  onComplete: () => void;
  taskTitle: string;
  description?: string;
  confirmText?: string;
}

const ConfirmationModal = ({ 
  onClose, 
  onComplete, 
  taskTitle, 
  description = "Are you sure you want to complete this task?",
  confirmText = "Confirm"
}: ConfirmationModalProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    onComplete();
    toast({
      title: "Task Completed",
      description: `${taskTitle} has been marked as complete.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{taskTitle}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700">{description}</p>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
