
import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface UnitTurnStepCardProps {
  step: {
    id: string;
    name: string;
    completed: boolean;
    estimatedDate: Date;
    actualDate?: Date | null;
    unitTurn: any;
  };
  onClick: () => void;
}

const UnitTurnStepCard: React.FC<UnitTurnStepCardProps> = ({ step, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'workOrder',
    item: { 
      workOrder: {
        id: `${step.unitTurn.id}-${step.id}`,
        unit: step.unitTurn.unit,
        title: step.name,
        description: `Unit turn step: ${step.name} for Unit ${step.unitTurn.unit}`,
        category: 'Unit Turn',
        priority: step.unitTurn.priority,
        status: step.completed ? 'completed' : 'unscheduled',
        assignedTo: step.unitTurn.assignedTo,
        resident: 'Unit Turn',
        phone: 'N/A',
        daysOpen: step.unitTurn.daysUntilMoveIn || 0,
        estimatedTime: '2 hours',
        submittedDate: new Date().toISOString().split('T')[0],
        photo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
        type: 'maintenance',
        unitTurnStep: true,
        originalStep: step
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card 
        className={`cursor-move hover:shadow-md transition-shadow ${
          step.completed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{step.name}</span>
              <Badge className={step.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                {step.completed ? 'Completed' : 'Pending'}
              </Badge>
            </div>
            {step.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            Unit {step.unitTurn.unit} - {step.unitTurn.assignedTo}
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500" />
              <span>
                {step.completed && step.actualDate 
                  ? `Completed: ${step.actualDate.toLocaleDateString()}`
                  : `Due: ${step.estimatedDate.toLocaleDateString()}`
                }
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              2 hours
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitTurnStepCard;
