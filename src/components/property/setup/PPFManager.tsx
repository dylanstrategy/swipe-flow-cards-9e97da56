
import React, { useState } from 'react';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PPFManagerProps {
  onClose: () => void;
}

const PPFManager = ({ onClose }: PPFManagerProps) => {
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  
  // Enhanced PPF data with more detailed tracking
  const [ppfData, setPpfData] = useState([
    { 
      week: 1, 
      month: 'Jan', 
      year: 2024,
      occupancy: { target: 96.5, projected: 96.2, actual: 96.8 },
      expirations: { 
        allowed: 8, 
        projected: 5, 
        actual: 3, 
        remaining: 5,
        renewals: 2,
        moveouts: 1
      },
      revenue: { target: 485000, projected: 483200, variance: -1800 },
      actions: ['Increase renewal incentives', 'Schedule renewal meetings'],
      status: 'on-track'
    },
    { 
      week: 2, 
      month: 'Jan', 
      year: 2024,
      occupancy: { target: 96.5, projected: 95.8, actual: null },
      expirations: { 
        allowed: 8, 
        projected: 6, 
        actual: null, 
        remaining: 2,
        renewals: null,
        moveouts: null
      },
      revenue: { target: 485000, projected: 481500, variance: -3500 },
      actions: ['Monitor expiration pipeline', 'Adjust pricing on available units'],
      status: 'caution'
    },
    // Add more weeks...
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="w-4 h-4" />;
      case 'caution': return <Clock className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">PPF Management</h2>
          <p className="text-gray-600">Property Performance Forecast - 18 Week Outlook</p>
        </div>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Occupancy</p>
                <p className="text-xl font-bold">96.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Expirations This Month</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Renewal Rate</p>
                <p className="text-xl font-bold">68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">At Risk Weeks</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed PPF Table */}
      <Card>
        <CardHeader>
          <CardTitle>18-Week Performance Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Expirations</TableHead>
                  <TableHead>Revenue Target</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ppfData.map((week) => (
                  <TableRow key={week.week}>
                    <TableCell className="font-medium">
                      Week {week.week}<br/>
                      <span className="text-sm text-gray-500">{week.month} {week.year}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Target:</span>
                          <span className="font-semibold">{week.occupancy.target}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Projected:</span>
                          <span className={week.occupancy.projected >= week.occupancy.target ? 'text-green-600' : 'text-red-600'}>
                            {week.occupancy.projected}%
                          </span>
                        </div>
                        {week.occupancy.actual && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Actual:</span>
                            <span className="font-bold text-blue-600">{week.occupancy.actual}%</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Allowed:</span>
                          <span className="font-semibold">{week.expirations.allowed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Projected:</span>
                          <span>{week.expirations.projected}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Remaining:</span>
                          <Badge className={
                            week.expirations.remaining > 3 ? 'bg-green-100 text-green-800' :
                            week.expirations.remaining > 1 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {week.expirations.remaining}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold">${week.revenue.target.toLocaleString()}</div>
                        <div className="text-sm">${week.revenue.projected.toLocaleString()}</div>
                        <div className={`text-sm ${week.revenue.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {week.revenue.variance >= 0 ? '+' : ''}${week.revenue.variance.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {week.actions.map((action, index) => (
                          <Badge key={index} variant="outline" className="text-xs block mb-1">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(week.status)}>
                        {getStatusIcon(week.status)}
                        <span className="ml-1 capitalize">{week.status.replace('-', ' ')}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingWeek(week.week)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Automated Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Automated PPF Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">✓ Pricing Adjustments</h4>
                <p className="text-sm text-gray-600">
                  Automatically adjust renewal rates when occupancy targets are met or exceeded
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">📧 Renewal Campaigns</h4>
                <p className="text-sm text-gray-600">
                  Trigger early renewal campaigns when expiration allowances are low
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-yellow-600 mb-2">⚠️ Alert Notifications</h4>
                <p className="text-sm text-gray-600">
                  Send alerts to leasing team when weekly targets are at risk
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">📊 Report Generation</h4>
                <p className="text-sm text-gray-600">
                  Auto-generate weekly PPF reports for stakeholders
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PPFManager;
