
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock } from 'lucide-react';

const ScheduleSetup = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'HVAC Filter Change',
      frequency: 'Monthly',
      units: 'All Units',
      duration: '30 minutes',
      priority: 'Medium'
    },
    {
      id: 2,
      name: 'Fire Alarm Test',
      frequency: 'Quarterly',
      units: 'Common Areas',
      duration: '2 hours',
      priority: 'High'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Maintenance Schedules</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Schedule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="schedule-name">Schedule Name</Label>
            <Input id="schedule-name" placeholder="HVAC Filter Change" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Estimated Duration</Label>
              <Input id="duration" placeholder="30 minutes" />
            </div>
            <div>
              <Label htmlFor="units">Apply to Units</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  <SelectItem value="residential">Residential Only</SelectItem>
                  <SelectItem value="commercial">Commercial Only</SelectItem>
                  <SelectItem value="common">Common Areas</SelectItem>
                  <SelectItem value="specific">Specific Units</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Preferred Time Slots</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'].map(time => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox id={time} />
                  <Label htmlFor={time} className="text-sm">{time}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button>Create Schedule</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {schedules.map(schedule => (
          <Card key={schedule.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium">{schedule.name}</h3>
                  <Badge variant={schedule.priority === 'High' ? 'destructive' : 'outline'}>
                    {schedule.priority}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {schedule.frequency}
                </div>
                <div>Duration: {schedule.duration}</div>
                <div>Units: {schedule.units}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSetup;
