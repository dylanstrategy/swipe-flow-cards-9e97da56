
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InspectionModalProps {
  onClose: () => void;
  onComplete: () => void;
  taskTitle: string;
  inspectionType?: 'move-in' | 'move-out' | 'maintenance';
}

const InspectionModal = ({ onClose, onComplete, taskTitle, inspectionType = 'move-in' }: InspectionModalProps) => {
  const { toast } = useToast();
  const [inspectionItems, setInspectionItems] = useState([
    { id: 1, item: 'Walls and Paint', status: 'good', notes: '' },
    { id: 2, item: 'Flooring', status: 'good', notes: '' },
    { id: 3, item: 'Kitchen Appliances', status: 'good', notes: '' },
    { id: 4, item: 'Bathroom Fixtures', status: 'good', notes: '' },
    { id: 5, item: 'Windows and Doors', status: 'good', notes: '' },
    { id: 6, item: 'HVAC System', status: 'good', notes: '' },
  ]);
  const [overallNotes, setOverallNotes] = useState('');

  const updateItemStatus = (id: number, status: string) => {
    setInspectionItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const updateItemNotes = (id: number, notes: string) => {
    setInspectionItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const handleCompleteInspection = () => {
    const incompleteItems = inspectionItems.filter(item => !item.status);
    if (incompleteItems.length > 0) {
      toast({
        title: "Please complete all inspection items",
        variant: "destructive"
      });
      return;
    }

    onComplete();
    toast({
      title: "Inspection Completed",
      description: "Inspection report has been saved and submitted.",
    });
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{taskTitle}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          <div className="grid gap-4">
            {inspectionItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{item.item}</h4>
                  <div className="flex gap-2">
                    {['good', 'fair', 'poor'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateItemStatus(item.id, status)}
                        className={`px-3 py-1 text-xs rounded-full border ${
                          item.status === status 
                            ? getStatusColor(status)
                            : 'text-gray-500 bg-gray-50 border-gray-200'
                        }`}
                      >
                        {status === 'good' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {status === 'poor' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <textarea
                  placeholder="Add notes or observations..."
                  value={item.notes}
                  onChange={(e) => updateItemNotes(item.id, e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Inspection Notes
            </label>
            <textarea
              placeholder="General observations, recommendations, or additional comments..."
              value={overallNotes}
              onChange={(e) => setOverallNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <Button onClick={handleCompleteInspection} className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Inspection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InspectionModal;
