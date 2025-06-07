
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle2, Calendar, AlertTriangle } from 'lucide-react';

interface MovementTrackingCardProps {
  occupancyRate: number;
}

const MovementTrackingCard = ({ occupancyRate }: MovementTrackingCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600" />
          MOVEMENT TRACKING
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Move-Ins This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Move-Outs Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(occupancyRate)}%</div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">Unit 304 - Move-In Complete</div>
                <div className="text-sm text-gray-600">Sarah Johnson moved in today</div>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">Complete</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">Unit 207 - Move-Out Scheduled</div>
                <div className="text-sm text-gray-600">Mike Chen - Tomorrow 2:00 PM</div>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium">Unit 156 - Notice Given</div>
                <div className="text-sm text-gray-600">Alex Rivera - 30 day notice</div>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800">Notice</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovementTrackingCard;
