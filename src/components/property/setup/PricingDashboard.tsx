import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Settings, TrendingUp, AlertTriangle, CheckCircle, Edit, Building, Plus, Trash2 } from 'lucide-react';
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
  
  // Occupancy thresholds with pricing adjustments
  const [occupancyThresholds, setOccupancyThresholds] = useState([
    { threshold: 98, adjustment: 15, type: 'percent' },
    { threshold: 97, adjustment: 10, type: 'percent' },
    { threshold: 95, adjustment: 5, type: 'percent' },
    { threshold: 93, adjustment: 0, type: 'percent' },
    { threshold: 90, adjustment: -5, type: 'percent' },
    { threshold: 85, adjustment: -10, type: 'percent' }
  ]);

  // Market comps with detailed configuration
  const [marketComps, setMarketComps] = useState([
    { 
      name: 'The Meridian East', 
      studio: 2650, 
      oneBR: 3250, 
      twoBR: 4150, 
      threeBR: 5200,
      weight: 25, 
      quality: 9 
    },
    { 
      name: 'Downtown Lofts', 
      studio: 2580, 
      oneBR: 3180, 
      twoBR: 4080, 
      threeBR: 5100,
      weight: 20, 
      quality: 8 
    },
    { 
      name: 'City Center Apartments', 
      studio: 2720, 
      oneBR: 3320, 
      twoBR: 4220, 
      threeBR: 5350,
      weight: 30, 
      quality: 9 
    },
    { 
      name: 'Urban Heights', 
      studio: 2550, 
      oneBR: 3150, 
      twoBR: 4050, 
      threeBR: 5050,
      weight: 15, 
      quality: 7 
    },
    { 
      name: 'Metro Commons', 
      studio: 2680, 
      oneBR: 3280, 
      twoBR: 4180, 
      threeBR: 5250,
      weight: 10, 
      quality: 8 
    }
  ];

  // Unit type pricing configuration with min/max
  const [unitTypePricing, setUnitTypePricing] = useState([
    { 
      type: 'Studio', 
      baseRent: 2650, 
      minRent: 2400, 
      maxRent: 2900, 
      available: true,
      unitCount: 45
    },
    { 
      type: '1BR', 
      baseRent: 3200, 
      minRent: 2950, 
      maxRent: 3500, 
      available: true,
      unitCount: 120
    },
    { 
      type: '2BR', 
      baseRent: 4100, 
      minRent: 3800, 
      maxRent: 4500, 
      available: true,
      unitCount: 80
    },
    { 
      type: '3BR', 
      baseRent: 5200, 
      minRent: 4800, 
      maxRent: 5700, 
      available: true,
      unitCount: 35
    }
  ]);

  // Expiration allocation by month
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

  // 18-week forecast data with occupancy
  const [weeklyForecast] = useState(() => {
    const weeks = [];
    for (let i = 1; i <= 18; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i * 7));
      weeks.push({
        week: i,
        date: date.toDateString(),
        occupancy: Math.max(85, 96.5 - Math.random() * 8 + Math.random() * 3),
        moveIns: Math.floor(Math.random() * 8) + 2,
        moveOuts: Math.floor(Math.random() * 6) + 1
      });
    }
    return weeks;
  });

  // Calculate comp-based pricing for selected unit type
  const calculateCompPrice = () => {
    const unitTypeKey = selectedUnitType === 'Studio' ? 'studio' :
                       selectedUnitType === '1BR' ? 'oneBR' :
                       selectedUnitType === '2BR' ? 'twoBR' : 'threeBR';
    
    // Calculate weighted average
    const totalWeight = marketComps.reduce((sum, comp) => sum + comp.weight, 0);
    const weightedPrice = marketComps.reduce((sum, comp) => {
      const unitPrice = comp[unitTypeKey] || 0;
      return sum + (unitPrice * comp.weight / totalWeight);
    }, 0);

    return Math.round(weightedPrice);
  };

  // Get occupancy adjustment based on current occupancy
  const getOccupancyAdjustment = (basePrice: number) => {
    const threshold = occupancyThresholds.find(t => currentOccupancy >= t.threshold);
    if (!threshold) return 0;
    
    return threshold.type === 'percent' 
      ? Math.round(basePrice * (threshold.adjustment / 100))
      : threshold.adjustment;
  };

  // Calculate pricing suggestions with all factors
  const calculatePricingSuggestions = () => {
    const selectedUnit = unitTypePricing.find(unit => unit.type === selectedUnitType);
    if (!selectedUnit) return [];

    const compPrice = calculateCompPrice();
    const baseRent = selectedUnit.baseRent;
    
    // North Star price from comp analysis
    const northStarPrice = Math.round((baseRent + compPrice) / 2);
    const occupancyAdjustment = getOccupancyAdjustment(northStarPrice);

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
      let finalRent = northStarPrice + occupancyAdjustment;
      finalRent += termAdj.type === 'percent' 
        ? Math.round(finalRent * (termAdj.adjustment / 100))
        : termAdj.adjustment;

      // Apply min/max constraints
      finalRent = Math.max(selectedUnit.minRent, Math.min(selectedUnit.maxRent, finalRent));

      suggestions.push({
        term: termAdj.term,
        rent: Math.round(finalRent),
        expirationMonth,
        isAllowed: isTermAllowed,
        breakdown: {
          northStarPrice,
          compPrice,
          baseRent,
          occupancyAdjustment,
          termAdjustment: termAdj.adjustment,
          constraints: `${selectedUnit.minRent} - ${selectedUnit.maxRent}`
        }
      });
    }

    return suggestions.sort((a, b) => b.rent - a.rent);
  };

  const pricingSuggestions = calculatePricingSuggestions();

  const addNewComp = () => {
    setMarketComps([...marketComps, {
      name: 'New Property',
      studio: 2500,
      oneBR: 3000,
      twoBR: 3800,
      threeBR: 4800,
      weight: 0,
      quality: 5
    }]);
  };

  const removeComp = (index: number) => {
    setMarketComps(marketComps.filter((_, i) => i !== index));
  };

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
          <p className="text-gray-600">Advanced pricing engine with occupancy thresholds, comp analysis, and unit-specific constraints</p>
        </div>

        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pricing">Pricing Engine</TabsTrigger>
            <TabsTrigger value="comps">Comp Analysis</TabsTrigger>
            <TabsTrigger value="thresholds">Occupancy Rules</TabsTrigger>
            <TabsTrigger value="expiration">Expiration Control</TabsTrigger>
            <TabsTrigger value="forecast">18-Week Forecast</TabsTrigger>
          </TabsList>

          {/* Pricing Engine Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Parameters */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Current Parameters
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
                    <p className="text-xs text-gray-500 mt-1">
                      Threshold: {occupancyThresholds.find(t => currentOccupancy >= t.threshold)?.adjustment || 0}% adjustment
                    </p>
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
                            {unit.type} ({unit.unitCount} units)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Move-In Date</Label>
                    <Input
                      type="date"
                      value={selectedMoveInDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedMoveInDate(new Date(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* North Star Pricing */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    North Star Pricing Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Comp Average</div>
                      <div className="text-xl font-semibold">${calculateCompPrice().toLocaleString()}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Base Rent</div>
                      <div className="text-xl font-semibold">
                        ${unitTypePricing.find(u => u.type === selectedUnitType)?.baseRent.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600">North Star</div>
                      <div className="text-xl font-semibold text-yellow-700">
                        ${Math.round((calculateCompPrice() + (unitTypePricing.find(u => u.type === selectedUnitType)?.baseRent || 0)) / 2).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Occupancy Impact</div>
                      <div className="text-xl font-semibold text-purple-700">
                        {getOccupancyAdjustment(Math.round((calculateCompPrice() + (unitTypePricing.find(u => u.type === selectedUnitType)?.baseRent || 0)) / 2)) >= 0 ? '+' : ''}
                        ${getOccupancyAdjustment(Math.round((calculateCompPrice() + (unitTypePricing.find(u => u.type === selectedUnitType)?.baseRent || 0)) / 2)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Term</TableHead>
                        <TableHead>Suggested Rent</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pricingSuggestions.slice(0, 6).map((suggestion) => (
                        <TableRow key={suggestion.term}>
                          <TableCell className="font-medium">{suggestion.term} months</TableCell>
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
                                Apply
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
          </TabsContent>

          {/* Comp Analysis Tab */}
          <TabsContent value="comps" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Market Comparables Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Configure competitor properties and their pricing by unit type</p>
                </div>
                <Button onClick={addNewComp} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Property
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Studio</TableHead>
                      <TableHead>1BR</TableHead>
                      <TableHead>2BR</TableHead>
                      <TableHead>3BR</TableHead>
                      <TableHead>Weight (%)</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketComps.map((comp, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={comp.name}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].name = e.target.value;
                              setMarketComps(newComps);
                            }}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.studio}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].studio = parseInt(e.target.value);
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.oneBR}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].oneBR = parseInt(e.target.value);
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.twoBR}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].twoBR = parseInt(e.target.value);
                              setMarketComps(newComps);
                            }}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={comp.threeBR}
                            onChange={(e) => {
                              const newComps = [...marketComps];
                              newComps[index].threeBR = parseInt(e.target.value);
                              setMarketComps(newComps);
                            }}
                            className="w-20"
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeComp(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Weighted Averages by Unit Type</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Studio</div>
                      <div className="text-lg font-semibold">${Math.round(marketComps.reduce((sum, comp) => sum + (comp.studio * comp.weight / 100), 0)).toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">1BR</div>
                      <div className="text-lg font-semibold">${Math.round(marketComps.reduce((sum, comp) => sum + (comp.oneBR * comp.weight / 100), 0)).toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">2BR</div>
                      <div className="text-lg font-semibold">${Math.round(marketComps.reduce((sum, comp) => sum + (comp.twoBR * comp.weight / 100), 0)).toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">3BR</div>
                      <div className="text-lg font-semibold">${Math.round(marketComps.reduce((sum, comp) => sum + (comp.threeBR * comp.weight / 100), 0)).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Thresholds Tab */}
          <TabsContent value="thresholds" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Thresholds & Adjustments</CardTitle>
                  <p className="text-sm text-gray-600">Configure pricing adjustments based on occupancy levels</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {occupancyThresholds.map((threshold, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <Label className="text-sm">≥{threshold.threshold}% occupancy</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={threshold.adjustment}
                            onChange={(e) => {
                              const newThresholds = [...occupancyThresholds];
                              newThresholds[index].adjustment = parseFloat(e.target.value);
                              setOccupancyThresholds(newThresholds);
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
                  <CardTitle>Unit Type Constraints</CardTitle>
                  <p className="text-sm text-gray-600">Set minimum and maximum rent limits by unit type</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {unitTypePricing.map((unit, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{unit.type}</h4>
                          <Badge>{unit.unitCount} units</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Min Rent</Label>
                            <Input
                              type="number"
                              value={unit.minRent}
                              onChange={(e) => {
                                const newUnits = [...unitTypePricing];
                                newUnits[index].minRent = parseInt(e.target.value);
                                setUnitTypePricing(newUnits);
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Base Rent</Label>
                            <Input
                              type="number"
                              value={unit.baseRent}
                              onChange={(e) => {
                                const newUnits = [...unitTypePricing];
                                newUnits[index].baseRent = parseInt(e.target.value);
                                setUnitTypePricing(newUnits);
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Max Rent</Label>
                            <Input
                              type="number"
                              value={unit.maxRent}
                              onChange={(e) => {
                                const newUnits = [...unitTypePricing];
                                newUnits[index].maxRent = parseInt(e.target.value);
                                setUnitTypePricing(newUnits);
                              }}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expiration Control Tab */}
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
                              newAllocation[index].maxUnits = Math.floor(300 * parseInt(e.target.value) / 100);
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
                      <TableHead>Pricing Impact</TableHead>
                      <TableHead>Move-Ins</TableHead>
                      <TableHead>Move-Outs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyForecast.map((week) => {
                      const threshold = occupancyThresholds.find(t => week.occupancy >= t.threshold);
                      return (
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
                          <TableCell>
                            <span className={threshold?.adjustment > 0 ? 'text-green-600' : threshold?.adjustment < 0 ? 'text-red-600' : 'text-gray-600'}>
                              {threshold?.adjustment >= 0 ? '+' : ''}{threshold?.adjustment || 0}%
                            </span>
                          </TableCell>
                          <TableCell className="text-green-600">+{week.moveIns}</TableCell>
                          <TableCell className="text-red-600">-{week.moveOuts}</TableCell>
                        </TableRow>
                      );
                    })}
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
