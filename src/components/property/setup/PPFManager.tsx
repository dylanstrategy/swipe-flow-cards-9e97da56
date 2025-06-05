
import React, { useState } from 'react';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, DollarSign, Target, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PPFManagerProps {
  onClose: () => void;
}

const PPFManager = ({ onClose }: PPFManagerProps) => {
  // Expiration Curve Management (percentage allocation per month)
  const [expirationCurve, setExpirationCurve] = useState([
    { month: 'Jan', percentage: 5, maxUnits: 15, currentProjected: 12 },
    { month: 'Feb', percentage: 8, maxUnits: 24, currentProjected: 18 },
    { month: 'Mar', percentage: 12, maxUnits: 36, currentProjected: 28 },
    { month: 'Apr', percentage: 10, maxUnits: 30, currentProjected: 32 },
    { month: 'May', percentage: 15, maxUnits: 45, currentProjected: 38 },
    { month: 'Jun', percentage: 8, maxUnits: 24, currentProjected: 22 },
    { month: 'Jul', percentage: 6, maxUnits: 18, currentProjected: 15 },
    { month: 'Aug', percentage: 9, maxUnits: 27, currentProjected: 25 },
    { month: 'Sep', percentage: 11, maxUnits: 33, currentProjected: 29 },
    { month: 'Oct', percentage: 7, maxUnits: 21, currentProjected: 19 },
    { month: 'Nov', percentage: 5, maxUnits: 15, currentProjected: 14 },
    { month: 'Dec', percentage: 4, maxUnits: 12, currentProjected: 8 }
  ]);

  // Dynamic Pricing Parameters
  const [pricingStrategy, setPricingStrategy] = useState({
    occupancyTarget: 96,
    pricingWeights: {
      occupancy: 40,
      marketComps: 30,
      expirationPressure: 20,
      seasonality: 10
    },
    compParameters: {
      radiusMiles: 2,
      minSampleSize: 5,
      maxAgeMonths: 3,
      qualityScore: 8
    },
    priceAdjustmentLimits: {
      maxIncrease: 5,
      maxDecrease: 3,
      frequencyDays: 7
    }
  });

  // Full 18-week PPF data
  const generatePPFData = () => {
    const weeks = [];
    const startDate = new Date();
    
    for (let i = 1; i <= 18; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + (i * 7));
      
      const month = weekDate.toLocaleDateString('en-US', { month: 'short' });
      const expirationData = expirationCurve.find(curve => curve.month === month);
      
      weeks.push({
        week: i,
        date: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        occupancy: {
          target: pricingStrategy.occupancyTarget,
          projected: Math.max(90, pricingStrategy.occupancyTarget - Math.random() * 3),
          confidence: Math.floor(85 + Math.random() * 10)
        },
        expirations: {
          allowed: Math.floor((expirationData?.maxUnits || 20) / 4),
          projected: Math.floor(Math.random() * 8) + 2,
          restricted: false
        },
        pricing: {
          avgRent: 3200 + Math.floor(Math.random() * 400),
          adjustmentRecommended: Math.floor(Math.random() * 100) - 50,
          leaseTermsRestricted: []
        },
        marketConditions: {
          demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
          competition: Math.floor(Math.random() * 5) + 6
        }
      });
    }
    
    return weeks;
  };

  const [ppfData] = useState(generatePPFData());

  // Automated Campaigns
  const [automatedCampaigns, setAutomatedCampaigns] = useState([
    {
      name: 'High Occupancy Price Optimization',
      trigger: 'occupancy > 97%',
      action: 'Increase renewal rates by 2-4%',
      status: 'active',
      lastTriggered: '2 days ago'
    },
    {
      name: 'Expiration Spike Management',
      trigger: 'month expirations > 110% of target',
      action: 'Restrict 12+ month lease terms',
      status: 'active',
      lastTriggered: 'Never'
    },
    {
      name: 'Market Comp Adjustment',
      trigger: 'comps increase > 3%',
      action: 'Auto-adjust pricing within limits',
      status: 'active',
      lastTriggered: '5 days ago'
    }
  ]);

  const handleExpirationCurveChange = (index: number, field: string, value: number) => {
    setExpirationCurve(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const getExpirationStatus = (month: any) => {
    if (month.currentProjected > month.maxUnits * 1.1) return 'over';
    if (month.currentProjected > month.maxUnits * 0.9) return 'warning';
    return 'good';
  };

  const getExpirationColor = (status: string) => {
    switch (status) {
      case 'over': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">PPF Management & Pricing Strategy</h2>
          <p className="text-gray-600">18-week forecast, expiration curve, and dynamic pricing controls</p>
        </div>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>

      <Tabs defaultValue="ppf" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ppf">18-Week PPF</TabsTrigger>
          <TabsTrigger value="expiration-curve">Expiration Curve</TabsTrigger>
          <TabsTrigger value="pricing-strategy">Pricing Strategy</TabsTrigger>
          <TabsTrigger value="campaigns">Automated Campaigns</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* 18-Week PPF Tab */}
        <TabsContent value="ppf" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>18-Week Property Performance Forecast</CardTitle>
              <p className="text-sm text-gray-600">
                Data sourced from internal lease management, renewals, and notices
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead>Expirations</TableHead>
                      <TableHead>Avg Rent</TableHead>
                      <TableHead>Market Demand</TableHead>
                      <TableHead>Pricing Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ppfData.map((week) => (
                      <TableRow key={week.week}>
                        <TableCell className="font-medium">
                          Week {week.week}<br/>
                          <span className="text-sm text-gray-500">{week.date}</span>
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
                                {week.occupancy.projected.toFixed(1)}%
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {week.occupancy.confidence}% confidence
                            </Badge>
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
                            {week.expirations.restricted && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Terms Restricted
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">${week.pricing.avgRent.toLocaleString()}</div>
                            {week.pricing.adjustmentRecommended !== 0 && (
                              <div className={`text-sm ${week.pricing.adjustmentRecommended > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {week.pricing.adjustmentRecommended > 0 ? '+' : ''}${week.pricing.adjustmentRecommended}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            week.marketConditions.demand === 'High' ? 'bg-green-100 text-green-800' :
                            week.marketConditions.demand === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {week.marketConditions.demand}
                          </Badge>
                          <div className="text-xs text-gray-600 mt-1">
                            Comp Score: {week.marketConditions.competition}/10
                          </div>
                        </TableCell>
                        <TableCell>
                          {week.pricing.adjustmentRecommended > 0 ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Increase ${week.pricing.adjustmentRecommended}
                            </Button>
                          ) : week.pricing.adjustmentRecommended < 0 ? (
                            <Button size="sm" variant="outline" className="text-red-600">
                              Decrease ${Math.abs(week.pricing.adjustmentRecommended)}
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-500">No action</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiration Curve Management Tab */}
        <TabsContent value="expiration-curve" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expiration Curve Management</CardTitle>
              <p className="text-sm text-gray-600">
                Set target percentage of total expirations per month. System will restrict lease terms that would exceed limits.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expirationCurve.map((month, index) => {
                  const status = getExpirationStatus(month);
                  return (
                    <Card key={month.month} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{month.month}</h4>
                        <Badge className={getExpirationColor(status)}>
                          {status === 'over' ? 'Over Limit' : status === 'warning' ? 'At Risk' : 'On Track'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Target %</Label>
                          <Input
                            type="number"
                            value={month.percentage}
                            onChange={(e) => handleExpirationCurveChange(index, 'percentage', parseInt(e.target.value))}
                            className="h-8"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">Max Units</Label>
                          <Input
                            value={month.maxUnits}
                            readOnly
                            className="h-8 bg-gray-50"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">Current Projected</Label>
                          <div className={`text-sm font-semibold ${
                            month.currentProjected > month.maxUnits ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {month.currentProjected} units
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="text-xs text-gray-600">
                            Availability: {month.maxUnits - month.currentProjected} units
                          </div>
                          {month.currentProjected > month.maxUnits && (
                            <div className="text-xs text-red-600 mt-1">
                              ⚠️ 12+ month terms restricted
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Automatic Lease Term Restrictions</h4>
                <p className="text-sm text-blue-800">
                  When a month exceeds 90% of its expiration limit, the system automatically restricts lease terms 
                  that would result in expirations during that month. This ensures balanced expiration distribution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Strategy Tab */}
        <TabsContent value="pricing-strategy" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Algorithm Weights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Occupancy Impact</Label>
                    <span className="text-sm font-medium">{pricingStrategy.pricingWeights.occupancy}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={pricingStrategy.pricingWeights.occupancy}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      pricingWeights: { ...prev.pricingWeights, occupancy: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Market Comps</Label>
                    <span className="text-sm font-medium">{pricingStrategy.pricingWeights.marketComps}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={pricingStrategy.pricingWeights.marketComps}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      pricingWeights: { ...prev.pricingWeights, marketComps: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Expiration Pressure</Label>
                    <span className="text-sm font-medium">{pricingStrategy.pricingWeights.expirationPressure}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={pricingStrategy.pricingWeights.expirationPressure}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      pricingWeights: { ...prev.pricingWeights, expirationPressure: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Seasonality</Label>
                    <span className="text-sm font-medium">{pricingStrategy.pricingWeights.seasonality}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={pricingStrategy.pricingWeights.seasonality}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      pricingWeights: { ...prev.pricingWeights, seasonality: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comp Analysis Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Search Radius (miles)</Label>
                  <Input
                    type="number"
                    value={pricingStrategy.compParameters.radiusMiles}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      compParameters: { ...prev.compParameters, radiusMiles: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                
                <div>
                  <Label>Minimum Sample Size</Label>
                  <Input
                    type="number"
                    value={pricingStrategy.compParameters.minSampleSize}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      compParameters: { ...prev.compParameters, minSampleSize: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                
                <div>
                  <Label>Max Data Age (months)</Label>
                  <Input
                    type="number"
                    value={pricingStrategy.compParameters.maxAgeMonths}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      compParameters: { ...prev.compParameters, maxAgeMonths: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                
                <div>
                  <Label>Quality Score Threshold (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={pricingStrategy.compParameters.qualityScore}
                    onChange={(e) => setPricingStrategy(prev => ({
                      ...prev,
                      compParameters: { ...prev.compParameters, qualityScore: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automated Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Pricing Campaigns</CardTitle>
              <p className="text-sm text-gray-600">
                Set up rules to automatically adjust pricing based on market conditions and property performance
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automatedCampaigns.map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {campaign.status}
                        </Badge>
                        <Switch checked={campaign.status === 'active'} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Trigger Condition</Label>
                        <p className="font-mono text-xs bg-gray-50 p-2 rounded">{campaign.trigger}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Automated Action</Label>
                        <p>{campaign.action}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Last Triggered</Label>
                        <p>{campaign.lastTriggered}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4">
                <Settings className="w-4 h-4 mr-2" />
                Create New Campaign
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automated Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Weekly PPF Summary</span>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-600">Every Monday at 8am</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Monthly Expiration Analysis</span>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-600">1st of each month</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Pricing Performance Review</span>
                    <Switch />
                  </div>
                  <p className="text-sm text-gray-600">Bi-weekly on Fridays</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manual Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  📊 Current PPF Status Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📈 Pricing Strategy Performance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📅 Expiration Curve Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🏢 Market Comp Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PPFManager;
