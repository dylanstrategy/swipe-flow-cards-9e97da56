
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Settings, TrendingUp, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingDashboardProps {
  onBack: () => void;
}

const PricingDashboard = ({ onBack }: PricingDashboardProps) => {
  // Core pricing parameters
  const [currentOccupancy, setCurrentOccupancy] = useState(96.5);
  const [selectedMoveInDate, setSelectedMoveInDate] = useState(new Date());
  const [selectedUnitType, setSelectedUnitType] = useState('1BR');
  
  // Expiration allocation by month (percentage of total expirations)
  const [expirationAllocation, setExpirationAllocation] = useState([
    { month: 'Jan', percentage: 8, maxUnits: 24, currentCount: 18 },
    { month: 'Feb', percentage: 12, maxUnits: 36, currentCount: 32 },
    { month: 'Mar', percentage: 15, maxUnits: 45, currentCount: 41 },
    { month: 'Apr', percentage: 10, maxUnits: 30, currentCount: 28 },
    { month: 'May', percentage: 8, maxUnits: 24, currentCount: 22 },
    { month: 'Jun', percentage: 6, maxUnits: 18, currentCount: 15 },
    { month: 'Jul', percentage: 7, maxUnits: 21, currentCount: 19 },
    { month: 'Aug', percentage: 9, maxUnits: 27, currentCount: 24 },
    { month: 'Sep', percentage: 11, maxUnits: 33, currentCount: 30 },
    { month: 'Oct', percentage: 6, maxUnits: 18, currentCount: 16 },
    { month: 'Nov', percentage: 4, maxUnits: 12, currentCount: 10 },
    { month: 'Dec', percentage: 4, maxUnits: 12, currentCount: 8 }
  ]);

  // Lease term adjustments
  const [leaseTermAdjustments, setLeaseTermAdjustments] = useState([
    { term: 6, adjustment: -150, type: 'dollar' },
    { term: 7, adjustment: -100, type: 'dollar' },
    { term: 8, adjustment: -75, type: 'dollar' },
    { term: 9, adjustment: -50, type: 'dollar' },
    { term: 10, adjustment: -25, type: 'dollar' },
    { term: 11, adjustment: 0, type: 'dollar' },
    { term: 12, adjustment: 0, type: 'dollar' },
    { term: 13, adjustment: 25, type: 'dollar' },
    { term: 14, adjustment: 50, type: 'dollar' },
    { term: 15, adjustment: 75, type: 'dollar' }
  ]);

  // Occupancy-based pricing rules
  const [occupancyRules, setOccupancyRules] = useState([
    { threshold: 98, adjustment: 10, type: 'percent' },
    { threshold: 97, adjustment: 5, type: 'percent' },
    { threshold: 95, adjustment: 0, type: 'percent' },
    { threshold: 93, adjustment: -3, type: 'percent' },
    { threshold: 90, adjustment: -5, type: 'percent' }
  ]);

  // Market comps
  const [marketComps, setMarketComps] = useState([
    { name: 'The Meridian East', rent: 3250, weight: 25, quality: 9 },
    { name: 'Downtown Lofts', rent: 3180, weight: 20, quality: 8 },
    { name: 'City Center Apartments', rent: 3320, weight: 30, quality: 9 },
    { name: 'Urban Heights', rent: 3150, weight: 15, quality: 7 },
    { name: 'Metro Commons', rent: 3280, weight: 10, quality: 8 }
  ]);

  // Base unit pricing by type
  const [unitTypePricing, setUnitTypePricing] = useState([
    { type: 'Studio', baseRent: 2850, available: true },
    { type: '1BR', baseRent: 3200, available: true },
    { type: '2BR', baseRent: 4100, available: true },
    { type: '3BR', baseRent: 5200, available: false }
  ]);

  // 18-week forecast data
  const [weeklyForecast] = useState(() => {
    const weeks = [];
    for (let i = 1; i <= 18; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i * 7));
      weeks.push({
        week: i,
        date: date.toDateString(),
        occupancy: Math.max(90, 96.5 - Math.random() * 3),
        moveIns: Math.floor(Math.random() * 8) + 2,
        moveOuts: Math.floor(Math.random() * 6) + 1
      });
    }
    return weeks;
  });

  // Calculate pricing suggestions
  const calculatePricingSuggestions = () => {
    const selectedUnit = unitTypePricing.find(unit => unit.type === selectedUnitType);
    if (!selectedUnit) return [];

    const baseRent = selectedUnit.baseRent;
    
    // Get comp-based pricing
    const weightedCompPrice = marketComps.reduce((sum, comp) => 
      sum + (comp.rent * comp.weight / 100), 0
    );

    // Get occupancy adjustment
    const occupancyRule = occupancyRules.find(rule => currentOccupancy >= rule.threshold) || occupancyRules[occupancyRules.length - 1];
    const occupancyAdjustment = occupancyRule.type === 'percent' 
      ? baseRent * (occupancyRule.adjustment / 100)
      : occupancyRule.adjustment;

    const suggestions = [];

    for (const termAdj of leaseTermAdjustments) {
      // Calculate expiration month
      const expirationDate = new Date(selectedMoveInDate);
      expirationDate.setMonth(expirationDate.getMonth() + termAdj.term);
      const expirationMonth = expirationDate.toLocaleDateString('en-US', { month: 'short' });
      
      // Check if expiration is allowed
      const monthData = expirationAllocation.find(month => month.month === expirationMonth);
      const isTermAllowed = monthData ? monthData.currentCount < monthData.maxUnits : true;

      // Calculate final rent
      let finalRent = Math.round((baseRent + weightedCompPrice) / 2); // Average of base and comps
      finalRent += occupancyAdjustment;
      finalRent += termAdj.type === 'percent' 
        ? finalRent * (termAdj.adjustment / 100)
        : termAdj.adjustment;

      suggestions.push({
        term: termAdj.term,
        rent: Math.round(finalRent),
        expirationMonth,
        isAllowed: isTermAllowed,
        breakdown: {
          baseRent,
          compAdjustment: Math.round(weightedCompPrice - baseRent),
          occupancyAdjustment: Math.round(occupancyAdjustment),
          termAdjustment: termAdj.adjustment
        }
      });
    }

    return suggestions.sort((a, b) => b.rent - a.rent);
  };

  const pricingSuggestions = calculatePricingSuggestions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Property Setup
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dynamic Pricing Dashboard</h1>
          <p className="text-gray-600">Configure pricing parameters and view real-time pricing suggestions</p>
        </div>

        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pricing">Pricing Engine</TabsTrigger>
            <TabsTrigger value="expiration">Expiration Allocation</TabsTrigger>
            <TabsTrigger value="comps">Market Comps</TabsTrigger>
            <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
            <TabsTrigger value="forecast">18-Week Forecast</TabsTrigger>
          </TabsList>

          {/* Pricing Engine Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Parameters */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Pricing Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Occupancy (%)</Label>
                    <Input
                      type="number"
                      value={currentOccupancy}
                      onChange={(e) => setCurrentOccupancy(parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <Label>Move-In Date</Label>
                    <Input
                      type="date"
                      value={selectedMoveInDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedMoveInDate(new Date(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label>Unit Type</Label>
                    <Select value={selectedUnitType} onValueChange={setSelectedUnitType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unitTypePricing.filter(unit => unit.available).map(unit => (
                          <SelectItem key={unit.type} value={unit.type}>
                            {unit.type} - ${unit.baseRent.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Suggestions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Pricing Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Term (Months)</TableHead>
                        <TableHead>Suggested Rent</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pricingSuggestions.map((suggestion) => (
                        <TableRow key={suggestion.term}>
                          <TableCell className="font-medium">{suggestion.term}</TableCell>
                          <TableCell className="font-semibold text-lg">
                            ${suggestion.rent.toLocaleString()}
                          </TableCell>
                          <TableCell>{suggestion.expirationMonth}</TableCell>
                          <TableCell>
                            {suggestion.isAllowed ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Available
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Restricted
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {suggestion.isAllowed && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Apply Price
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Breakdown (12-Month Example)</CardTitle>
              </CardHeader>
              <CardContent>
                {pricingSuggestions.find(s => s.term === 12) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Base Rent</div>
                      <div className="text-xl font-semibold">
                        ${pricingSuggestions.find(s => s.term === 12)?.breakdown.baseRent.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Comp Adjustment</div>
                      <div className="text-xl font-semibold">
                        {pricingSuggestions.find(s => s.term === 12)?.breakdown.compAdjustment >= 0 ? '+' : ''}
                        ${pricingSuggestions.find(s => s.term === 12)?.breakdown.compAdjustment.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600">Occupancy Adjustment</div>
                      <div className="text-xl font-semibold">
                        {pricingSuggestions.find(s => s.term === 12)?.breakdown.occupancyAdjustment >= 0 ? '+' : ''}
                        ${pricingSuggestions.find(s => s.term === 12)?.breakdown.occupancyAdjustment.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Term Adjustment</div>
                      <div className="text-xl font-semibold">
                        {pricingSuggestions.find(s => s.term === 12)?.breakdown.termAdjustment >= 0 ? '+' : ''}
                        ${pricingSuggestions.find(s => s.term === 12)?.breakdown.termAdjustment.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expiration Allocation Tab */}
          <TabsContent value="expiration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expiration Allocation</CardTitle>
                <p className="text-sm text-gray-600">
                  Set the maximum percentage of total expirations allowed per month
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {expirationAllocation.map((month, index) => (
                    <Card key={month.month} className="p-4">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold">{month.month}</h4>
                        <Badge className={
                          month.currentCount >= month.maxUnits ? 'bg-red-100 text-red-800' :
                          month.currentCount >= month.maxUnits * 0.9 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {month.currentCount}/{month.maxUnits}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">Allocation %</Label>
                          <Input
                            type="number"
                            value={month.percentage}
                            onChange={(e) => {
                              const newAllocation = [...expirationAllocation];
                              newAllocation[index].percentage = parseInt(e.target.value);
                              newAllocation[index].maxUnits = Math.floor(300 * parseInt(e.target.value) / 100); // Assuming 300 total units
                              setExpirationAllocation(newAllocation);
                            }}
                            className="h-8 text-sm"
                            min="0"
                            max="25"
                          />
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          Available: {Math.max(0, month.maxUnits - month.currentCount)} units
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Comps Tab */}
          <TabsContent value="comps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Comparables</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure competitor properties and their influence on pricing
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property Name</TableHead>
                      <TableHead>Rent ({selectedUnitType})</TableHead>
                      <TableHead>Weight (%)</TableHead>
                      <TableHead>Quality Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketComps.map((comp, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{comp.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.rent}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].rent = parseInt(e.target.value);
                              setMarketComps(newComps);
                            }}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.weight}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].weight = parseInt(e.target.value);
                              setMarketComps(newComps);
                            }}
                            className="w-16"
                            min="0"
                            max="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge>{comp.quality}/10</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy-Based Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {occupancyRules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Label className="text-sm">≥{rule.threshold}% occupancy</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={rule.adjustment}
                            onChange={(e) => {
                              const newRules = [...occupancyRules];
                              newRules[index].adjustment = parseInt(e.target.value);
                              setOccupancyRules(newRules);
                            }}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lease Term Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {leaseTermAdjustments.map((term, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 border rounded">
                        <div className="w-16 text-sm font-medium">{term.term}mo</div>
                        <Input
                          type="number"
                          value={term.adjustment}
                          onChange={(e) => {
                            const newTerms = [...leaseTermAdjustments];
                            newTerms[index].adjustment = parseInt(e.target.value);
                            setLeaseTermAdjustments(newTerms);
                          }}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">$</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 18-Week Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  18-Week Occupancy Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Projected Occupancy</TableHead>
                      <TableHead>Move-Ins</TableHead>
                      <TableHead>Move-Outs</TableHead>
                      <TableHead>Net Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyForecast.map((week) => (
                      <TableRow key={week.week}>
                        <TableCell className="font-medium">Week {week.week}</TableCell>
                        <TableCell>{week.date}</TableCell>
                        <TableCell>
                          <span className={
                            week.occupancy >= 98 ? 'text-red-600 font-semibold' :
                            week.occupancy >= 95 ? 'text-green-600 font-semibold' :
                            'text-yellow-600 font-semibold'
                          }>
                            {week.occupancy.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-green-600">+{week.moveIns}</TableCell>
                        <TableCell className="text-red-600">-{week.moveOuts}</TableCell>
                        <TableCell>
                          <span className={week.moveIns - week.moveOuts >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {week.moveIns - week.moveOuts >= 0 ? '+' : ''}{week.moveIns - week.moveOuts}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingDashboard;
