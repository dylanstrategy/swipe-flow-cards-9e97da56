
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, ClipboardCheck, Camera, FileText } from 'lucide-react';
import { EventTask } from '@/types/eventTasks';

interface FinalInspectionModalProps {
  task: EventTask;
  onClose: () => void;
  onComplete: () => void;
}

const FinalInspectionModal = ({ task, onClose, onComplete }: FinalInspectionModalProps) => {
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [photosUploaded, setPhotosUploaded] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const canComplete = inspectionNotes.trim() && photosUploaded && reportGenerated && confirmed;

  const handleComplete = () => {
    if (canComplete) {
      console.log('Final inspection completed:', {
        taskId: task.id,
        notes: inspectionNotes,
        photosUploaded,
        reportGenerated
      });
      onComplete();
    }
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setPhotosUploaded(true);
  };

  const handleGenerateReport = () => {
    // Simulate report generation
    if (inspectionNotes.trim()) {
      setReportGenerated(true);
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
        
        <div className="space-y-4">
          {/* Inspection Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Inspection Notes: <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              placeholder="Document findings, issues, or completion status..."
              rows={3}
            />
          </div>

          {/* Photo Upload */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Upload Photos</span>
            </div>
            <Button
              size="sm"
              variant={photosUploaded ? "default" : "outline"}
              onClick={handlePhotoUpload}
              disabled={photosUploaded}
            >
              {photosUploaded ? '✓ Uploaded' : 'Upload'}
            </Button>
          </div>

          {/* Generate Report */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Generate Report</span>
            </div>
            <Button
              size="sm"
              variant={reportGenerated ? "default" : "outline"}
              onClick={handleGenerateReport}
              disabled={!inspectionNotes.trim() || reportGenerated}
            >
              {reportGenerated ? '✓ Generated' : 'Generate'}
            </Button>
          </div>

          {/* Final Confirmation */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="final-confirmation"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="final-confirmation" className="text-sm">
              I confirm the final inspection has been completed successfully
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
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
