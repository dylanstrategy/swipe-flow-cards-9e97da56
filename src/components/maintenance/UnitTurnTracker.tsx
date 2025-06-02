
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Calendar, MapPin } from 'lucide-react';

interface UnitTurnTrackerProps {
  onClose: () => void;
}

const UnitTurnTracker = ({ onClose }: UnitTurnTrackerProps) => {
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
      progress: 50
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
      progress: 0
    },
    {
      id: 'UT-217-1',
      unit: '217-1',
      moveOutDate: '2025-05-28',
      moveInDate: '2025-06-12',
      status: 'In Progress',
      completedSteps: ['Punch', 'Upgrades/Repairs'],
      pendingSteps: ['Floors', 'Paint', 'Clean', 'Inspection'],
      daysUntilMoveIn: 10,
      progress: 33
    },
    {
      id: 'UT-516-2',
      unit: '516-2',
      moveOutDate: '2025-06-10',
      moveInDate: '2025-06-25',
      status: 'Ready to Start',
      completedSteps: [],
      pendingSteps: ['Punch', 'Upgrades/Repairs', 'Floors', 'Paint', 'Clean', 'Inspection'],
      daysUntilMoveIn: 23,
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-orange-100 text-orange-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ready to start': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 14) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Unit Turn Tracker</h1>
            <p className="text-sm text-gray-600">{unitTurns.length} active unit turns</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {unitTurns.map((unitTurn) => (
          <Card key={unitTurn.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Unit {unitTurn.unit}</CardTitle>
                <Badge className={getStatusColor(unitTurn.status)}>
                  {unitTurn.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Move-in: {new Date(unitTurn.moveInDate).toLocaleDateString()}</span>
                </div>
                <div className={`font-medium ${getUrgencyColor(unitTurn.daysUntilMoveIn)}`}>
                  {unitTurn.daysUntilMoveIn} days remaining
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm text-gray-600">{unitTurn.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${unitTurn.progress}%` }}
                  />
                </div>
              </div>

              {/* Completed Steps */}
              {unitTurn.completedSteps.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Completed</h4>
                  <div className="flex flex-wrap gap-2">
                    {unitTurn.completedSteps.map((step) => (
                      <Badge key={step} className="bg-green-100 text-green-800">
                        ✓ {step}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Steps */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Pending ({unitTurn.pendingSteps.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {unitTurn.pendingSteps.slice(0, 4).map((step, index) => (
                    <div 
                      key={step} 
                      className={`text-xs px-2 py-1 rounded text-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800 font-medium' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index === 0 ? '→ ' + step : step}
                    </div>
                  ))}
                </div>
                {unitTurn.pendingSteps.length > 4 && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    +{unitTurn.pendingSteps.length - 4} more steps
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UnitTurnTracker;
