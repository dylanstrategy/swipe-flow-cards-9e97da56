
import React, { useState } from 'react';
import { Database, Settings, TrendingUp, Calendar, DollarSign, Users, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataSourceManagerProps {
  onBack: () => void;
}

const DataSourceManager = ({ onBack }: DataSourceManagerProps) => {
  const [dataSources, setDataSources] = useState({
    tour_system: {
      name: 'Tour Management System',
      status: 'connected',
      lastSync: '2 minutes ago',
      apiEndpoint: 'https://api.tourmanager.com/v1',
      apiKey: '***************',
      syncFrequency: 'real-time',
      dataPoints: ['tour_bookings', 'no_shows', 'conversions', 'agent_assignments']
    },
    lease_management: {
      name: 'Lease Management System',
      status: 'connected',
      lastSync: '5 minutes ago',
      apiEndpoint: 'https://api.leasemanager.com/v2',
      apiKey: '***************',
      syncFrequency: '15-minutes',
      dataPoints: ['lease_expirations', 'renewals', 'move_outs', 'lease_terms']
    },
    pricing_engine: {
      name: 'Dynamic Pricing Engine',
      status: 'connected',
      lastSync: '1 minute ago',
      apiEndpoint: 'internal://pricing-module',
      apiKey: 'internal',
      syncFrequency: 'real-time',
      dataPoints: ['market_rents', 'suggested_pricing', 'competitor_rates', 'occupancy_adjustments']
    },
    payment_system: {
      name: 'Payment Processing',
      status: 'warning',
      lastSync: '2 hours ago',
      apiEndpoint: 'https://api.payments.com/v1',
      apiKey: '***************',
      syncFrequency: 'hourly',
      dataPoints: ['payment_status', 'late_fees', 'autopay_enrollment', 'collection_status']
    },
    maintenance_system: {
      name: 'Maintenance Management',
      status: 'connected',
      lastSync: '3 minutes ago',
      apiEndpoint: 'internal://maintenance-module',
      apiKey: 'internal',
      syncFrequency: 'real-time',
      dataPoints: ['work_orders', 'completion_status', 'vendor_assignments', 'resident_satisfaction']
    },
    resident_portal: {
      name: 'Resident Portal',
      status: 'connected',
      lastSync: '1 minute ago',
      apiEndpoint: 'https://portal.residents.com/api',
      apiKey: '***************',
      syncFrequency: 'real-time',
      dataPoints: ['portal_activity', 'communication_preferences', 'service_requests', 'feedback']
    },
    crm_system: {
      name: 'CRM Integration',
      status: 'disconnected',
      lastSync: 'Never',
      apiEndpoint: '',
      apiKey: '',
      syncFrequency: 'manual',
      dataPoints: ['prospect_data', 'lead_scoring', 'communication_history', 'conversion_tracking']
    }
  });

  const [ppfSettings, setPpfSettings] = useState({
    enabled: true,
    forecastPeriod: 18,
    occupancyTarget: 96,
    expirationThresholds: {
      green: 5,
      yellow: 3,
      red: 1
    },
    autoAdjustPricing: true,
    notificationTriggers: ['occupancy_drop', 'expiration_spike', 'renewal_decline']
  });

  const [marketRentAdjustments, setMarketRentAdjustments] = useState([
    {
      unitType: 'Studio',
      currentMarket: 2550,
      suggestedMarket: 2575,
      adjustment: 25,
      reason: 'Competitive analysis update',
      effectiveDate: '2024-01-15',
      approved: false
    },
    {
      unitType: '1BR',
      currentMarket: 3100,
      suggestedMarket: 3125,
      adjustment: 25,
      reason: 'Occupancy above target',
      effectiveDate: '2024-01-15',
      approved: true
    },
    {
      unitType: '2BR',
      currentMarket: 4350,
      suggestedMarket: 4300,
      adjustment: -50,
      reason: 'High vacancy rate',
      effectiveDate: '2024-01-15',
      approved: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const handleApproveAdjustment = (index: number) => {
    setMarketRentAdjustments(prev => 
      prev.map((adj, i) => i === index ? { ...adj, approved: true } : adj)
    );
  };

  const handleRejectAdjustment = (index: number) => {
    setMarketRentAdjustments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Source Management</h2>
            <p className="text-gray-600">Configure data integrations, PPF settings, and market rent adjustments</p>
          </div>
          <Button onClick={onBack} variant="outline">
            Back to Setup
          </Button>
        </div>

        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="ppf" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              PPF Settings
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Market Rents
            </TabsTrigger>
            <TabsTrigger value="occupancy" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Occupancy
            </TabsTrigger>
          </TabsList>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(dataSources).map(([key, source]) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <Badge className={getStatusColor(source.status)}>
                        {getStatusIcon(source.status)}
                        <span className="ml-1 capitalize">{source.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Last Sync</Label>
                        <p className="font-medium">{source.lastSync}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Frequency</Label>
                        <p className="font-medium capitalize">{source.syncFrequency}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">API Endpoint</Label>
                      <Input 
                        value={source.apiEndpoint} 
                        className="mt-1 text-sm"
                        readOnly={source.apiKey === 'internal'}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">Data Points</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {source.dataPoints.map(point => (
                          <Badge key={point} variant="outline" className="text-xs">
                            {point.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync Now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PPF Settings Tab */}
          <TabsContent value="ppf" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Property Performance Forecast Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ppf-enabled">Enable PPF Automation</Label>
                      <Switch
                        id="ppf-enabled"
                        checked={ppfSettings.enabled}
                        onCheckedChange={(checked) => 
                          setPpfSettings(prev => ({ ...prev, enabled: checked }))
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Forecast Period (weeks)</Label>
                      <Input
                        type="number"
                        value={ppfSettings.forecastPeriod}
                        onChange={(e) => 
                          setPpfSettings(prev => ({ ...prev, forecastPeriod: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Target Occupancy (%)</Label>
                      <Input
                        type="number"
                        value={ppfSettings.occupancyTarget}
                        onChange={(e) => 
                          setPpfSettings(prev => ({ ...prev, occupancyTarget: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Expiration Thresholds</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-800 w-16">Green</Badge>
                          <Input
                            type="number"
                            value={ppfSettings.expirationThresholds.green}
                            onChange={(e) => 
                              setPpfSettings(prev => ({
                                ...prev,
                                expirationThresholds: { ...prev.expirationThresholds, green: parseInt(e.target.value) }
                              }))
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">units remaining</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-yellow-100 text-yellow-800 w-16">Yellow</Badge>
                          <Input
                            type="number"
                            value={ppfSettings.expirationThresholds.yellow}
                            onChange={(e) => 
                              setPpfSettings(prev => ({
                                ...prev,
                                expirationThresholds: { ...prev.expirationThresholds, yellow: parseInt(e.target.value) }
                              }))
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">units remaining</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-red-100 text-red-800 w-16">Red</Badge>
                          <Input
                            type="number"
                            value={ppfSettings.expirationThresholds.red}
                            onChange={(e) => 
                              setPpfSettings(prev => ({
                                ...prev,
                                expirationThresholds: { ...prev.expirationThresholds, red: parseInt(e.target.value) }
                              }))
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">units remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label>Auto-Adjust Pricing Based on PPF</Label>
                    <Switch
                      checked={ppfSettings.autoAdjustPricing}
                      onCheckedChange={(checked) => 
                        setPpfSettings(prev => ({ ...prev, autoAdjustPricing: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Rent Adjustments Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Pending Market Rent Adjustments
                  </span>
                  <Button size="sm">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Manual Adjustment
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketRentAdjustments.map((adjustment, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{adjustment.unitType}</Badge>
                          <span className="font-medium">${adjustment.currentMarket.toLocaleString()} → ${adjustment.suggestedMarket.toLocaleString()}</span>
                          <Badge className={adjustment.adjustment > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {adjustment.adjustment > 0 ? '+' : ''}${adjustment.adjustment}
                          </Badge>
                        </div>
                        <Badge className={adjustment.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {adjustment.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <Label className="text-gray-600">Reason</Label>
                          <p>{adjustment.reason}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Effective Date</Label>
                          <p>{adjustment.effectiveDate}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Impact</Label>
                          <p>{adjustment.adjustment > 0 ? 'Revenue increase' : 'Occupancy improvement'}</p>
                        </div>
                      </div>
                      
                      {!adjustment.approved && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveAdjustment(index)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectAdjustment(index)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Tab */}
          <TabsContent value="occupancy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Occupancy Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Physical Occupancy</span>
                      <span className="font-bold text-green-600">96.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Economic Occupancy</span>
                      <span className="font-bold text-blue-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Available Units</span>
                      <span className="font-bold">5 units</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vacant Units</span>
                      <span className="font-bold">8 units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expiration Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Next 30 days</span>
                      <Badge className="bg-red-100 text-red-800">12 expirations</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>31-60 days</span>
                      <Badge className="bg-yellow-100 text-yellow-800">8 expirations</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>61-90 days</span>
                      <Badge className="bg-green-100 text-green-800">15 expirations</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>90+ days</span>
                      <Badge className="bg-blue-100 text-blue-800">22 expirations</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceManager;
