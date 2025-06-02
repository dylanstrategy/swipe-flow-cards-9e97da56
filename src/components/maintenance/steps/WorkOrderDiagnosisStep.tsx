
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp } from 'lucide-react';

interface WorkOrderDiagnosisStepProps {
  diagnosisNotes: string;
  setDiagnosisNotes: (notes: string) => void;
}

const WorkOrderDiagnosisStep = ({ diagnosisNotes, setDiagnosisNotes }: WorkOrderDiagnosisStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Diagnosis & Tech Notes</h3>
        <Textarea
          placeholder="Enter your diagnosis and technical notes..."
          value={diagnosisNotes}
          onChange={(e) => setDiagnosisNotes(e.target.value)}
          className="min-h-32"
        />
      </div>

      {diagnosisNotes.trim() && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Swipe up to choose resolution</p>
          <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default WorkOrderDiagnosisStep;
