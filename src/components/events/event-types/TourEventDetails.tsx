
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, User, Clock, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TourEventDetailsProps {
  event: any;
  userRole: string;
}

const TourEventDetails = ({ event, userRole }: TourEventDetailsProps) => {
  const { toast } = useToast();

  const prospectInfo = {
    name: 'Alex Rodriguez',
    phone: '(555) 456-7890',
    email: 'alex.rodriguez@email.com',
    preferredUnits: ['Studio-12', '1BR-15'],
    budget: '$1,400 - $1,600',
    moveInDate: 'July 15, 2025',
    source: 'Website'
  };

  const handleStartTour = () => {
    toast({
      title: "Tour Started",
      description: "Virtual tour checklist activated",
    });
  };

  const handleReschedule = () => {
    toast({
      title: "Tour Rescheduled",
      description: "Tour reschedule request sent to prospect",
    });
  };

  const canManageTours = userRole === 'operator';

  return (
    <div className="p-6 space-y-6">
      {/* Event Summary */}
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <div className="flex items-center gap-3 mb-3">
          <Eye className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Property Tour</h3>
          <Badge className="bg-orange-100 text-orange-800">Normal Priority</Badge>
        </div>
        <p className="text-sm text-orange-800 mb-3">
          Scheduled property tour with potential resident
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-orange-900">Unit:</span> {event.unit}
          </div>
          <div>
            <span className="font-medium text-orange-900">Building:</span> {event.building}
          </div>
          <div>
            <span className="font-medium text-orange-900">Time:</span> {event.time}
          </div>
          <div>
            <span className="font-medium text-orange-900">Duration:</span> 30 minutes
          </div>
        </div>
      </div>

      {/* Prospect Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Prospect Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Name:</span> {prospectInfo.name}</div>
          <div><span className="font-medium">Phone:</span> {prospectInfo.phone}</div>
          <div><span className="font-medium">Email:</span> {prospectInfo.email}</div>
          <div><span className="font-medium">Budget:</span> {prospectInfo.budget}</div>
          <div><span className="font-medium">Move-in Date:</span> {prospectInfo.moveInDate}</div>
          <div><span className="font-medium">Source:</span> {prospectInfo.source}</div>
        </div>
      </div>

      {/* Preferred Units */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Preferred Units
        </h4>
        <div className="space-y-2">
          {prospectInfo.preferredUnits.map((unit, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-blue-900">{unit}</span>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Available
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Tour Checklist */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Tour Checklist</h4>
        <div className="space-y-3">
          {[
            'Unit walkthrough and features',
            'Building amenities tour',
            'Parking and storage options',
            'Lease terms discussion',
            'Application process explanation'
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {canManageTours && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={handleStartTour}>
            <Eye className="w-4 h-4 mr-2" />
            Begin Tour
          </Button>
          <Button variant="outline" onClick={handleReschedule}>
            <Clock className="w-4 h-4 mr-2" />
            Reschedule
          </Button>
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Call Prospect
          </Button>
        </div>
      )}
    </div>
  );
};

export default TourEventDetails;
