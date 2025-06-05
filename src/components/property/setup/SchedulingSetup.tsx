import React, { useState } from 'react';
import { ChevronLeft, Save, Clock, Calendar, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface SchedulingSetupProps {
  onBack: () => void;
}

const SchedulingSetup: React.FC<SchedulingSetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  
  const [scheduleData, setScheduleData] = useState({
    workStartTime: '09:00',
    workEndTime: '17:00',
    timeZone: 'America/New_York',
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    enableLunchBreak: true,
    workDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    autoScheduling: true,
    bufferTime: '15',
    maxDailyAppointments: '8'
  });

  const handleSave = () => {
    // Simulate actual save operation
    localStorage.setItem('schedulingPreferences', JSON.stringify(scheduleData));
    
    toast({
      title: "✅ Schedule Updated",
      description: "Your scheduling preferences have been saved successfully.",
      duration: 4000,
    });
    console.log('Schedule updated and saved to localStorage:', scheduleData);
  };

  const handleWorkDayChange = (day: keyof typeof scheduleData.workDays, checked: boolean) => {
    setScheduleData({
      ...scheduleData,
      workDays: {
        ...scheduleData.workDays,
        [day]: checked
      }
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Scheduling Preferences</h2>
            <p className="text-sm text-gray-600">Configure your work hours and availability</p>
          </div>
        </div>

        {/* Work Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Work Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workStart" className="text-sm font-medium text-gray-700 mb-2 block">
                  Start Time
                </Label>
                <Input
                  id="workStart"
                  type="time"
                  value={scheduleData.workStartTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, workStartTime: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="workEnd" className="text-sm font-medium text-gray-700 mb-2 block">
                  End Time
                </Label>
                <Input
                  id="workEnd"
                  type="time"
                  value={scheduleData.workEndTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, workEndTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timeZone" className="text-sm font-medium text-gray-700 mb-2 block">
                Time Zone
              </Label>
              <select 
                id="timeZone"
                value={scheduleData.timeZone}
                onChange={(e) => setScheduleData({ ...scheduleData, timeZone: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Lunch Break */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lunch Break
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Lunch Break</div>
                <div className="text-sm text-gray-600">Block time for lunch during work hours</div>
              </div>
              <Switch 
                checked={scheduleData.enableLunchBreak}
                onCheckedChange={(checked) => setScheduleData({ ...scheduleData, enableLunchBreak: checked })}
              />
            </div>

            {scheduleData.enableLunchBreak && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lunchStart" className="text-sm font-medium text-gray-700 mb-2 block">
                    Lunch Start
                  </Label>
                  <Input
                    id="lunchStart"
                    type="time"
                    value={scheduleData.lunchBreakStart}
                    onChange={(e) => setScheduleData({ ...scheduleData, lunchBreakStart: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="lunchEnd" className="text-sm font-medium text-gray-700 mb-2 block">
                    Lunch End
                  </Label>
                  <Input
                    id="lunchEnd"
                    type="time"
                    value={scheduleData.lunchBreakEnd}
                    onChange={(e) => setScheduleData({ ...scheduleData, lunchBreakEnd: e.target.value })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Days */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Work Days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(scheduleData.workDays).map(([day, isEnabled]) => (
                <div key={day}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium capitalize">{day}</div>
                    <Switch 
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleWorkDayChange(day as keyof typeof scheduleData.workDays, checked)}
                    />
                  </div>
                  {day !== 'sunday' && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduling Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Scheduling Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-Scheduling</div>
                <div className="text-sm text-gray-600">Automatically suggest optimal time slots</div>
              </div>
              <Switch 
                checked={scheduleData.autoScheduling}
                onCheckedChange={(checked) => setScheduleData({ ...scheduleData, autoScheduling: checked })}
              />
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bufferTime" className="text-sm font-medium text-gray-700 mb-2 block">
                  Buffer Time (minutes)
                </Label>
                <Input
                  id="bufferTime"
                  type="number"
                  value={scheduleData.bufferTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, bufferTime: e.target.value })}
                  placeholder="15"
                />
              </div>
              
              <div>
                <Label htmlFor="maxAppointments" className="text-sm font-medium text-gray-700 mb-2 block">
                  Max Daily Appointments
                </Label>
                <Input
                  id="maxAppointments"
                  type="number"
                  value={scheduleData.maxDailyAppointments}
                  onChange={(e) => setScheduleData({ ...scheduleData, maxDailyAppointments: e.target.value })}
                  placeholder="8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default SchedulingSetup;
