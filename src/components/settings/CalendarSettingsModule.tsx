
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Calendar, Clock, Plus, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarSettingsModuleProps {
  onBack: () => void;
  userRole?: string;
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  enabled: boolean;
  blocked?: boolean;
  taskTypes?: string[];
}

interface DaySettings {
  [key: string]: TimeSlot[];
}

const CalendarSettingsModule = ({ onBack, userRole }: CalendarSettingsModuleProps) => {
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState('monday');
  
  // Get default time slots based on user role
  const getDefaultTimeSlots = (role?: string): TimeSlot[] => {
    if (role === 'operator' || role === 'maintenance' || role === 'leasing') {
      // Work hours: 8 AM - 6 PM
      return [
        { id: '1', start: '08:00', end: '08:30', enabled: true, taskTypes: ['maintenance', 'inspection'] },
        { id: '2', start: '08:30', end: '09:00', enabled: true, taskTypes: ['maintenance', 'inspection'] },
        { id: '3', start: '09:00', end: '09:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '4', start: '09:30', end: '10:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '5', start: '10:00', end: '10:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '6', start: '10:30', end: '11:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '7', start: '11:00', end: '11:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '8', start: '11:30', end: '12:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '9', start: '12:00', end: '12:30', enabled: false, blocked: true }, // Lunch break
        { id: '10', start: '12:30', end: '13:00', enabled: false, blocked: true }, // Lunch break
        { id: '11', start: '13:00', end: '13:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '12', start: '13:30', end: '14:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '13', start: '14:00', end: '14:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '14', start: '14:30', end: '15:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '15', start: '15:00', end: '15:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '16', start: '15:30', end: '16:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '17', start: '16:00', end: '16:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '18', start: '16:30', end: '17:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '19', start: '17:00', end: '17:30', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
        { id: '20', start: '17:30', end: '18:00', enabled: true, taskTypes: ['maintenance', 'inspection', 'leasing'] },
      ];
    } else {
      // Resident time slots for work orders and management interactions
      return [
        { id: '1', start: '09:00', end: '09:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '2', start: '09:30', end: '10:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '3', start: '10:00', end: '10:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '4', start: '10:30', end: '11:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '5', start: '11:00', end: '11:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '6', start: '11:30', end: '12:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '7', start: '13:00', end: '13:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '8', start: '13:30', end: '14:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '9', start: '14:00', end: '14:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '10', start: '14:30', end: '15:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '11', start: '15:00', end: '15:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '12', start: '15:30', end: '16:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '13', start: '16:00', end: '16:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '14', start: '16:30', end: '17:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '15', start: '17:00', end: '17:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '16', start: '17:30', end: '18:00', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '17', start: '18:00', end: '18:30', enabled: true, taskTypes: ['work-order', 'management'] },
        { id: '18', start: '18:30', end: '19:00', enabled: true, taskTypes: ['work-order', 'management'] },
      ];
    }
  };

  const [daySettings, setDaySettings] = useState<DaySettings>({
    monday: getDefaultTimeSlots(userRole),
    tuesday: getDefaultTimeSlots(userRole),
    wednesday: getDefaultTimeSlots(userRole),
    thursday: getDefaultTimeSlots(userRole),
    friday: getDefaultTimeSlots(userRole),
    saturday: userRole === 'operator' || userRole === 'maintenance' || userRole === 'leasing' 
      ? getDefaultTimeSlots(userRole).slice(4, 12) // Limited weekend hours
      : getDefaultTimeSlots(userRole).slice(0, 8),
    sunday: [], // No availability by default
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const getTaskTypesByRole = (role?: string) => {
    if (role === 'operator' || role === 'maintenance' || role === 'leasing') {
      return ['maintenance', 'inspection', 'leasing', 'emergency', 'vendor'];
    } else {
      return ['work-order', 'management'];
    }
  };

  const taskTypes = getTaskTypesByRole(userRole);

  const toggleTimeSlot = (slotId: string) => {
    setDaySettings(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map(slot =>
        slot.id === slotId ? { ...slot, enabled: !slot.enabled } : slot
      )
    }));
  };

  const toggleBlockSlot = (slotId: string) => {
    setDaySettings(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map(slot =>
        slot.id === slotId ? { ...slot, blocked: !slot.blocked, enabled: slot.blocked ? true : false } : slot
      )
    }));
  };

  const addTimeSlot = () => {
    const currentSlots = daySettings[selectedDay];
    const lastSlot = currentSlots[currentSlots.length - 1];
    const lastEndTime = lastSlot ? lastSlot.end : '18:00';
    
    const [hours, minutes] = lastEndTime.split(':').map(Number);
    const nextStartMinutes = minutes + 30;
    const nextStartHours = nextStartMinutes >= 60 ? hours + 1 : hours;
    const finalMinutes = nextStartMinutes >= 60 ? 0 : nextStartMinutes;
    
    if (nextStartHours >= 22) {
      toast({
        title: "Cannot Add Slot",
        description: "Maximum time slots reached for this day.",
        variant: "destructive"
      });
      return;
    }

    const newStart = `${nextStartHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
    const newEndHours = finalMinutes + 30 >= 60 ? nextStartHours + 1 : nextStartHours;
    const newEndMinutes = finalMinutes + 30 >= 60 ? 0 : finalMinutes + 30;
    const newEnd = `${newEndHours.toString().padStart(2, '0')}:${newEndMinutes.toString().padStart(2, '0')}`;

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: newStart,
      end: newEnd,
      enabled: true,
      taskTypes: taskTypes.slice(0, 2)
    };

    setDaySettings(prev => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newSlot]
    }));
  };

  const removeTimeSlot = (slotId: string) => {
    setDaySettings(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter(slot => slot.id !== slotId)
    }));
  };

  const toggleTaskType = (slotId: string, taskType: string) => {
    setDaySettings(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map(slot => {
        if (slot.id === slotId) {
          const currentTypes = slot.taskTypes || [];
          const newTypes = currentTypes.includes(taskType)
            ? currentTypes.filter(type => type !== taskType)
            : [...currentTypes, taskType];
          return { ...slot, taskTypes: newTypes };
        }
        return slot;
      })
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('calendarSettings', JSON.stringify(daySettings));
    toast({
      title: "Settings Saved",
      description: "Your calendar and time slot preferences have been saved.",
    });
  };

  const resetDay = () => {
    setDaySettings(prev => ({
      ...prev,
      [selectedDay]: getDefaultTimeSlots(userRole)
    }));
    toast({
      title: "Day Reset",
      description: `${daysOfWeek.find(d => d.key === selectedDay)?.label} has been reset to default settings.`,
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEnabledSlotsCount = (day: string) => {
    return daySettings[day].filter(slot => slot.enabled && !slot.blocked).length;
  };

  const getRoleDescription = () => {
    if (userRole === 'operator' || userRole === 'maintenance' || userRole === 'leasing') {
      return 'Configure your work hours and availability for different task types.';
    } else {
      return 'Set your preferred time slots for work orders and management interactions.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Calendar & Time Slots</h1>
            <p className="text-sm text-gray-600">
              {getRoleDescription()}
            </p>
          </div>
          <Button onClick={saveSettings} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Day Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Days of Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day.key}
                  variant={selectedDay === day.key ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setSelectedDay(day.key)}
                >
                  <span>{day.label}</span>
                  <Badge variant="secondary">
                    {getEnabledSlotsCount(day.key)} slots
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Time Slots Configuration */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {daysOfWeek.find(d => d.key === selectedDay)?.label} Time Slots
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetDay}>
                    Reset Day
                  </Button>
                  <Button size="sm" onClick={addTimeSlot}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {daySettings[selectedDay].length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No time slots configured for {daysOfWeek.find(d => d.key === selectedDay)?.label}</p>
                    <Button onClick={addTimeSlot} className="mt-3">
                      Add First Slot
                    </Button>
                  </div>
                ) : (
                  daySettings[selectedDay].map((slot) => (
                    <div key={slot.id} className={`border rounded-lg p-3 space-y-3 ${slot.blocked ? 'bg-red-50 border-red-200' : slot.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={slot.enabled && !slot.blocked}
                            onCheckedChange={() => toggleTimeSlot(slot.id)}
                            disabled={slot.blocked}
                          />
                          <div className="font-medium">
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </div>
                          {slot.blocked && (
                            <Badge variant="destructive" className="text-xs">
                              Blocked
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBlockSlot(slot.id)}
                            className={slot.blocked ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}
                          >
                            {slot.blocked ? 'Unblock' : 'Block'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTimeSlot(slot.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {slot.enabled && !slot.blocked && taskTypes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Available for:</p>
                          <div className="flex flex-wrap gap-1">
                            {taskTypes.map((taskType) => (
                              <Button
                                key={taskType}
                                variant={slot.taskTypes?.includes(taskType) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleTaskType(slot.id, taskType)}
                                className="text-xs h-6"
                              >
                                {taskType.replace('-', ' ')}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-Specific Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {userRole === 'operator' || userRole === 'maintenance' || userRole === 'leasing' 
                ? 'Staff Availability Settings' 
                : 'Resident Scheduling Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userRole === 'operator' || userRole === 'maintenance' || userRole === 'leasing' ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Configure your work schedule and availability for different task types:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li><strong>Maintenance:</strong> Regular maintenance work orders and repairs</li>
                  <li><strong>Inspection:</strong> Unit inspections and property assessments</li>
                  <li><strong>Leasing:</strong> Tours, lease signings, and resident meetings</li>
                  <li><strong>Emergency:</strong> Urgent maintenance and emergency calls</li>
                  <li><strong>Vendor:</strong> Vendor coordination and oversight</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  Use the "Block" feature to mark unavailable times (meetings, breaks, etc.)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Set your preferred time slots for scheduling:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li><strong>Work Order:</strong> Maintenance requests and repairs in your unit</li>
                  <li><strong>Management:</strong> Meetings with property management staff</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  These preferences help management schedule appointments at convenient times for you.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarSettingsModule;
