
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface UnitTurnDetailTrackerProps {
  unitTurn: any;
  onClose: () => void;
}

const UnitTurnDetailTracker = ({ unitTurn, onClose }: UnitTurnDetailTrackerProps) => {
  const [checklist, setChecklist] = useState([
    { 
      id: 'punch', 
      name: 'Punch', 
      completed: unitTurn.completedSteps.includes('Punch'), 
      estimatedDate: new Date(2025, 5, 3), // June 3rd
      actualDate: unitTurn.completedSteps.includes('Punch') ? new Date(2025, 5, 2) : null
    },
    { 
      id: 'upgrades', 
      name: 'Upgrades/Repairs', 
      completed: unitTurn.completedSteps.includes('Upgrades/Repairs'), 
      estimatedDate: new Date(2025, 5, 5), // June 5th
      actualDate: unitTurn.completedSteps.includes('Upgrades/Repairs') ? new Date(2025, 5, 4) : null
    },
    { 
      id: 'floors', 
      name: 'Floors', 
      completed: unitTurn.completedSteps.includes('Floors'), 
      estimatedDate: new Date(2025, 5, 8), // June 8th
      actualDate: unitTurn.completedSteps.includes('Floors') ? new Date(2025, 5, 7) : null
    },
    { 
      id: 'paint', 
      name: 'Paint', 
      completed: unitTurn.completedSteps.includes('Paint'), 
      estimatedDate: new Date(2025, 5, 10), // June 10th
      actualDate: null
    },
    { 
      id: 'clean', 
      name: 'Clean', 
      completed: unitTurn.completedSteps.includes('Clean'), 
      estimatedDate: new Date(2025, 5, 12), // June 12th
      actualDate: null
    },
    { 
      id: 'inspection', 
      name: 'Inspection', 
      completed: unitTurn.completedSteps.includes('Inspection'), 
      estimatedDate: new Date(2025, 5, 14), // June 14th
      actualDate: null
    },
    { 
      id: 'agent-inspection', 
      name: 'Agent Inspection', 
      completed: false, 
      estimatedDate: new Date(2025, 5, 15), // June 15th
      actualDate: null
    }
  ]);

  const handleChecklistToggle = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        completed: !item.completed,
        actualDate: !item.completed ? new Date() : null
      } : item
    ));
  };

  const handleDateChange = (id: string, date: Date | undefined) => {
    if (date) {
      setChecklist(prev => prev.map(item => 
        item.id === id ? { ...item, estimatedDate: date } : item
      ));
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklist.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Unit {unitTurn.unit} Turn</h1>
          <p className="text-gray-600">Le Leo Make Ready</p>
        </div>
        <Badge className={getPriorityColor(unitTurn.priority)}>
          {unitTurn.priority}
        </Badge>
      </div>

      {/* Status Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Turn Progress</span>
            <span className="text-sm font-normal">{completedCount}/{checklist.length} Complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span>Move Out: {new Date(unitTurn.moveOutDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span>Move In: {new Date(unitTurn.moveInDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{unitTurn.daysUntilMoveIn} days remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Days Old: 0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Make Ready Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Make Ready Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checklist.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => handleChecklistToggle(item.id)}
                    />
                    <div>
                      <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {index + 1}. {item.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">
                          {item.actualDate ? format(item.actualDate, 'MMM dd') : 'Completed'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Selection Row */}
                <div className="flex items-center justify-between pl-7">
                  <span className="text-sm text-gray-600">Estimated completion:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-start text-left font-normal",
                          !item.estimatedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {item.estimatedDate ? format(item.estimatedDate, "MMM dd, yyyy") : "Set date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={item.estimatedDate}
                        onSelect={(date) => handleDateChange(item.id, date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Unit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Property:</span>
              <span className="font-medium ml-2">210c</span>
            </div>
            <div>
              <span className="text-gray-600">Unit:</span>
              <span className="font-medium ml-2">{unitTurn.unit}</span>
            </div>
            <div>
              <span className="text-gray-600">Assigned To:</span>
              <span className="font-medium ml-2">{unitTurn.assignedTo}</span>
            </div>
            <div>
              <span className="text-gray-600">Date Available:</span>
              <span className="font-medium ml-2">{new Date(unitTurn.moveInDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitTurnDetailTracker;
