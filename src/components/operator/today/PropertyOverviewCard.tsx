
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface PropertyOverviewCardProps {
  totalUnits: number;
  currentResidents: number;
  maintenancePending: number;
  renewalsDueSoon: number;
  onResidentsClick: () => void;
  onMaintenanceClick: () => void;
}

const PropertyOverviewCard = ({
  totalUnits,
  currentResidents,
  maintenancePending,
  renewalsDueSoon,
  onResidentsClick,
  onMaintenanceClick
}: PropertyOverviewCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          PROPERTY OVERVIEW
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-3xl font-bold text-gray-900">{totalUnits}</div>
            <div className="text-sm text-gray-600">Total Units</div>
            <div className="text-sm text-blue-600 font-medium">Total Units</div>
          </div>
          
          <div 
            className="text-center p-4 rounded-lg bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
            onClick={onResidentsClick}
          >
            <div className="text-3xl font-bold text-gray-900">{currentResidents}</div>
            <div className="text-sm text-gray-600">Current</div>
            <div className="text-sm text-gray-600">Residents</div>
            <div className="text-sm text-green-600 font-medium">Occupied</div>
          </div>
          
          <div 
            className="text-center p-4 rounded-lg bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={onMaintenanceClick}
          >
            <div className="text-3xl font-bold text-gray-900">{maintenancePending}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
            <div className="text-sm text-orange-600 font-medium">Pending</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-red-50">
            <div className="text-3xl font-bold text-gray-900">{renewalsDueSoon}</div>
            <div className="text-sm text-gray-600">Renewals</div>
            <div className="text-sm text-red-600 font-medium">Due Soon</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewCard;
