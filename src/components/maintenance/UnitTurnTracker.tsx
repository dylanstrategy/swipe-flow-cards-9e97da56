import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Home, CheckCircle2, AlertCircle } from 'lucide-react';

interface UnitTurnTrackerProps {
  onSelectUnitTurn?: (unitTurn: any) => void;
}

const UnitTurnTracker = ({ onSelectUnitTurn }: UnitTurnTrackerProps) => {
  const unitTurns = [
    {
      id: 'UT-323-4',
      unit: '323-4',
      moveOutDate: '2025-06-01',
      moveInDate: '2025-06-15',
      status: 'In Progress',
      completedSteps: ['Punch', 'Upgrades/Repairs', 'Floors'],
      pendingSteps: ['Paint', 'Clean', 'Inspection'],
      daysUntilMoveIn: 13,
      priority: 'high',
      assignedTo: 'Mike Rodriguez'
    },
    {
      id: 'UT-420-3',
      unit: '420-3',
      moveOutDate: '2025-06-06',
      moveInDate: '2025-06-20',
      status: 'Scheduled',
      completedSteps: [],
      pendingSteps: ['Punch', 'Upgrades/Repairs', 'Floors', 'Paint', 'Clean', 'Inspection'],
      daysUntilMoveIn: 18,
      priority: 'medium',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: 'UT-156-2',
      unit: '156-2',
      moveOutDate: '2025-05-28',
      moveInDate: '2025-06-10',
      status: 'Nearly Complete',
      completedSteps: ['Punch', 'Upgrades/Repairs', 'Floors', 'Paint', 'Clean'],
      pendingSteps: ['Inspection'],
      daysUntilMoveIn: 8,
      priority: 'urgent',
      assignedTo: 'Mike Rodriguez'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'nearly complete': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (completed: string[], total: string[]) => {
    return (completed.length / (completed.length + total.length)) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Home className="w-5 h-5 text-blue-600" />
          Unit Turns Dashboard
        </h2>
        <Badge variant="outline" className="bg-blue-50">
          {unitTurns.length} Active Turns
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectUnitTurn?.(unitTurns[0])}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {unitTurns.filter(turn => turn.status === 'In Progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectUnitTurn?.(unitTurns[0])}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {unitTurns.filter(turn => turn.status === 'Nearly Complete').length}
            </div>
            <div className="text-sm text-gray-600">Near Complete</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectUnitTurn?.(unitTurns[0])}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {unitTurns.filter(turn => turn.daysUntilMoveIn <= 7).length}
            </div>
            <div className="text-sm text-gray-600">Urgent</div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Turn Cards */}
      <div className="space-y-4">
        {unitTurns.map((turn) => (
          <Card 
            key={turn.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectUnitTurn?.(turn)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">Unit {turn.unit}</h3>
                  <Badge className={getPriorityColor(turn.priority)}>
                    {turn.priority}
                  </Badge>
                  <Badge className={getStatusColor(turn.status)}>
                    {turn.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {turn.daysUntilMoveIn} days
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Timeline */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Move Out: {new Date(turn.moveOutDate).toLocaleDateString()}
                  </div>
                  <div>→</div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Move In: {new Date(turn.moveInDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span>{turn.completedSteps.length}/{turn.completedSteps.length + turn.pendingSteps.length} steps</span>
                  </div>
                  <Progress 
                    value={calculateProgress(turn.completedSteps, turn.pendingSteps)} 
                    className="h-2"
                  />
                </div>

                {/* Steps Status */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </div>
                    <div className="space-y-1">
                      {turn.completedSteps.map((step) => (
                        <div key={step} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-orange-700 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Pending
                    </div>
                    <div className="space-y-1">
                      {turn.pendingSteps.slice(0, 3).map((step) => (
                        <div key={step} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {step}
                        </div>
                      ))}
                      {turn.pendingSteps.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{turn.pendingSteps.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Assigned to: {turn.assignedTo}</span>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UnitTurnTracker;
