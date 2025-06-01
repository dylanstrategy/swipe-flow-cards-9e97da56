
import React from 'react';
import { Star } from 'lucide-react';
import PriorityRanker from '../PriorityRanker';

interface Priority {
  id: string;
  label: string;
  rank?: number;
}

interface PrioritiesStepProps {
  priorities: Priority[];
  onUpdate: (priorities: Priority[]) => void;
}

const PrioritiesStep = ({ priorities, onUpdate }: PrioritiesStepProps) => {
  const selectedCount = priorities.filter(p => p.rank).length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Star className="mx-auto text-yellow-500" size={32} />
        <h2 className="text-xl font-bold text-gray-900">
          What matters most to you?
        </h2>
        <p className="text-gray-600">
          Choose your top 5 priorities and rank them in order of importance.
        </p>
      </div>

      <PriorityRanker 
        priorities={priorities} 
        onPrioritiesChange={onUpdate}
      />

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Selected: {selectedCount}/5
        </p>
        {selectedCount >= 5 && (
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            Swipe up to explore what makes home feel like home
          </div>
        )}
      </div>
    </div>
  );
};

export default PrioritiesStep;
