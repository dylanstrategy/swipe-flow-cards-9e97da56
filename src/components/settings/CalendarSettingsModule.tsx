
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Calendar, Clock, Plus, Trash2, Save } from 'lucide-react';
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
  taskTypes?: string[];
}

interface DaySettings {
  [key: string]: TimeSlot[];
}

const CalendarSettingsModule = ({ onBack, userRole }: CalendarSettingsModuleProps) => {
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState('monday');
  
  // Default time slots based on user role
  const getDefaultTimeSlots = (role?: string): TimeSlot[] => {
    const baseSlots = [
      { id: '1', start: '09:00', end: '09:30', enabled: true },
      { id: '2', start: '09:30', end: '10:00', enabled: true },
      { id: '3', start: '10:00', end: '10:30', enabled: true },
      { id: '4', start: '10:30', end: '11:00', enabled: true },
      { id: '5', start: '11:00', end: '11:30', enabled: true },
      { id: '6', start: '11:30', end: '12:00', enabled: true },
      { id: '7', start: '13:00', end: '13:30', enabled: true },
      { id: '8', start: '13:30', end: '14:00', enabled: true },
      { id: '9', start: '14:00', end: '14:30', enabled: true },
      { id: '10', start: '14:30', end: '15:00', enabled: true },
      { id: '11', start: '15:00', end: '15:30', enabled: true },
      { id: '12', start: '15:30', end: '16:00', enabled: true },
      { id: '13', start: '16:00', end: '16:30', enabled: true },
      { id: '14', start: '16:30', end: '17:00', enabled: true },
    ];

    if (role === 'operator' || role === 'maintenance') {
      return baseSlots.map(slot => ({
        ...slot,
        taskTypes: ['maintenance', 'inspection', 'leasing', 'emergency']
      }));
    }

    return baseSlots.map(slot => ({
      ...slot,
      taskTypes: ['appointment', 'service', 'delivery']
    }));
  };

  const [daySettings, setDaySettings] = useState<DaySettings>({
    monday: getDefaultTimeSlots(userRole),
    tuesday: getDefaultTimeSlots(userRole),
    wednesday: getDefaultTimeSlots(userRole),
    thursday: getDefaultTimeSlots(userRole),
    friday: getDefaultTimeSlots(userRole),
    saturday: getDefaultTimeSlots(userRole).slice(0, 8), // Shorter hours
    sunday: getDefaultTimeSlots(userRole).slice(2, 6), // Very limited hours
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

  const taskTypes = userRole === 'operator' || userRole === 'maintenance' 
    ? ['maintenance', 'inspection', 'leasing', 'emergency', 'vendor']
    : ['appointment', 'service', 'delivery', 'consultation'];

  const toggleTimeSlot = (slotId: string) => {
    setDaySettings(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map(slot =>
        slot.id === slotId ? { ...slot, enabled: !slot.enabled } : slot
      )
    }));
  };

  const addTimeSlot = () => {
    const currentSlots = daySettings[selectedDay];
    const lastSlot = currentSlots[currentSlots.length - 1];
    const lastEndTime = lastSlot ? lastSlot.end : '17:00';
    
    // Calculate next 30-minute slot
    const [hours, minutes] = lastEndTime.split(':').map(Number);
    const nextStartMinutes = minutes + 30;
    const nextStartHours = nextStartMinutes >= 60 ? hours + 1 : hours;
    const finalMinutes = nextStartMinutes >= 60 ? 0 : nextStartMinutes;
    
    if (nextStartHours >= 18) {
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
      taskTypes: userRole === 'operator' || userRole === 'maintenance' 
        ? ['maintenance', 'inspection'] 
        : ['appointment']
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
    // Here you would save to localStorage or send to backend
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
    return daySettings[day].filter(slot => slot.enabled).length;
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
              Configure your availability and time slot preferences for scheduling
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
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {daySettings[selectedDay].map((slot) => (
                  <div key={slot.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={slot.enabled}
                          onCheckedChange={() => toggleTimeSlot(slot.id)}
                        />
                        <div className="font-medium">
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimeSlot(slot.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {slot.enabled && (userRole === 'operator' || userRole === 'maintenance') && (
                      <div>
                        <p className="text-sm font-medium mb-2">Available for:</p>
                        <div className="flex flex-wrap gap-2">
                          {taskTypes.map((taskType) => (
                            <Button
                              key={taskType}
                              variant={slot.taskTypes?.includes(taskType) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleTaskType(slot.id, taskType)}
                              className="text-xs"
                            >
                              {taskType}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-Specific Information */}
        <Card>
          <CardHeader>
            <CardTitle>Role-Specific Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {userRole === 'operator' || userRole === 'maintenance' ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  As an {userRole}, your time slots can be configured for different task types:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li><strong>Maintenance:</strong> Regular maintenance work orders</li>
                  <li><strong>Inspection:</strong> Unit inspections and assessments</li>
                  <li><strong>Leasing:</strong> Tours and lease-related appointments</li>
                  <li><strong>Emergency:</strong> Urgent maintenance issues</li>
                  <li><strong>Vendor:</strong> Vendor coordination and oversight</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  As a resident, your time slots are used for:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li><strong>Appointments:</strong> Scheduled meetings with management</li>
                  <li><strong>Service:</strong> Maintenance and repair requests</li>
                  <li><strong>Delivery:</strong> Package and delivery coordination</li>
                  <li><strong>Consultation:</strong> General inquiries and discussions</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarSettingsModule;
