
import React, { useState } from 'react';
import { Database, Settings, TrendingUp, Calendar, DollarSign, Users, AlertCircle, CheckCircle, RefreshCw, FileText, Bell } from 'lucide-react';
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
  // Internal data tracking status
  const [internalDataSources, setInternalDataSources] = useState({
    lease_management: {
      name: 'Internal Lease Tracking',
      status: 'active',
      description: 'Tracks all lease signings, renewals, and amendments within our system',
      dataPoints: ['new_leases', 'renewals', 'amendments', 'lease_terms', 'expiration_dates'],
      lastUpdate: '2 minutes ago',
      recordsToday: 8,
      automatesData: ['PPF updates', 'Expiration curve', 'Occupancy tracking']
    },
    notice_management: {
      name: 'Notice to Vacate Tracking',
      status: 'active',
      description: 'Automatically captures all NTV submissions and updates PPF',
      dataPoints: ['notice_date', 'move_out_date', 'reason', 'unit_type'],
      lastUpdate: '15 minutes ago',
      recordsToday: 3,
      automatesData: ['PPF adjustments', 'Vacancy projections', 'Pricing triggers']
    },
    pricing_engine: {
      name: 'Dynamic Pricing Engine',
      status: 'active',
      description: 'Our internal pricing algorithm with market comp integration',
      dataPoints: ['market_rents', 'occupancy_adjustments', 'seasonal_factors', 'competitor_rates'],
      lastUpdate: '5 minutes ago',
      recordsToday: 156,
      automatesData: ['Rent recommendations', 'Lease term restrictions', 'Market positioning']
    },
    occupancy_tracker: {
      name: 'Real-time Occupancy',
      status: 'active',
      description: 'Live tracking of unit status, move-ins, and move-outs',
      dataPoints: ['unit_status', 'move_in_date', 'move_out_date', 'vacancy_duration'],
      lastUpdate: '1 minute ago',
      recordsToday: 12,
      automatesData: ['PPF occupancy targets', 'Pricing adjustments', 'Marketing triggers']
    }
  });

  // External integrations (optional)
  const [externalSources, setExternalSources] = useState({
    market_data: {
      name: 'RentSpree Market Data',
      status: 'connected',
      apiEndpoint: 'https://api.rentspree.com/v1/market',
      syncFrequency: 'daily',
      lastSync: '6 hours ago',
      cost: '$299/month'
    },
    competitor_intel: {
      name: 'RentBerry Comp Analysis',
      status: 'connected',
      apiEndpoint: 'https://api.rentberry.com/comps',
      syncFrequency: 'weekly',
      lastSync: '2 days ago',
      cost: '$199/month'
    },
    demographic_data: {
      name: 'Census Bureau API',
      status: 'connected',
      apiEndpoint: 'https://api.census.gov/data',
      syncFrequency: 'monthly',
      lastSync: '1 week ago',
      cost: 'Free'
    }
  });

  // Data flow automation rules
  const [automationRules, setAutomationRules] = useState([
    {
      trigger: 'New lease signed',
      conditions: ['lease_term >= 12 months'],
      actions: ['Update PPF expiration curve', 'Check monthly allocation limits', 'Trigger pricing review'],
      status: 'active',
      lastTriggered: '45 minutes ago'
    },
    {
      trigger: 'Notice to Vacate received',
      conditions: ['move_out_date within 60 days'],
      actions: ['Update vacancy projections', 'Trigger marketing workflow', 'Adjust occupancy targets'],
      status: 'active',
      lastTriggered: '2 hours ago'
    },
    {
      trigger: 'Occupancy drops below target',
      conditions: ['occupancy < 96%', 'trend > 3 days'],
      actions: ['Reduce renewal rates', 'Increase marketing budget', 'Review pricing strategy'],
      status: 'active',
      lastTriggered: 'Never'
    },
    {
      trigger: 'Monthly expiration limit exceeded',
      conditions: ['projected_expirations > monthly_limit'],
      actions: ['Restrict 12+ month lease terms', 'Notify leasing team', 'Adjust renewal incentives'],
      status: 'active',
      lastTriggered: '1 week ago'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error':
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Source Management</h2>
            <p className="text-gray-600">Internal data tracking and external integrations that power PPF automation</p>
          </div>
          <Button onClick={onBack} variant="outline">Back to Setup</Button>
        </div>

        <Tabs defaultValue="internal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="internal" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Internal Tracking
            </TabsTrigger>
            <TabsTrigger value="external" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              External Sources
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Automation Rules
            </TabsTrigger>
            <TabsTrigger value="data-flow" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Data Flow
            </TabsTrigger>
          </TabsList>

          {/* Internal Data Sources Tab */}
          <TabsContent value="internal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(internalDataSources).map(([key, source]) => (
                <Card key={key} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <Badge className={getStatusColor(source.status)}>
                        {getStatusIcon(source.status)}
                        <span className="ml-1 capitalize">{source.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{source.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Last Update</Label>
                        <p className="font-medium">{source.lastUpdate}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Records Today</Label>
                        <p className="font-medium text-blue-600">{source.recordsToday}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">Data Points Captured</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {source.dataPoints.map(point => (
                          <Badge key={point} variant="outline" className="text-xs">
                            {point.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">Automates</Label>
                      <div className="space-y-1 mt-1">
                        {source.automatesData.map(item => (
                          <div key={item} className="text-sm text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Database className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Internal Data Source Benefits</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Real-time PPF updates as leases are signed and notices submitted</li>
                      <li>• Automatic expiration curve management and lease term restrictions</li>
                      <li>• Dynamic pricing adjustments based on actual occupancy and market conditions</li>
                      <li>• Seamless integration with all property management workflows</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* External Sources Tab */}
          <TabsContent value="external" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(externalSources).map(([key, source]) => (
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
                        className="mt-1 text-sm font-mono"
                        readOnly
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-600 text-sm">Cost</Label>
                        <p className="font-semibold">{source.cost}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Sync
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Add New External Source</span>
                  <Button size="sm">
                    <Database className="w-4 h-4 mr-1" />
                    Connect Source
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Connect additional market data sources, comp analysis tools, or demographic APIs to enhance pricing decisions.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Rules Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Flow Automation Rules</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure how internal data automatically triggers PPF updates, pricing changes, and workflow actions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{rule.trigger}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {rule.status}
                          </Badge>
                          <Switch checked={rule.status === 'active'} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-600">Conditions</Label>
                          <div className="space-y-1 mt-1">
                            {rule.conditions.map((condition, i) => (
                              <div key={i} className="font-mono text-xs bg-gray-50 p-2 rounded">
                                {condition}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-600">Automated Actions</Label>
                          <div className="space-y-1 mt-1">
                            {rule.actions.map((action, i) => (
                              <div key={i} className="text-xs text-green-700 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-600">Last Triggered</Label>
                          <p className="text-sm">{rule.lastTriggered}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Create New Automation Rule
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Flow Tab */}
          <TabsContent value="data-flow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Data Flow Visualization</CardTitle>
                <p className="text-sm text-gray-600">
                  Live view of how data flows from actions to PPF updates and pricing decisions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Data flow visualization */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Today's Data Flow</h4>
                      <Badge className="bg-blue-100 text-blue-800">23 events processed</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-sm font-medium">8 Leases Signed</p>
                        <p className="text-xs text-gray-600">Auto-updated PPF</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Bell className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-sm font-medium">3 Notices Received</p>
                        <p className="text-xs text-gray-600">Updated vacancy projections</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <DollarSign className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">12 Pricing Updates</p>
                        <p className="text-xs text-gray-600">Based on occupancy</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Calendar className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium">2 Term Restrictions</p>
                        <p className="text-xs text-gray-600">May expiration limit</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Recent Data Events</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3 py-2 border-b">
                        <Badge className="bg-green-100 text-green-800">Lease</Badge>
                        <span>Unit 304A - 13-month lease signed → PPF updated, May 2025 expiration added</span>
                        <span className="text-gray-500 ml-auto">2 min ago</span>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-b">
                        <Badge className="bg-blue-100 text-blue-800">Pricing</Badge>
                        <span>1BR units increased $25/month → Occupancy above target (97.2%)</span>
                        <span className="text-gray-500 ml-auto">15 min ago</span>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-b">
                        <Badge className="bg-red-100 text-red-800">Notice</Badge>
                        <span>Unit 201B - NTV received → March 2025 vacancy projected</span>
                        <span className="text-gray-500 ml-auto">32 min ago</span>
                      </div>
                      <div className="flex items-center gap-3 py-2">
                        <Badge className="bg-purple-100 text-purple-800">Restriction</Badge>
                        <span>12+ month terms restricted → May exceeds 90% expiration limit</span>
                        <span className="text-gray-500 ml-auto">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceManager;
