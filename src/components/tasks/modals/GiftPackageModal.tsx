
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Gift, Package, CheckCircle } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface GiftPackageModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const GiftPackageModal = ({ task, onClose, onComplete }: GiftPackageModalProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState('');

  const giftItems = [
    'Welcome letter',
    'Local business coupons',
    'Property amenities guide',
    'Emergency contact information',
    'Community calendar',
    'Move-in checklist'
  ];

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const canComplete = selectedItems.length > 0;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Gift package prepared with items:', selectedItems, 'Custom:', customItems);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Prepare Gift Package</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="space-y-3 mb-4">
          <h4 className="font-medium">Select items to include:</h4>
          {giftItems.map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={() => handleItemToggle(item)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Additional Items:
          </label>
          <Textarea
            value={customItems}
            onChange={(e) => setCustomItems(e.target.value)}
            placeholder="List any custom items to include..."
            rows={2}
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
            <Package className="w-4 h-4 mr-2" />
            Package Ready
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftPackageModal;
