
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Eye, ClipboardCheck } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface FinalInspectionModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const FinalInspectionModal = ({ task, onClose, onComplete }: FinalInspectionModalProps) => {
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const inspectionItems = [
    'Unit cleanliness verified',
    'All fixtures functioning properly',
    'No damage to walls or floors',
    'All appliances working',
    'HVAC system operational',
    'Windows and doors secure'
  ];

  const handleItemCheck = (item: string) => {
    setCheckedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const canComplete = checkedItems.length === inspectionItems.length;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Final inspection completed with notes:', inspectionNotes);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Final Inspection</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="space-y-3 mb-4">
          <h4 className="font-medium">Inspection Checklist:</h4>
          {inspectionItems.map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedItems.includes(item)}
                onChange={() => handleItemCheck(item)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Inspection Notes (Optional):
          </label>
          <Textarea
            value={inspectionNotes}
            onChange={(e) => setInspectionNotes(e.target.value)}
            placeholder="Any additional notes or observations..."
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!canComplete}
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Inspection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalInspectionModal;
