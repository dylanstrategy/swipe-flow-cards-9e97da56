
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calendar, 
  Users, 
  Wrench, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building,
  Plus
} from 'lucide-react';
import { useResident } from '@/contexts/ResidentContext';
import WorkOrdersReview from '@/components/tabs/today/WorkOrdersReview';

interface OperatorTodayTabProps {
  onTabChange?: (tab: string) => void;
}

const OperatorTodayTab = ({ onTabChange }: OperatorTodayTabProps) => {
  const { getCurrentResidents, getNoticeResidents, getOccupancyRate } = useResident();
  const [showWorkOrders, setShowWorkOrders] = useState(false);

  const currentResidents = getCurrentResidents();
  const noticeResidents = getNoticeResidents();
  const occupancyRate = getOccupancyRate();

  const workOrderData = [
    { month: 'Jan', completed: 45, pending: 12 },
    { month: 'Feb', completed: 52, pending: 8 },
    { month: 'Mar', completed: 38, pending: 15 },
    { month: 'Apr', completed: 61, pending: 6 },
    { month: 'May', completed: 43, pending: 11 },
    { month: 'Jun', completed: 57, pending: 9 }
  ];

  const propertyStats = {
    totalUnits: 100,
    currentResidents: currentResidents.length,
    maintenancePending: 7,
    renewalsDueSoon: 24
  };

  const handleResidentsClick = () => {
    onTabChange?.('residents');
  };

  const handleMaintenanceClick = () => {
    setShowWorkOrders(true);
  };

  if (showWorkOrders) {
    return (
      <WorkOrdersReview
        onCreateWorkOrder={() => {}}
        onClose={() => setShowWorkOrders(false)}
        onWorkOrderClick={() => {}}
      />
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Today's Overview</h1>
            <p className="text-gray-600">Property performance at a glance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Show Graphs
          </Button>
        </div>
      </div>

      {/* Property Overview */}
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
              <div className="text-3xl font-bold text-gray-900">{propertyStats.totalUnits}</div>
              <div className="text-sm text-gray-600">Total Units</div>
              <div className="text-sm text-blue-600 font-medium">Total Units</div>
            </div>
            
            <div 
              className="text-center p-4 rounded-lg bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={handleResidentsClick}
            >
              <div className="text-3xl font-bold text-gray-900">{propertyStats.currentResidents}</div>
              <div className="text-sm text-gray-600">Current</div>
              <div className="text-sm text-gray-600">Residents</div>
              <div className="text-sm text-green-600 font-medium">Occupied</div>
            </div>
            
            <div 
              className="text-center p-4 rounded-lg bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={handleMaintenanceClick}
            >
              <div className="text-3xl font-bold text-gray-900">{propertyStats.maintenancePending}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
              <div className="text-sm text-orange-600 font-medium">Pending</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-red-50">
              <div className="text-3xl font-bold text-gray-900">{propertyStats.renewalsDueSoon}</div>
              <div className="text-sm text-gray-600">Renewals</div>
              <div className="text-sm text-red-600 font-medium">Due Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement Tracking */}
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

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Plus className="w-6 h-6" />
              <span className="text-sm">Add Resident</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Wrench className="w-6 h-6" />
              <span className="text-sm">Create Work Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Schedule Tour</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            Work Orders Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workOrderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="Completed" />
              <Bar dataKey="pending" fill="#EF4444" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorTodayTab;
