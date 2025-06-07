
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import UnitTurnStepCard from './UnitTurnStepCard';

interface UnitTurnStepsViewProps {
  unitTurn: any;
  onBack: () => void;
  onStepClick: (step: any) => void;
  scheduledStepIds?: string[];
}

const UnitTurnStepsView: React.FC<UnitTurnStepsViewProps> = ({ 
  unitTurn, 
  onBack, 
  onStepClick,
  scheduledStepIds = []
}) => {
  // Create step objects with all necessary data
  const allSteps = [
    { 
      id: 'punch', 
      name: 'Punch', 
      completed: unitTurn.completedSteps.includes('Punch'),
      estimatedDate: new Date(2025, 5, 3),
      actualDate: unitTurn.completedSteps.includes('Punch') ? new Date(2025, 5, 2) : null,
      unitTurn
    },
    { 
      id: 'upgrades', 
      name: 'Upgrades/Repairs', 
      completed: unitTurn.completedSteps.includes('Upgrades/Repairs'),
      estimatedDate: new Date(2025, 5, 5),
      actualDate: unitTurn.completedSteps.includes('Upgrades/Repairs') ? new Date(2025, 5, 4) : null,
      unitTurn
    },
    { 
      id: 'floors', 
      name: 'Floors', 
      completed: unitTurn.completedSteps.includes('Floors'),
      estimatedDate: new Date(2025, 5, 8),
      actualDate: unitTurn.completedSteps.includes('Floors') ? new Date(2025, 5, 7) : null,
      unitTurn
    },
    { 
      id: 'paint', 
      name: 'Paint', 
      completed: unitTurn.completedSteps.includes('Paint'),
      estimatedDate: new Date(2025, 5, 10),
      actualDate: null,
      unitTurn
    },
    { 
      id: 'clean', 
      name: 'Clean', 
      completed: unitTurn.completedSteps.includes('Clean'),
      estimatedDate: new Date(2025, 5, 12),
      actualDate: null,
      unitTurn
    },
    { 
      id: 'inspection', 
      name: 'Inspection', 
      completed: unitTurn.completedSteps.includes('Inspection'),
      estimatedDate: new Date(2025, 5, 14),
      actualDate: null,
      unitTurn
    }
  ];

  // Filter out steps that have been scheduled for today
  const availableSteps = allSteps.filter(step => !scheduledStepIds.includes(`${unitTurn.id}-${step.id}`));

  const handleStepClick = (step: any) => {
    // Create event object for Universal Event Detail Modal
    const stepEvent = {
      id: `${unitTurn.id}-${step.id}`,
      title: `${step.name} - Unit ${unitTurn.unit}`,
      description: `Unit turn step: ${step.name}`,
      type: 'maintenance',
      priority: unitTurn.priority,
      status: step.completed ? 'completed' : 'pending',
      time: step.estimatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      building: 'Building A',
      unit: unitTurn.unit,
      assignedTo: unitTurn.assignedTo,
      dueDate: step.estimatedDate,
      completedDate: step.actualDate,
      unitTurnData: unitTurn,
      stepData: step
    };
    
    onStepClick(stepEvent);
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Unit {unitTurn.unit} Steps</h1>
          <p className="text-gray-600">Drag pending steps to schedule for today</p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {availableSteps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            All steps have been completed or scheduled.
          </div>
        ) : (
          availableSteps.map((step) => (
            <UnitTurnStepCard
              key={step.id}
              step={step}
              onClick={() => handleStepClick(step)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UnitTurnStepsView;
