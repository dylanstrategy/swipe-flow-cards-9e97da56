
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, ClipboardCheck } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface GenericTaskModalProps {
  task: EventTask;
  eventType: string;
  onClose: () => void;
  onComplete: () => void;
}

const GenericTaskModal = ({ task, eventType, onClose, onComplete }: GenericTaskModalProps) => {
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const canComplete = confirmed;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Generic task completed:', task.title, 'Notes:', notes);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        {task.instructions && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-800">{task.instructions}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Completion Notes (Optional):
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about task completion..."
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="task-confirmed"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="task-confirmed" className="text-sm">
            I confirm this task has been completed
          </label>
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
            Complete Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenericTaskModal;
